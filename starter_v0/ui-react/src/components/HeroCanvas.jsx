import React, { useEffect, useRef } from 'react';
import { useTheme } from '../ThemeContext';

export default function HeroCanvas() {
    const canvasRef = useRef(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let w, h;
        let time = 0;
        
        const nodes = Array.from({length: 45}, (_, i) => ({
            x: Math.random(),
            y: Math.random(),
            vx: (Math.random() - 0.5) * 0.0008,
            vy: (Math.random() - 0.5) * 0.0008,
            label: i === 5 ? "Source Verified" : i === 12 ? "Method Extracted" : i === 25 ? "Citation Mapped" : null
        }));

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            w = canvas.parentElement.clientWidth;
            h = canvas.parentElement.clientHeight || 400; 
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.scale(dpr, dpr);
        };

        window.addEventListener('resize', resize);
        resize();

        const drawSonarMap = () => {
            if (!w || !h) resize();
            ctx.clearRect(0, 0, w, h);
            
            const isDark = document.documentElement.classList.contains('dark') || document.documentElement.className === ''; // Default dark
            
            // Re-check theme based on class list rather than state variable for immediate sync with DOM changes
            const baseColor = theme === 'dark' ? 'rgba(123, 208, 255,' : 'rgba(2, 132, 199,'; 
            
            const cx = w * 0.7;
            const cy = h * 0.5;

            const maxRadius = Math.max(w, h);
            const ringSpacing = 120;
            const offset = (time * 15) % ringSpacing;
            
            ctx.lineWidth = 1;
            for (let r = offset; r < maxRadius; r += ringSpacing) {
                const alpha = Math.max(0, 0.15 * (1 - r / maxRadius));
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, 2 * Math.PI);
                ctx.strokeStyle = `${baseColor} ${alpha})`;
                ctx.stroke();
            }

            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;
                if (node.x < 0 || node.x > 1) node.vx *= -1;
                if (node.y < 0 || node.y > 1) node.vy *= -1;
            });

            const maxDist = Math.min(w, h) * 0.25;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const px1 = nodes[i].x * w;
                    const py1 = nodes[i].y * h;
                    const px2 = nodes[j].x * w;
                    const py2 = nodes[j].y * h;
                    
                    const dist = Math.hypot(px2 - px1, py2 - py1);
                    if (dist < maxDist) {
                        const alpha = 0.25 * (1 - dist / maxDist);
                        ctx.beginPath();
                        ctx.moveTo(px1, py1);
                        ctx.lineTo(px2, py2);
                        ctx.strokeStyle = `${baseColor} ${alpha})`;
                        ctx.stroke();
                    }
                }
            }

            nodes.forEach(node => {
                const px = node.x * w;
                const py = node.y * h;
                
                ctx.beginPath();
                ctx.arc(px, py, node.label ? 4 : 2, 0, 2 * Math.PI);
                ctx.fillStyle = `${baseColor} 0.5)`;
                
                if (node.label) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = theme === 'dark' ? '#7bd0ff' : '#0284c7';
                    ctx.fillStyle = theme === 'dark' ? '#7bd0ff' : '#0284c7';
                }
                
                ctx.fill();
                ctx.shadowBlur = 0;

                if (node.label) {
                    ctx.font = '11px "JetBrains Mono"';
                    const textWidth = ctx.measureText(node.label).width;
                    ctx.fillStyle = theme === 'dark' ? 'rgba(5, 20, 36, 0.6)' : 'rgba(255, 255, 255, 0.6)';
                    ctx.beginPath();
                    ctx.roundRect(px + 8, py - 14, textWidth + 8, 16, 4);
                    ctx.fill();
                    
                    ctx.fillStyle = theme === 'dark' ? '#7bd0ff' : '#0284c7';
                    ctx.fillText(node.label, px + 12, py - 2);
                }
            });

            time += 0.016; 
            animationFrameId = requestAnimationFrame(drawSonarMap);
        };

        animationFrameId = requestAnimationFrame(drawSonarMap);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]); // Re-run effect when theme changes to update colors immediately

    return <canvas ref={canvasRef} className="w-full h-full" />;
}
