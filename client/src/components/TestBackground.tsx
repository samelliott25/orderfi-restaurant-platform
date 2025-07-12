import React from 'react';

export const TestBackground = () => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        background: 'linear-gradient(135deg, #FF6B00 0%, #FFA500 100%)',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '20%',
          width: '20px',
          height: '200px',
          background: 'linear-gradient(to bottom, #00FF7F 0%, #FFFF00 100%)',
          borderRadius: '50px',
          opacity: 0.8,
          transform: 'rotate(-30deg)',
          animation: 'test-fall 5s linear infinite',
        }}
      />
      <style>{`
        @keyframes test-fall {
          0% { top: -10%; }
          100% { top: 110%; }
        }
      `}</style>
    </div>
  );
};

export default TestBackground;