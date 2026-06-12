"use client";

import { useEffect, useRef } from "react";

type Petal = {
  x: number; y: number; size: number; opacity: number;
  speedX: number; speedY: number; rotation: number; rotationSpeed: number;
  color: string;
};

const COLORS = ["#e8c4b8", "#f0d5cc", "#c9977a", "#e8d5b7", "#d4a090", "#f5e6df"];

export default function FloatingPetals() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const petals: Petal[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 28; i++) {
      petals.push(makePetal(true));
    }

    function makePetal(scatter = false): Petal {
      return {
        x: Math.random() * (canvas?.width ?? window.innerWidth),
        y: scatter ? Math.random() * (canvas?.height ?? window.innerHeight) : -20,
        size: 6 + Math.random() * 10,
        opacity: 0.3 + Math.random() * 0.5,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: 0.4 + Math.random() * 0.8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    }

    function drawPetal(p: Petal) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        drawPetal(p);
        if (p.y > canvas.height + 20) {
          petals[i] = makePetal();
        }
      }
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ opacity: 0.7 }}
    />
  );
}
