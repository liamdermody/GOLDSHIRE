export function Card({ children, className = "" }) {
  return <div className={`border p-4 ${className}`}>{children}</div>;
}
export function CardHeader({ children }) { return <div className="mb-2">{children}</div>; }
export function CardTitle({ children, className = "" }) { return <h2 className={`font-semibold ${className}`}>{children}</h2>; }
export function CardContent({ children, className = "" }) { return <div className={className}>{children}</div>; }
