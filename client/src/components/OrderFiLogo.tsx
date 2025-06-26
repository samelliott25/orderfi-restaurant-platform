import { useEffect, useRef } from 'react';

export default function OrderFiLogo({ className = "" }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Ensure video plays automatically
      video.play().catch(console.error);
    }
  }, []);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-96 h-auto max-w-full"
          style={{ 
            filter: 'drop-shadow(0 4px 8px rgba(139, 121, 94, 0.2))',
            maxHeight: '200px'
          }}
        >
          <source src="/attached_assets/20250625_2213_Elegant Logo Animation_loop_01jykg3kywe6yadwjhwn5nypcx_1750933286114.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}