type CalloutType = 'success' | 'info' | 'warning' | 'error'

interface CalloutProps {
  type: CalloutType
  message: string
}

interface CalloutColors {
  bg: string
  border: string
  text: string
}

const colors: Record<CalloutType, CalloutColors> = {
  success: {
    bg: 'bg-emerald-100',
    border: 'bg-emerald-500',
    text: 'text-emerald-800'
  },
  info: {
    bg: 'bg-sky-100',
    border: 'bg-sky-500',
    text: 'text-sky-800'
  },
  warning: {
    bg: 'bg-yellow-100',
    border: 'bg-yellow-500',
    text: 'text-yellow-800'
  },
  error: {
    bg: 'bg-rose-100',
    border: 'bg-rose-500',
    text: 'text-rose-800'
  }
}

export function Callout({ type, message }: CalloutProps) {
  const { bg, border, text } = colors[type]

  return (
    <div className={`text-sm flex ${bg}`}>
      <div className={`w-2 block ${border}`}></div>
      <div className='p-5'>
        <span className={`${text} font-semibold`}>{message}</span>
      </div>
    </div>
  )
}
