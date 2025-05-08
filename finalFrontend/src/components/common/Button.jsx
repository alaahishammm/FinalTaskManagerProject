// src/components/common/Button.jsx
const Button = ({ 
    children, 
    variant = 'primary', 
    type = 'button', 
    fullWidth = false,
    isLoading = false,
    disabled = false,
    ...props 
  }) => {
    const baseClasses = "px-4 py-2 rounded-md font-medium focus:outline-none transition-colors";
    
    const variants = {
      primary: "bg-primary-600 text-white hover:bg-primary-700",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      danger: "bg-red-600 text-white hover:bg-red-700",
    };
    
    return (
      <button
        type={type}
        className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <div className="flex justify-center items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        ) : (
          children
        )}
      </button>
    );
  };
  
  export default Button;