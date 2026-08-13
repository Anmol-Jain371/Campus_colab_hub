import React, { useRef, useEffect } from 'react';

const SkillRadarChart = ({ projectSkills = [], studentSkills = [] }) => {
  const canvasRef = useRef(null);

  // Dimensions for matching
  const axes = [
    { name: 'Frontend', keywords: ['react', 'html', 'css', 'javascript', 'vue', 'angular', 'frontend', 'ui'] },
    { name: 'Backend', keywords: ['node', 'express', 'python', 'sqlite', 'database', 'sql', 'backend', 'api', 'server', 'go'] },
    { name: 'UI/UX Design', keywords: ['figma', 'design', 'ui/ux', 'photoshop', 'illustrator', 'wireframe', 'consultant', 'graphics'] },
    { name: 'Business / Strategy', keywords: ['business', 'marketing', 'pitching', 'finance', 'startup', 'strategy', 'deck', 'product'] },
    { name: 'AI / Data Science', keywords: ['ai', 'machine learning', 'data', 'python', 'analytics', 'statistics', 'tensor', 'pandas'] }
  ];

  // Helper to calculate capability scores (1 to 5) based on skills array match
  const calculateScore = (skillsArray, keywords) => {
    let score = 1; // Default minimum
    skillsArray.forEach(skill => {
      const lower = skill.toLowerCase();
      keywords.forEach(kw => {
        if (lower.includes(kw) || kw.includes(lower)) {
          score = Math.min(5, score + 1.25);
        }
      });
    });
    return score;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 260;
    
    // Scale for high DPI
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const maxVal = 5;
    const radius = 90;

    // Clear background
    ctx.clearRect(0, 0, size, size);

    // Calculate axis coordinates
    const getCoordinates = (index, value) => {
      const angle = (Math.PI * 2 / axes.length) * index - Math.PI / 2;
      const dist = (value / maxVal) * radius;
      return {
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist
      };
    };

    // Draw concentric web rings (5 rings)
    for (let r = 1; r <= maxVal; r++) {
      ctx.beginPath();
      for (let i = 0; i < axes.length; i++) {
        const coords = getCoordinates(i, r);
        if (i === 0) ctx.moveTo(coords.x, coords.y);
        else ctx.lineTo(coords.x, coords.y);
      }
      ctx.closePath();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axis lines and labels
    axes.forEach((axis, i) => {
      const outerCoords = getCoordinates(i, maxVal);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(outerCoords.x, outerCoords.y);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Labels
      const labelAngle = (Math.PI * 2 / axes.length) * i - Math.PI / 2;
      const labelDist = radius + 20;
      const labelX = cx + Math.cos(labelAngle) * labelDist;
      const labelY = cy + Math.sin(labelAngle) * labelDist;

      ctx.fillStyle = '#475569';
      ctx.font = '600 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(axis.name, labelX, labelY);
    });

    // 1. Draw Project Needs polygon (Blue)
    const projectScores = axes.map(axis => calculateScore(projectSkills, axis.keywords));
    ctx.beginPath();
    axes.forEach((_, i) => {
      const coords = getCoordinates(i, projectScores[i]);
      if (i === 0) ctx.moveTo(coords.x, coords.y);
      else ctx.lineTo(coords.x, coords.y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2. Draw Student Skills polygon (Teal)
    const studentScores = axes.map(axis => calculateScore(studentSkills, axis.keywords));
    ctx.beginPath();
    axes.forEach((_, i) => {
      const coords = getCoordinates(i, studentScores[i]);
      if (i === 0) ctx.moveTo(coords.x, coords.y);
      else ctx.lineTo(coords.x, coords.y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(13, 148, 136, 0.25)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(13, 148, 136, 0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Legend
    ctx.fillStyle = '#64748b';
    ctx.font = '9px system-ui';
    ctx.textAlign = 'left';
    
    // Project legend marker
    ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.fillRect(10, size - 20, 10, 6);
    ctx.fillStyle = '#475569';
    ctx.fillText('Project Needs', 25, size - 17);

    // Student legend marker
    ctx.fillStyle = 'rgba(13, 148, 136, 0.9)';
    ctx.fillRect(size - 90, size - 20, 10, 6);
    ctx.fillStyle = '#475569';
    ctx.fillText('Applicant Skills', size - 75, size - 17);

  }, [projectSkills, studentSkills]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SkillRadarChart;
