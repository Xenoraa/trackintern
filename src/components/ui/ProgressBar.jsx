import { useState, useEffect } from 'react';

const ProgressBar = ({
  value = 0,
  max = 100,
  showLabel = true,
  labelPosition = 'inside',
  size = 'md',
  color = 'gray',
  animate = true,
  striped = false,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Animate progress bar
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animate]);

  const percentage = Math.min(100, Math.max(0, (displayValue / max) * 100));

  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6'
  };

  const colorClasses = {
    gray: 'bg-gray-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600',
    indigo: 'bg-indigo-600',
    pink: 'bg-pink-600'
  };

  const bgColorClasses = {
    gray: 'bg-gray-200',
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100',
    indigo: 'bg-indigo-100',
    pink: 'bg-pink-100'
  };

  const labelClasses = {
    gray: 'text-gray-700',
    blue: 'text-blue-700',
    green: 'text-green-700',
    red: 'text-red-700',
    yellow: 'text-yellow-700',
    purple: 'text-purple-700',
    indigo: 'text-indigo-700',
    pink: 'text-pink-700'
  };

  const renderLabel = () => {
    if (!showLabel) return null;

    const labelText = `${Math.round(percentage)}%`;

    if (labelPosition === 'inside' && percentage > 20) {
      return (
        <span className={`absolute inset-0 flex items-center justify-center text-xs font-medium text-white`}>
          {labelText}
        </span>
      );
    }

    if (labelPosition === 'outside') {
      return (
        <div className="flex justify-between text-xs mb-1">
          <span className={labelClasses[color]}>Progress</span>
          <span className="font-medium text-gray-700">{labelText}</span>
        </div>
      );
    }

    if (labelPosition === 'top') {
      return (
        <div className="flex justify-between text-xs mb-1">
          <span className={labelClasses[color]}>Progress</span>
          <span className="font-medium text-gray-700">{labelText}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Top Label */}
      {labelPosition === 'top' && renderLabel()}

      {/* Outside Label */}
      {labelPosition === 'outside' && renderLabel()}

      {/* Progress Bar Container */}
      <div className={`relative ${sizeClasses[size]} ${bgColorClasses[color]} rounded-full overflow-hidden`}>
        {/* Progress Fill */}
        <div
          className={`absolute top-0 left-0 h-full ${colorClasses[color]} rounded-full transition-all duration-300 ease-out ${
            striped ? 'striped-progress' : ''
          }`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          {/* Inside Label */}
          {labelPosition === 'inside' && percentage > 20 && renderLabel()}
        </div>

        {/* Outside Label for small percentages */}
        {labelPosition === 'inside' && percentage <= 20 && showLabel && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
            {Math.round(percentage)}%
          </span>
        )}
      </div>

      {/* Bottom Label (Optional) */}
      {labelPosition === 'bottom' && (
        <div className="flex justify-between text-xs mt-1">
          <span className={labelClasses[color]}>Progress</span>
          <span className="font-medium text-gray-700">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
};

// Circular Progress Bar Variant
ProgressBar.Circular = ({
  value = 0,
  max = 100,
  size = 64,
  strokeWidth = 4,
  color = 'gray',
  showValue = true,
  label,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 10);
    return () => clearTimeout(timer);
  }, [value]);

  const percentage = Math.min(100, Math.max(0, (displayValue / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    gray: 'stroke-gray-600',
    blue: 'stroke-blue-600',
    green: 'stroke-green-600',
    red: 'stroke-red-600',
    yellow: 'stroke-yellow-600',
    purple: 'stroke-purple-600',
    indigo: 'stroke-indigo-600',
    pink: 'stroke-pink-600'
  };

  const textColorClasses = {
    gray: 'text-gray-700',
    blue: 'text-blue-700',
    green: 'text-green-700',
    red: 'text-red-700',
    yellow: 'text-yellow-700',
    purple: 'text-purple-700',
    indigo: 'text-indigo-700',
    pink: 'text-pink-700'
  };

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-gray-200 fill-none"
        />
        
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={`${colorClasses[color]} fill-none transition-all duration-300 ease-out`}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      {/* Center Text */}
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-sm font-bold ${textColorClasses[color]}`}>
            {Math.round(percentage)}%
          </span>
          {label && (
            <span className="text-xs text-gray-500 mt-1">{label}</span>
          )}
        </div>
      )}
    </div>
  );
};

// Multi-segment Progress Bar
ProgressBar.Segmented = ({
  segments,
  size = 'md',
  className = ''
}) => {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  let accumulated = 0;

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden flex`}>
        {segments.map((segment, index) => {
          const width = (segment.value / total) * 100;
          const segmentStyle = {
            width: `${width}%`,
            backgroundColor: segment.color || '#6b7280'
          };

          accumulated += width;

          return (
            <div
              key={index}
              className="h-full transition-all duration-300"
              style={segmentStyle}
              title={`${segment.label}: ${segment.value} (${Math.round(width)}%)`}
            />
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center text-xs">
            <div 
              className="w-3 h-3 rounded mr-2"
              style={{ backgroundColor: segment.color || '#6b7280' }}
            />
            <span className="text-gray-700">{segment.label}</span>
            <span className="text-gray-500 ml-1">({segment.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Progress Bar with Steps
ProgressBar.Steps = ({
  steps,
  currentStep = 1,
  size = 'md',
  className = ''
}) => {
  const totalSteps = steps.length;
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div className="relative">
        <div className={`${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden`}>
          <div
            className="absolute top-0 left-0 h-full bg-gray-800 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber <= currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div key={index} className="flex flex-col items-center relative">
                {/* Step Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gray-900 text-white border-gray-900'
                      : isCurrent
                      ? 'bg-white text-gray-900 border-gray-900'
                      : 'bg-white text-gray-400 border-gray-300'
                  }`}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>

                {/* Step Label */}
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>

                {/* Step Description */}
                {step.description && (
                  <span className="text-xs text-gray-500 mt-1 max-w-[120px] text-center">
                    {step.description}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Info */}
      {steps[currentStep - 1]?.info && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{steps[currentStep - 1].info}</p>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;