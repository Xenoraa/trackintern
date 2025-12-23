const Button = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500';
  
  const variants = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-400',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:text-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
  };
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2.5 text-sm',
    large: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;