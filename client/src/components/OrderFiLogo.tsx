export default function OrderFiLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Animated handwritten OrderFi text with joined letters */}
        <h1 
          className="text-6xl md:text-7xl lg:text-8xl font-heading text-gray-900 orderfi-logo-animation"
          style={{
            fontWeight: '400',
            letterSpacing: '-0.02em', // Negative spacing to join letters
            lineHeight: '1.1',
            animation: 'orderfi-write-in 2.5s ease-out forwards'
          }}
        >
          OrderFi
        </h1>
      </div>
    </div>
  );
}