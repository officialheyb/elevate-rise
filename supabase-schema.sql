-- ════════════════════════════════════════════════════════════
-- ELEVATE: RISE — Database Schema (v1 MVP)
-- Run this entire file in Supabase SQL Editor
-- ════════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- PROFILES (extends Supabase auth.users)
-- ────────────────────────────────────────────────────────────
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  telegram_handle text,
  character_gender text check (character_gender in ('male','female')) not null default 'male',
  total_ep bigint not null default 0,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_login_date date,
  housing_level int not null default 0, -- 0=Studio, 1=Small Apt, 2=Townhome, 3=House, 4=Luxury, 5=Mansion
  rank_label text not null default 'Newcomer',
  referral_code text unique not null default substr(md5(random()::text), 0, 9),
  referred_by uuid references profiles(id),
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for leaderboard sorting
create index idx_profiles_total_ep on profiles(total_ep desc);
create index idx_profiles_referral_code on profiles(referral_code);

-- ────────────────────────────────────────────────────────────
-- EP TRANSACTIONS (full audit log of every EP change)
-- ────────────────────────────────────────────────────────────
create table ep_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  amount bigint not null, -- can be negative for admin removals
  source text not null check (source in (
    'daily_login','streak_bonus','tap','morning_session','evening_session',
    'referral_joined','referral_active','admin_grant','admin_removal'
  )),
  note text,
  created_at timestamptz not null default now()
);
create index idx_ep_tx_user on ep_transactions(user_id, created_at desc);

-- ────────────────────────────────────────────────────────────
-- DAILY ACTIVITY (one row per user per day — tracks everything daily)
-- ────────────────────────────────────────────────────────────
create table daily_activity (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  activity_date date not null default current_date,
  did_login boolean not null default false,
  tap_count int not null default 0,
  morning_session_at timestamptz,
  evening_session_at timestamptz,
  ep_earned_today bigint not null default 0,
  unique(user_id, activity_date)
);
create index idx_daily_activity_user_date on daily_activity(user_id, activity_date desc);

-- ────────────────────────────────────────────────────────────
-- REFERRALS
-- ────────────────────────────────────────────────────────────
create table referrals (
  id uuid primary key default uuid_generate_v4(),
  referrer_id uuid references profiles(id) on delete cascade not null,
  referred_id uuid references profiles(id) on delete cascade not null unique,
  is_active boolean not null default false, -- becomes true after 3 distinct login days
  distinct_login_days int not null default 0,
  joined_bonus_paid boolean not null default false,
  active_bonus_paid boolean not null default false,
  created_at timestamptz not null default now(),
  activated_at timestamptz
);
create index idx_referrals_referrer on referrals(referrer_id);

-- ────────────────────────────────────────────────────────────
-- HOUSING TIERS (lookup table — easy to extend later)
-- ────────────────────────────────────────────────────────────
create table housing_tiers (
  level int primary key,
  name text not null,
  ep_required bigint not null,
  emoji text not null
);
insert into housing_tiers (level, name, ep_required, emoji) values
  (0, 'Studio Apartment', 0, '🏠'),
  (1, 'Small Apartment', 10000, '🏡'),
  (2, 'Townhome', 50000, '🏘️'),
  (3, 'House', 150000, '🏰'),
  (4, 'Luxury Home', 500000, '🏛️'),
  (5, 'Mansion', 1000000, '🏆');

-- ────────────────────────────────────────────────────────────
-- RANK TIERS (lookup table)
-- ────────────────────────────────────────────────────────────
create table rank_tiers (
  ep_required bigint primary key,
  name text not null
);
insert into rank_tiers (ep_required, name) values
  (0, 'Newcomer'),
  (10000, 'Rising'),
  (50000, 'Focused'),
  (100000, 'Consistent'),
  (250000, 'Builder'),
  (500000, 'Leader'),
  (1000000, 'Elevated');

-- ════════════════════════════════════════════════════════════
-- FUNCTIONS
-- ════════════════════════════════════════════════════════════

-- Recalculate housing + rank after EP change
create or replace function update_progression(p_user_id uuid)
returns void as $$
declare
  v_ep bigint;
  v_housing int;
  v_rank text;
