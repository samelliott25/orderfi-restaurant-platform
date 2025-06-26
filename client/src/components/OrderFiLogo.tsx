export default function OrderFiLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Simple, clean OrderFi text matching the original */}
        <h1 
          className="text-6xl md:text-7xl lg:text-8xl font-heading text-gray-900"
          style={{
            fontWeight: '400', // Lighter weight for elegance
            letterSpacing: '0.02em',
            lineHeight: '1.1'
          }}
        >
          OrderFi
        </h1>
      </div>
    </div>
  );
}