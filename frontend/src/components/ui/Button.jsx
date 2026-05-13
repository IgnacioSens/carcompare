const variants = {
  primary:   'bg-primary-container text-white hover:bg-surface-tint',
  secondary: 'bg-surface-container text-on-surface border border-outline-variant hover:bg-surface-dim',
  outline:   'bg-white dark:bg-surface-container text-on-surface border border-outline-variant hover:border-primary-container',
  ghost:     'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-low',
}
const sizes = {
  sm: 'px-4 py-2 text-[11px]',
  md: 'px-6 py-2.5 text-[13px]',
  lg: 'px-8 py-3.5 text-sm',
}

export function Button({ children, variant = 'primary', size = 'md', icon, iconPosition = 'right', fullWidth, onClick, type = 'button', disabled, className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-semibold tracking-wide uppercase rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {icon && iconPosition === 'left'  && <span className="material-symbols-outlined" style={{fontSize:18}}>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="material-symbols-outlined" style={{fontSize:18}}>{icon}</span>}
    </button>
  )
}