begin
  select total_ep into v_ep from profiles where id = p_user_id;

  select level into v_housing from housing_tiers
    where ep_required <= v_ep order by ep_required desc limit 1;

  select name into v_rank from rank_tiers
    where ep_required <= v_ep order by ep_required desc limit 1;

  update profiles set
    housing_level = coalesce(v_housing, 0),
    rank_label = coalesce(v_rank, 'Newcomer'),
    updated_at = now()
  where id = p_user_id;
end;
$$ language plpgsql security definer;

-- Award EP safely (logs transaction + updates total + recalculates progression)
create or replace function award_ep(
  p_user_id uuid,
  p_amount bigint,
  p_source text,
  p_note text default null
)
returns void as $$
begin
  insert into ep_transactions (user_id, amount, source, note)
  values (p_user_id, p_amount, p_source, p_note);

  update profiles set total_ep = total_ep + p_amount, updated_at = now()
  where id = p_user_id;

  perform update_progression(p_user_id);
end;
$$ language plpgsql security definer;

-- Daily login handler (streak logic + EP award)
create or replace function handle_daily_login(p_user_id uuid)
returns jsonb as $$
declare
  v_last_login date;
  v_current_streak int;
  v_today date := current_date;
  v_streak_bonus bigint := 0;
  v_result jsonb;
begin
  select last_login_date, current_streak into v_last_login, v_current_streak
  from profiles where id = p_user_id;

  -- already logged in today
  if v_last_login = v_today then
    return jsonb_build_object('already_logged_in', true);
  end if;

  -- determine new streak
  if v_last_login = v_today - interval '1 day' then
    v_current_streak := v_current_streak + 1;
  else
    v_current_streak := 1;
  end if;

  -- streak milestone bonuses
  if v_current_streak = 7 then v_streak_bonus := 1000;
  elsif v_current_streak = 30 then v_streak_bonus := 5000;
  elsif v_current_streak = 90 then v_streak_bonus := 25000;
  end if;

  update profiles set
    current_streak = v_current_streak,
    longest_streak = greatest(longest_streak, v_current_streak),
    last_login_date = v_today
  where id = p_user_id;

  perform award_ep(p_user_id, 100, 'daily_login', 'Daily login reward');

  if v_streak_bonus > 0 then
    perform award_ep(p_user_id, v_streak_bonus, 'streak_bonus', v_current_streak || '-day streak bonus');
  end if;

  insert into daily_activity (user_id, activity_date, did_login, ep_earned_today)
  values (p_user_id, v_today, true, 100 + v_streak_bonus)
  on conflict (user_id, activity_date)
  do update set did_login = true, ep_earned_today = daily_activity.ep_earned_today + 100 + v_streak_bonus;

  -- referral activity tracking (distinct login days)
  update referrals set
    distinct_login_days = distinct_login_days + 1
  where referred_id = p_user_id and is_active = false;

  -- activate referral + pay referrer if 3 distinct days reached
  update referrals set
    is_active = true,
    activated_at = now()
  where referred_id = p_user_id and is_active = false and distinct_login_days >= 3;

  -- pay active bonus to referrer if just activated
  perform award_ep(referrer_id, 5000, 'referral_active', 'Referral became active')
  from referrals
  where referred_id = p_user_id and is_active = true and active_bonus_paid = false;

  update referrals set active_bonus_paid = true
  where referred_id = p_user_id and is_active = true and active_bonus_paid = false;

  v_result := jsonb_build_object(
    'streak', v_current_streak,
    'login_ep', 100,
    'streak_bonus', v_streak_bonus
  );
  return v_result;
end;
$$ language plpgsql security definer;

-- Tap handler (with daily limit enforcement)
create or replace function handle_tap(p_user_id uuid)
returns jsonb as $$
declare
  v_today date := current_date;
  v_tap_count int;
begin
  select tap_count into v_tap_count
  from daily_activity where user_id = p_user_id and activity_date = v_today;

  if v_tap_count is null then
    insert into daily_activity (user_id, activity_date, tap_count, ep_earned_today)
    values (p_user_id, v_today, 1, 1);
    v_tap_count := 1;
  else
    if v_tap_count >= 500 then
      return jsonb_build_object('limit_reached', true, 'tap_count', v_tap_count);
    end if;
    update daily_activity set
      tap_count = tap_count + 1,
      ep_earned_today = ep_earned_today + 1
    where user_id = p_user_id and activity_date = v_today;
    v_tap_count := v_tap_count + 1;
  end if;

  perform award_ep(p_user_id, 1, 'tap', null);

  return jsonb_build_object('limit_reached', false, 'tap_count', v_tap_count);
