/* ============================================================
   ROOMADMIN — PREMIUM REVENUE CHART MODULE
   Pure Canvas — zero dependencies
   ============================================================ */

const RevenueChart = (() => {
  let animFrame = null;
  let currentData = [];
  let labels = [];

  /* ─── Generate last-N-days revenue data from visits ─── */
  function buildChartData(visits, days) {
    const result = [];
    const lbls = [];
    const now = Date.now();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const key = d.toISOString().split('T')[0];
      const dayRev = visits
        .filter(v => v.checkin === key)
        .reduce((s, v) => s + (v.totalAmount || 0), 0);
      result.push(dayRev);
      lbls.push(d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }));
    }
    return { data: result, labels: lbls };
  }

  /* ─── Draw premium line chart ─── */
  function draw(canvas, data, lbls, progress = 1) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    if (!data || data.length < 2) {
      ctx.fillStyle = '#aaa';
      ctx.font = '12px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No revenue data for this period', W / 2, H / 2);
      return;
    }

    const PAD = { top: 16, right: 16, bottom: 38, left: 54 };
    const chartW = W - PAD.left - PAD.right;
    const chartH = H - PAD.top - PAD.bottom;

    const maxVal = Math.max(...data, 1);
    const minVal = 0;
    const range = maxVal - minVal;

    /* Grid lines */
    const gridCount = 4;
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;

    for (let i = 0; i <= gridCount; i++) {
      const y = PAD.top + chartH - (i / gridCount) * chartH;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + chartW, y);
      ctx.stroke();

      /* Y-axis label */
      const val = Math.round((i / gridCount) * maxVal);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.font = `500 9px 'DM Sans', sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText(val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val, PAD.left - 6, y + 3.5);
    }

    /* X-axis labels */
    const step = Math.max(1, Math.floor(data.length / 7));
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.font = `500 9px 'DM Sans', sans-serif`;
    ctx.textAlign = 'center';

    data.forEach((_, i) => {
      if (i % step === 0 || i === data.length - 1) {
        const x = PAD.left + (i / (data.length - 1)) * chartW;
        const y = PAD.top + chartH + 16;
        ctx.fillText(lbls[i], x, y);
      }
    });

    /* Clip to progress */
    const clipW = chartW * progress;

    /* Gradient fill */
    const gradFill = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + chartH);
    gradFill.addColorStop(0, 'rgba(201,146,26,0.22)');
    gradFill.addColorStop(0.6, 'rgba(201,146,26,0.06)');
    gradFill.addColorStop(1, 'rgba(201,146,26,0)');

    ctx.save();
    ctx.rect(PAD.left, 0, clipW, H);
    ctx.clip();

    /* Fill area */
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = PAD.left + (i / (data.length - 1)) * chartW;
      const y = PAD.top + chartH - ((val - minVal) / range) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else {
        const prevX = PAD.left + ((i - 1) / (data.length - 1)) * chartW;
        const prevY = PAD.top + chartH - ((data[i - 1] - minVal) / range) * chartH;
        const cp1x = prevX + (x - prevX) / 3;
        const cp2x = x - (x - prevX) / 3;
        ctx.bezierCurveTo(cp1x, prevY, cp2x, y, x, y);
      }
    });
    const lastX = PAD.left + chartW;
    const lastY = PAD.top + chartH;
    ctx.lineTo(lastX, lastY);
    ctx.lineTo(PAD.left, PAD.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradFill;
    ctx.fill();

    /* Line */
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = PAD.left + (i / (data.length - 1)) * chartW;
      const y = PAD.top + chartH - ((val - minVal) / range) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else {
        const prevX = PAD.left + ((i - 1) / (data.length - 1)) * chartW;
        const prevY = PAD.top + chartH - ((data[i - 1] - minVal) / range) * chartH;
        const cp1x = prevX + (x - prevX) / 3;
        const cp2x = x - (x - prevX) / 3;
        ctx.bezierCurveTo(cp1x, prevY, cp2x, y, x, y);
      }
    });

    const gradLine = ctx.createLinearGradient(PAD.left, 0, PAD.left + chartW, 0);
    gradLine.addColorStop(0, '#c9921a');
    gradLine.addColorStop(1, '#e8c547');

    ctx.strokeStyle = gradLine;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    /* Dots */
    data.forEach((val, i) => {
      const x = PAD.left + (i / (data.length - 1)) * chartW;
      const y = PAD.top + chartH - ((val - minVal) / range) * chartH;

      if (val > 0) {
        /* Outer glow */
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201,146,26,0.2)';
        ctx.fill();
        /* Inner dot */
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#c9921a';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      }
    });

    ctx.restore();

    /* Highlight last point */
    const lastDataX = PAD.left + chartW;
    const lastDataY = PAD.top + chartH - ((data[data.length - 1] - minVal) / range) * chartH;
    if (progress >= 0.98 && data[data.length - 1] > 0) {
      ctx.beginPath();
      ctx.arc(lastDataX, lastDataY, 7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201,146,26,0.15)';
      ctx.fill();
    }
  }

  /* ─── Animate chart ─── */
  function animate(canvas, data, lbls) {
    if (animFrame) cancelAnimationFrame(animFrame);
    const start = performance.now();
    const DURATION = 900;

    function easeInOut(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function step(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / DURATION, 1);
      draw(canvas, data, lbls, easeInOut(t));
      if (t < 1) animFrame = requestAnimationFrame(step);
    }

    animFrame = requestAnimationFrame(step);
  }

  /* ─── Public API ─── */
  function render(canvasId, visits, days = 14) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const { data, labels: lbls } = buildChartData(visits, days);
    currentData = data;
    labels = lbls;
    animate(canvas, data, lbls);
  }

  function destroy() {
    if (animFrame) cancelAnimationFrame(animFrame);
  }

  return { render, destroy, buildChartData };
})();

/* ─── Mini sparkline for dashboard revenue card ─── */
function drawSparkline(svgEl, data) {
  if (!svgEl || !data || data.length < 2) return;
  const W = svgEl.clientWidth || 100;
  const H = svgEl.clientHeight || 40;
  const max = Math.max(...data, 1);

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (v / max) * (H - 4) - 2;
    return [x, y];
  });

  /* Smooth polyline */
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const cp1x = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) / 3;
    const cp2x = pts[i][0] - (pts[i][0] - pts[i - 1][0]) / 3;
    d += ` C ${cp1x},${pts[i - 1][1]} ${cp2x},${pts[i][1]} ${pts[i][0]},${pts[i][1]}`;
  }

  /* Fill path */
  const fillD = d + ` L ${pts[pts.length - 1][0]},${H} L ${pts[0][0]},${H} Z`;

  svgEl.innerHTML = `
    <defs>
      <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${fillD}" fill="url(#spark-grad)"/>
    <path d="${d}" stroke="rgba(255,255,255,0.6)" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="1000" stroke-dashoffset="1000">
      <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="0.8s" fill="freeze"/>
    </path>
  `;
}
