import { useState, useCallback } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, icon = '✨') => {
    setToast({ message, icon })
    setTimeout(() => setToast(null), 2200)
  }, [])

  const ToastEl = toast ? (
    <div className="toast">
      <span>{toast.icon}</span>
      <span>{toast.message}</span>
    </div>
  ) : null

  return { showToast, ToastEl }
}
