export function Button({ children, className = "", ...props }) {
  return (
    <button {...props} className={`px-4 py-2 bg-black text-white rounded ${className}`}>
      {children}
    </button>
  );
}
