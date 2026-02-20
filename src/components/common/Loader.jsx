export default function Loader({ fullScreen = false, size = 'md', text = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-9 h-9', lg: 'w-14 h-14' }

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizes[size]} border-[3px] border-green-100 border-t-green-600 rounded-full animate-spin`}
      />
      {text && <p className="text-sm text-gray-400 font-medium">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-50/80 backdrop-blur-sm">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-16">
      {spinner}
    </div>
  )
}
