import React from 'react';

interface CustomerChatButtonProps {
  onClick: () => void;
  className?: string;
}

/**
 * Customer-facing AI chat button with OrderFi orb design
 * Saved from StandardLayout for reuse in customer chatbot applications
 */
export function CustomerChatButton({ onClick, className = "" }: CustomerChatButtonProps) {
  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[200] ${className}`}>
      <div className="relative">
        <button
          onClick={onClick}
          className="relative w-16 h-16 rounded-full overflow-hidden sentient-orb ai-gentle-float transition-all duration-300 ease-out hover:scale-110 active:scale-95 shadow-2xl"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(255, 126, 95, 0.9) 0%, transparent 60%),
              radial-gradient(circle at 70% 70%, rgba(245, 56, 85, 0.8) 0%, transparent 60%),
              radial-gradient(circle at 50% 50%, rgba(255, 192, 203, 0.7) 0%, transparent 70%)
            `,
          }}
        >
          {/* Cascading sparkles */}
          <div className="absolute inset-0 w-full h-full pointer-events-none text-white">
            <svg className="absolute ai-cascade-1" style={{ width: '1.5px', height: '1.5px', top: '25%', left: '15%', transform: 'rotate(45deg)', animationDelay: '0s' }} viewBox="0 0 24 24" fill="white">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
            </svg>
            <svg className="absolute ai-cascade-2" style={{ width: '1.5px', height: '1.5px', top: '70%', left: '20%', transform: 'rotate(-67deg)', animationDelay: '1.3s' }} viewBox="0 0 24 24" fill="white">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
            </svg>
            <svg className="absolute ai-cascade-3" style={{ width: '1.5px', height: '1.5px', top: '30%', left: '85%', transform: 'rotate(123deg)', animationDelay: '2.5s' }} viewBox="0 0 24 24" fill="white">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
            </svg>
            <svg className="absolute ai-cascade-4" style={{ width: '1.5px', height: '1.5px', top: '10%', left: '70%', transform: 'rotate(-89deg)', animationDelay: '0.9s' }} viewBox="0 0 24 24" fill="white">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
            </svg>
            <svg className="absolute ai-cascade-5" style={{ width: '1.5px', height: '1.5px', top: '60%', left: '5%', transform: 'rotate(156deg)', animationDelay: '3.2s' }} viewBox="0 0 24 24" fill="white">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
            </svg>
            <svg className="absolute ai-cascade-6" style={{ width: '1.5px', height: '1.5px', top: '90%', left: '50%', transform: 'rotate(-201deg)', animationDelay: '1.4s' }} viewBox="0 0 24 24" fill="white">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
            </svg>
          </div>
          
          {/* Central star icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-7 h-7 text-white ai-star-pulse star-no-rotate drop-shadow-lg" viewBox="0 0 24 24" fill="white">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
            </svg>
          </div>
          
          {/* Orb Core with Hollow Center */}
          <div className="orb-core w-full h-full"></div>
          
          {/* Energy particles */}
          <div className="orb-energy-particle" style={{ top: '20%', left: '15%', animationDelay: '0s' }}></div>
          <div className="orb-energy-particle" style={{ top: '70%', left: '25%', animationDelay: '0.7s' }}></div>
          <div className="orb-energy-particle" style={{ top: '30%', right: '20%', animationDelay: '1.4s' }}></div>
          <div className="orb-energy-particle" style={{ bottom: '25%', right: '15%', animationDelay: '2.1s' }}></div>
          <div className="orb-energy-particle" style={{ top: '50%', left: '45%', animationDelay: '1.2s' }}></div>
        </button>
      </div>
    </div>
  );
}