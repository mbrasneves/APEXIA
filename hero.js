/* Hero canvas — drifting constellation / triangle mesh */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, DPR;
  const NODES = 38;
  const nodes = [];

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function init() {
    resize();
    nodes.length = 0;
    for (let i = 0; i < NODES; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 0.6
      });
    }
  }

  // Three 'anchor' nodes form the conceptual triangle (Professor/Aluno/IA)
  const anchors = [];
  function setAnchors() {
    anchors.length = 0;
    anchors.push({ x: W * 0.5,  y: H * 0.18, label: 'P' });
    anchors.push({ x: W * 0.88, y: H * 0.82, label: 'I' });
    anchors.push({ x: W * 0.12, y: H * 0.82, label: 'A' });
  }

  let mouse = { x: -999, y: -999 };
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  window.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  window.addEventListener('resize', () => { init(); setAnchors(); });

  function step() {
    ctx.clearRect(0, 0, W, H);

    // draw subtle triangle between anchors
    ctx.save();
    ctx.strokeStyle = 'rgba(232,71,44,0.18)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 6]);
    ctx.beginPath();
    ctx.moveTo(anchors[0].x, anchors[0].y);
    ctx.lineTo(anchors[1].x, anchors[1].y);
    ctx.lineTo(anchors[2].x, anchors[2].y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // update + draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      // soft attraction to nearest anchor
      let nearest = anchors[0];
      let nd = Infinity;
      for (const a of anchors) {
        const d = (n.x - a.x) ** 2 + (n.y - a.y) ** 2;
        if (d < nd) { nd = d; nearest = a; }
      }
      n.vx += (nearest.x - n.x) * 0.00004;
      n.vy += (nearest.y - n.y) * 0.00004;

      // mouse repulsion
      const mdx = n.x - mouse.x, mdy = n.y - mouse.y;
      const md2 = mdx * mdx + mdy * mdy;
      if (md2 < 14000) {
        const f = (14000 - md2) / 14000 * 0.08;
        n.vx += mdx * f * 0.01; n.vy += mdy * f * 0.01;
      }

      // damp
      n.vx *= 0.992; n.vy *= 0.992;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(21,20,15,0.45)';
      ctx.fill();
    }

    // lines between close nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
          const al = (1 - d2 / 16000) * 0.32;
          ctx.strokeStyle = `rgba(21,20,15,${al})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // anchor glyphs
    for (const a of anchors) {
      ctx.beginPath();
      ctx.arc(a.x, a.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#E8472C';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(a.x, a.y, 14, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(232,71,44,0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    requestAnimationFrame(step);
  }

  init(); setAnchors(); step();
})();
