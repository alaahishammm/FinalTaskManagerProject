// src/components/common/Input.jsx
const Input = ({ label, id, type = 'text', error, ...props }) => {
    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          className={`w-full px-3 py-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  };
  
  export default Input;