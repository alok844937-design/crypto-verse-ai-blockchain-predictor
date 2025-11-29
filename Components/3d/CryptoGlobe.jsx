import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CryptoGlobe({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    let animationId;
    let angle = 0;

    const particles = Array(150).fill(0).map(() => ({
      theta: Math.random() * Math.PI * 2,
      phi: Math.acos(2 * Math.random() - 1),
      size: Math.random() * 2 + 1
    }));

    const connections = Array(80).fill(0).map(() => ({
      start: Math.floor(Math.random() * particles.length),
      end: Math.floor(Math.random() * particles.length)
    }));

    const floatingCoins = [
      { x: 0.7, y: 0.25, color: '#f7931a', name: 'BTC' },
      { x: 0.2, y: 0.7, color: '#627eea', name: 'ETH' },
      { x: 0.85, y: 0.6, color: '#00f5ff', name: 'SOL' }
    ];

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
      ctx.fillRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5);
      gradient.addColorStop(0, 'rgba(0, 245, 255, 0.1)');
      gradient.addColorStop(0.5, 'rgba(191, 0, 255, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      for (let i = 1; i < 6; i++) {
        const latRadius = radius * Math.sin((i / 6) * Math.PI);
        const yOffset = radius * Math.cos((i / 6) * Math.PI);
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + yOffset, latRadius, latRadius * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let i = 0; i < 8; i++) {
        const longAngle = (i / 8) * Math.PI + angle;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius * Math.abs(Math.cos(longAngle)), radius, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(191, 0, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      particles.forEach((p) => {
        const x = centerX + radius * Math.sin(p.phi) * Math.cos(p.theta + angle);
        const y = centerY + radius * Math.cos(p.phi);
        const z = Math.sin(p.phi) * Math.sin(p.theta + angle);
        
        if (z > -0.2) {
          const opacity = (z + 1) / 2;
          ctx.beginPath();
          ctx.arc(x, y, p.size * opacity, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 245, 255, ${opacity * 0.8})`;
          ctx.fill();
        }
      });

      connections.forEach(conn => {
        const p1 = particles[conn.start];
        const p2 = particles[conn.end];
        
        const x1 = centerX + radius * Math.sin(p1.phi) * Math.cos(p1.theta + angle);
        const y1 = centerY + radius * Math.cos(p1.phi);
        const z1 = Math.sin(p1.phi) * Math.sin(p1.theta + angle);
        
        const x2 = centerX + radius * Math.sin(p2.phi) * Math.cos(p2.theta + angle);
        const y2 = centerY + radius * Math.cos(p2.phi);
        const z2 = Math.sin(p2.phi) * Math.sin(p2.theta + angle);
        
        if (z1 > 0 && z2 > 0) {
          const opacity = Math.min(z1, z2) * 0.3;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(191, 0, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      ctx.save();
      ctx.translate(centerX, centerY);
      
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.3, radius * 0.4, angle * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.5, radius * 0.3, -angle * 0.3 + Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(191, 0, 255, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      ctx.restore();

      floatingCoins.forEach((coin, i) => {
        const floatY = Math.sin(angle * 2 + i * 2) * 10;
        const coinX = width * coin.x;
        const coinY = height * coin.y + floatY;
        
        const coinGlow = ctx.createRadialGradient(coinX, coinY, 0, coinX, coinY, 25);
        coinGlow.addColorStop(0, coin.color + '40');
        coinGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = coinGlow;
        ctx.fillRect(coinX - 25, coinY - 25, 50, 50);
        
        ctx.beginPath();
        ctx.arc(coinX, coinY, 12, 0, Math.PI * 2);
        ctx.fillStyle = coin.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(coin.name, coinX, coinY + 28);
      });

      angle += 0.005;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="w-full h-full"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-[60px]"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/20 rounded-full blur-[80px]"
        />
      </div>
    </div>
  );
}