import { forwardRef } from 'react'

const variants = {
  primary:  'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md active:scale-95',
  outline:  'border-2 border-green-600 text-green-700 hover:bg-green-50 active:scale-95',
  ghost:    'text-green-700 hover:bg-green-100 active:scale-95',
  danger:   'bg-red-500 hover:bg-red-600 text-white active:scale-95',
  amber:    'bg-earth-500 hover:bg-earth-600 text-white active:scale-95',
  white:    'bg-white hover:bg-green-50 text-green-800 shadow active:scale-95',
}

const sizes = {
  xs:  'px-3 py-1.5 text-xs rounded-lg',
  sm:  'px-4 py-2 text-sm rounded-xl',
  md:  'px-5 py-2.5 text-sm rounded-xl',
  lg:  'px-7 py-3.5 text-base rounded-2xl',
}

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    leftIcon,
    rightIcon,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
})

export default Button
