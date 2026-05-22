/**
 * bg-animation.js
 * Immersive 3D animated background for ReLaunchHer
 * Layers: canvas particle field + floating orbs + sparkles
 */

(function () {
  /* ── 1. Canvas-based 3D particle field ─────────────────────── */
  const canvas = document.createElement("canvas");
  canvas.id = "bg-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");

  // Palette – rose-gold / lavender / peach
  const COLORS = [
    "rgba(164,  69, 101, VAL)", // berry
    "rgba(216, 137, 157, VAL)", // rose
    "rgba(245, 200, 173, VAL)", // peach
    "rgba(215, 165,  90, VAL)", // gold
    "rgba(196, 162, 218, VAL)", // soft lavender
    "rgba(255, 182, 193, VAL)", // light pink
  ];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function colorAt(opacity) {
    return pick(COLORS).replace("VAL", opacity.toFixed(2));
  }

  /* ── Particle ──────────────────────────────────────────────── */
  class Particle {
    constructor(W, H) {
      this.reset(W, H, true);
    }

    reset(W, H, init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 20;
      // z simulates depth: 0.2 (far) → 1 (near)
      this.z = 0.2 + Math.random() * 0.8;
      const size = this.z * (1.5 + Math.random() * 3.5);
      this.r = size;
      this.baseR = size;
      this.vx = (Math.random() - 0.5) * 0.4 * this.z;
      this.vy = -(0.15 + Math.random() * 0.4) * this.z;
      this.life = 0;
      this.maxLife = 280 + Math.random() * 340;
      this.color = colorAt(0);
      this.targetOpacity = 0.15 + Math.random() * 0.55 * this.z;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.018 + Math.random() * 0.025;
    }

    update(W, H) {
      this.life++;
      this.pulse += this.pulseSpeed;
      const progress = this.life / this.maxLife;
      // fade in / fade out
      const fade =
        progress < 0.15
          ? progress / 0.15
          : progress > 0.75
          ? (1 - progress) / 0.25
          : 1;
      const opacity = this.targetOpacity * fade;
      this.color = colorAt(opacity);

      // gentle sine drift on x
      this.x += this.vx + Math.sin(this.pulse) * 0.3 * this.z;
      this.y += this.vy;

      // pulsing radius
      this.r = this.baseR * (1 + 0.18 * Math.sin(this.pulse));

      if (this.life >= this.maxLife || this.y < -20) this.reset(W, H);
    }

    draw(ctx) {
      const grad = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.r * 2
      );
      grad.addColorStop(0, this.color);
      grad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 2, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  /* ── Sparkle (tiny 4-point star) ───────────────────────────── */
  class Sparkle {
    constructor(W, H) {
      this.spawn(W, H);
    }

    spawn(W, H) {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.life = 0;
      this.maxLife = 60 + Math.random() * 80;
      this.size = 2 + Math.random() * 4;
      this.rotation = Math.random() * Math.PI;
      this.rotationSpeed = (Math.random() - 0.5) * 0.06;
      this.color = pick([
        "rgba(245,200,173,",
        "rgba(216,137,157,",
        "rgba(215,165, 90,",
        "rgba(196,162,218,",
      ]);
    }

    update(W, H) {
      this.life++;
      this.rotation += this.rotationSpeed;
      if (this.life >= this.maxLife) this.spawn(W, H);
    }

    draw(ctx) {
      const progress = this.life / this.maxLife;
      const fade =
        progress < 0.25
          ? progress / 0.25
          : progress > 0.65
          ? (1 - progress) / 0.35
          : 1;
      const opacity = (0.6 + Math.random() * 0.4) * fade;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color + opacity.toFixed(2) + ")";
      const s = this.size;
      // 4-point star
      ctx.beginPath();
      ctx.moveTo(0, -s * 2);
      ctx.lineTo(s * 0.35, -s * 0.35);
      ctx.lineTo(s * 2, 0);
      ctx.lineTo(s * 0.35, s * 0.35);
      ctx.lineTo(0, s * 2);
      ctx.lineTo(-s * 0.35, s * 0.35);
      ctx.lineTo(-s * 2, 0);
      ctx.lineTo(-s * 0.35, -s * 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  /* ── Ribbon wave ────────────────────────────────────────────── */
  class Ribbon {
    constructor(W, H) {
      this.W = W;
      this.H = H;
      this.reset();
    }

    reset() {
      this.y = this.H * (0.2 + Math.random() * 0.65);
      this.amplitude = 30 + Math.random() * 50;
      this.frequency = 0.003 + Math.random() * 0.005;
      this.speed = 0.003 + Math.random() * 0.005;
      this.phase = Math.random() * Math.PI * 2;
      this.thickness = 1 + Math.random() * 2.5;
      this.opacity = 0.06 + Math.random() * 0.1;
      this.color = pick([
        `rgba(164,69,101,`,
        `rgba(216,137,157,`,
        `rgba(196,162,218,`,
        `rgba(215,165,90,`,
      ]);
      this.life = 0;
      this.maxLife = 400 + Math.random() * 300;
    }

    update() {
      this.phase += this.speed;
      this.life++;
      if (this.life >= this.maxLife) this.reset();
    }

    draw(ctx) {
      const progress = this.life / this.maxLife;
      const fade =
        progress < 0.1 ? progress / 0.1 : progress > 0.8 ? (1 - progress) / 0.2 : 1;
      ctx.beginPath();
      ctx.moveTo(0, this.y + Math.sin(this.phase) * this.amplitude);
      for (let x = 0; x < this.W; x += 4) {
        const wave =
          Math.sin(x * this.frequency + this.phase) * this.amplitude +
          Math.sin(x * this.frequency * 0.5 + this.phase * 0.7) *
            (this.amplitude * 0.4);
        ctx.lineTo(x, this.y + wave);
      }
      ctx.strokeStyle = this.color + (this.opacity * fade).toFixed(3) + ")";
      ctx.lineWidth = this.thickness;
      ctx.stroke();
    }
  }

  /* ── Main loop setup ────────────────────────────────────────── */
  let W, H, particles, sparkles, ribbons, raf;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    const PARTICLE_COUNT = Math.min(80, Math.floor((W * H) / 18000));
    const SPARKLE_COUNT = Math.min(30, Math.floor((W * H) / 50000));
    const RIBBON_COUNT = 5;

    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle(W, H));
    sparkles = Array.from({ length: SPARKLE_COUNT }, () => new Sparkle(W, H));
    ribbons = Array.from({ length: RIBBON_COUNT }, () => new Ribbon(W, H));
  }

  function animate() {
    raf = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);

    // draw ribbons first (background layer)
    ribbons.forEach((r) => {
      r.update();
      r.draw(ctx);
    });

    // draw particles (mid layer, sorted far→near for depth)
    particles.sort((a, b) => a.z - b.z);
    particles.forEach((p) => {
      p.update(W, H);
      p.draw(ctx);
    });

    // draw sparkles (top layer)
    sparkles.forEach((s) => {
      s.update(W, H);
      s.draw(ctx);
    });
  }

  window.addEventListener("resize", () => {
    resize();
    init();
  });

  /* ── Mouse parallax tilt on hero cards ─────────────────────── */
  document.addEventListener("mousemove", (e) => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
    const my = (e.clientY / window.innerHeight - 0.5) * 2;

    document.querySelectorAll(".mini-3d-card").forEach((card) => {
      card.style.transform = `perspective(900px) rotateX(${-my * 6}deg) rotateY(${mx * 8}deg) translateZ(8px)`;
    });

    // subtle translate on floating orbs
    document.querySelectorAll(".bokeh-orb").forEach((orb, i) => {
      const depth = parseFloat(orb.dataset.depth || 1);
      orb.style.transform = `translate(${mx * 18 * depth}px, ${my * 12 * depth}px)`;
    });
  });

  document.addEventListener("mouseleave", () => {
    document.querySelectorAll(".mini-3d-card").forEach((card) => {
      card.style.transform = "";
    });
  });

  /* ── Inject bokeh orbs DOM layer ────────────────────────────── */
  function injectBokeh() {
    const container = document.createElement("div");
    container.id = "bokeh-layer";
    container.setAttribute("aria-hidden", "true");

    const ORB_CONFIGS = [
      { size: 340, x: 8,  y: 12, color: "rgba(164,69,101,0.13)",  blur: 60, depth: 0.4, dur: 18 },
      { size: 480, x: 78, y: 5,  color: "rgba(245,200,173,0.18)", blur: 80, depth: 0.6, dur: 22 },
      { size: 260, x: 55, y: 72, color: "rgba(216,137,157,0.15)", blur: 50, depth: 0.3, dur: 16 },
      { size: 380, x: 20, y: 65, color: "rgba(215,165,90,0.1)",   blur: 70, depth: 0.5, dur: 26 },
      { size: 220, x: 88, y: 55, color: "rgba(196,162,218,0.2)",  blur: 45, depth: 0.7, dur: 14 },
      { size: 300, x: 42, y: 30, color: "rgba(255,182,193,0.14)", blur: 55, depth: 0.35,dur: 20 },
    ];

    ORB_CONFIGS.forEach((cfg, i) => {
      const orb = document.createElement("div");
      orb.className = "bokeh-orb";
      orb.dataset.depth = cfg.depth;
      orb.style.cssText = `
        position:fixed;
        left:${cfg.x}%;
        top:${cfg.y}%;
        width:${cfg.size}px;
        height:${cfg.size}px;
        border-radius:50%;
        background:${cfg.color};
        filter:blur(${cfg.blur}px);
        animation: bokehFloat${i % 3} ${cfg.dur}s ease-in-out infinite alternate;
        pointer-events:none;
        z-index:-1;
        will-change:transform;
        transition: transform 0.4s ease;
      `;
      container.appendChild(orb);
    });

    document.body.prepend(container);
  }

  /* ── Start ──────────────────────────────────────────────────── */
  injectBokeh();
  init();
  animate();

  // Reduced-motion: cancel canvas animation
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mq.matches) {
    cancelAnimationFrame(raf);
    ctx.clearRect(0, 0, W, H);
  }
  mq.addEventListener("change", () => {
    if (mq.matches) cancelAnimationFrame(raf);
    else animate();
  });
})();
