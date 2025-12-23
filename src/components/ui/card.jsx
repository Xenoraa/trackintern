const card = ({ 
  children, 
  className = '', 
  title, 
  subtitle, 
  actions,
  noPadding = false 
}) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
          </div>
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </div>
  );
};

export default card;