export function notifier(message) {
  if (typeof window?.notify === 'function') {
    window.notify('Notification', message).catch((err) => {
      console.error('Failed to send notification:', err)
    })
  } else {
    console.warn('window.notify is not available')
  }
}

export default notifier
