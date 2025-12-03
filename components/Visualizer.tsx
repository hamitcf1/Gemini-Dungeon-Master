import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  analyser: AnalyserNode | null;
  isActive: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ analyser, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !analyser) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isActive) {
        // Draw idle circle
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, 2 * Math.PI);
        ctx.strokeStyle = '#4c1d95'; // violet-900
        ctx.lineWidth = 2;
        ctx.stroke();
        return;
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 50;

      ctx.beginPath();
      // Draw a circular visualizer
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        const rads = (Math.PI * 2) * (i / bufferLength);
        
        const x = centerX + Math.cos(rads) * (radius + barHeight);
        const y = centerY + Math.sin(rads) * (radius + barHeight);
        const xEnd = centerX + Math.cos(rads) * radius;
        const yEnd = centerY + Math.sin(rads) * radius;

        ctx.moveTo(xEnd, yEnd);
        ctx.lineTo(x, y);
      }

      ctx.lineCap = 'round';
      ctx.lineWidth = 2;
      // Gradient stroke
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#a78bfa'); // violet-400
      gradient.addColorStop(1, '#ec4899'); // pink-500
      ctx.strokeStyle = gradient;
      ctx.stroke();
    };

    draw();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [analyser, isActive]);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <div className={`absolute inset-0 rounded-full bg-violet-900/20 blur-xl transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-20'}`}></div>
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={300} 
        className="z-10 w-full h-full"
      />
    </div>
  );
};

export default Visualizer;