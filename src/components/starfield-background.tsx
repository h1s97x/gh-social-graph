'use client';

import React, { useEffect, useRef } from 'react';

interface StarfieldBackgroundProps {
  starCount?: number;
}

export function StarfieldBackground({ starCount = 200 }: StarfieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      twinkleSpeed: number;
    }> = [];

    // 初始化画布尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    // 初始化星星
    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
          speed: Math.random() * 0.5 + 0.1,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
        });
      }
    };

    // 绘制星星
    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制渐变背景
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );
      gradient.addColorStop(0, 'rgba(15, 23, 42, 1)');
      gradient.addColorStop(0.5, 'rgba(30, 27, 75, 1)');
      gradient.addColorStop(1, 'rgba(10, 14, 39, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制每颗星星
      stars.forEach((star) => {
        // 更新闪烁效果
        star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.01;
        star.opacity = Math.max(0.2, Math.min(1, star.opacity));

        // 绘制发光效果
        const glowGradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.size * 3
        );
        glowGradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        glowGradient.addColorStop(
          0.5,
          `rgba(200, 220, 255, ${star.opacity * 0.5})`
        );
        glowGradient.addColorStop(1, 'rgba(200, 220, 255, 0)');

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // 绘制星星核心
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // 缓慢移动
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(drawStars);
    };

    resizeCanvas();
    drawStars();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [starCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ background: 'transparent' }}
    />
  );
}