end;
$$ language plpgsql security definer;

-- Session check-in handler (morning/evening, with time-window validation)
create or replace function handle_session_checkin(p_user_id uuid, p_session text)
returns jsonb as $$
declare
  v_today date := current_date;
  v_now time := (now() at time zone 'America/Chicago')::time;
  v_already boolean;
  v_window_open boolean := false;
begin
  if p_session = 'morning' then
    v_window_open := v_now >= '08:00:00' and v_now <= '08:30:00';
  elsif p_session = 'evening' then
    v_window_open := v_now >= '20:00:00' and v_now <= '20:30:00';
  else
    return jsonb_build_object('error', 'invalid_session');
  end if;

  if not v_window_open then
    return jsonb_build_object('window_closed', true);
  end if;

  if p_session = 'morning' then
    select (morning_session_at is not null) into v_already
    from daily_activity where user_id = p_user_id and activity_date = v_today;
  else
    select (evening_session_at is not null) into v_already
    from daily_activity where user_id = p_user_id and activity_date = v_today;
  end if;

  if v_already then
    return jsonb_build_object('already_checked_in', true);
  end if;

  insert into daily_activity (user_id, activity_date)
  values (p_user_id, v_today)
  on conflict (user_id, activity_date) do nothing;

  if p_session = 'morning' then
    update daily_activity set morning_session_at = now(), ep_earned_today = ep_earned_today + 1000
    where user_id = p_user_id and activity_date = v_today;
  else
    update daily_activity set evening_session_at = now(), ep_earned_today = ep_earned_today + 1000
    where user_id = p_user_id and activity_date = v_today;
  end if;

  perform award_ep(p_user_id, 1000, p_session || '_session', initcap(p_session) || ' Lift session check-in');

  return jsonb_build_object('success', true, 'ep_awarded', 1000);
end;
$$ language plpgsql security definer;

-- Process new referral signup
create or replace function process_referral_signup(p_new_user_id uuid, p_referral_code text)
returns void as $$
declare
  v_referrer_id uuid;
begin
  select id into v_referrer_id from profiles where referral_code = p_referral_code;

  if v_referrer_id is not null and v_referrer_id != p_new_user_id then
    insert into referrals (referrer_id, referred_id)
    values (v_referrer_id, p_new_user_id);

    update profiles set referred_by = v_referrer_id where id = p_new_user_id;

    perform award_ep(v_referrer_id, 1000, 'referral_joined', 'Referral joined');
  end if;
end;
$$ language plpgsql security definer;

-- ════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════
alter table profiles enable row level security;
alter table ep_transactions enable row level security;
alter table daily_activity enable row level security;
alter table referrals enable row level security;

-- Profiles: everyone can read (for leaderboard), only owner can update
create policy "Profiles are viewable by everyone"
  on profiles for select using (true);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- EP transactions: only owner can view their own
create policy "Users can view own transactions"
  on ep_transactions for select using (auth.uid() = user_id);

-- Daily activity: only owner can view/edit their own
create policy "Users can view own activity"
  on daily_activity for select using (auth.uid() = user_id);
create policy "Users can insert own activity"
  on daily_activity for insert with check (auth.uid() = user_id);
create policy "Users can update own activity"
  on daily_activity for update using (auth.uid() = user_id);

-- Referrals: referrer can see their own referrals
create policy "Users can view own referrals"
  on referrals for select using (auth.uid() = referrer_id or auth.uid() = referred_id);
create policy "Anyone can insert referrals"
  on referrals for insert with check (true);

-- Housing/rank tiers: public read
alter table housing_tiers enable row level security;
alter table rank_tiers enable row level security;
create policy "Housing tiers are public" on housing_tiers for select using (true);
create policy "Rank tiers are public" on rank_tiers for select using (true);

-- ════════════════════════════════════════════════════════════
-- ADMIN: grant yourself admin after creating your account:
-- update profiles set is_admin = true where username = 'YOUR_USERNAME';
-- ════════════════════════════════════════════════════════════
