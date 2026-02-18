// TurtleCanvas — Mini Minecraft turtle visualizer
class TurtleCanvas {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.cellSize = options.cellSize || 40;
    this.cols = options.cols || 10;
    this.rows = options.rows || 8;
    this.canvas.width = this.cols * this.cellSize;
    this.canvas.height = this.rows * this.cellSize;
    
    // Turtle state
    this.x = options.startX || 0;
    this.y = options.startY || 0;
    this.dir = options.startDir || 0; // 0=right, 1=down, 2=left, 3=up
    this.blocks = []; // [{x, y, color}]
    this.trail = []; // [{x, y}] — path taken
    
    // Colors
    this.colors = {
      grid: '#1a2a1a',
      gridLine: 'rgba(76, 175, 80, 0.15)',
      block: '#4CAF50',
      blockStroke: '#388E3C',
      turtle: '#4AEDD9',
      turtleEye: '#FFD700',
      trail: 'rgba(76, 175, 80, 0.08)',
      farmDirt: '#8B6914',
      farmGreen: '#2d8a2d',
    };
    
    this.animQueue = [];
    this.animating = false;
    this.stepDelay = options.stepDelay || 300;
  }

  // Drawing methods
  clear() {
    this.ctx.fillStyle = this.colors.grid;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // Grid lines
    this.ctx.strokeStyle = this.colors.gridLine;
    this.ctx.lineWidth = 1;
    for (let x = 0; x <= this.cols; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.cellSize, 0);
      this.ctx.lineTo(x * this.cellSize, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y <= this.rows; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * this.cellSize);
      this.ctx.lineTo(this.canvas.width, y * this.cellSize);
      this.ctx.stroke();
    }
  }

  drawBlock(x, y, color = this.colors.block, strokeColor = this.colors.blockStroke) {
    const px = x * this.cellSize;
    const py = y * this.cellSize;
    const s = this.cellSize;
    const p = 2; // padding
    
    // Block body
    this.ctx.fillStyle = color;
    this.ctx.fillRect(px + p, py + p, s - p*2, s - p*2);
    
    // Block border (3D effect)
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(px + p, py + p, s - p*2, s - p*2);
    
    // Highlight (top-left shine)
    this.ctx.fillStyle = 'rgba(255,255,255,0.15)';
    this.ctx.fillRect(px + p, py + p, s - p*2, 4);
    this.ctx.fillRect(px + p, py + p, 4, s - p*2);
  }

  drawTurtle() {
    const px = this.x * this.cellSize + this.cellSize / 2;
    const py = this.y * this.cellSize + this.cellSize / 2;
    const r = this.cellSize * 0.35;
    
    this.ctx.save();
    this.ctx.translate(px, py);
    this.ctx.rotate(this.dir * Math.PI / 2);
    
    // Body
    this.ctx.fillStyle = this.colors.turtle;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, r, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Direction indicator (nose)
    this.ctx.fillStyle = this.colors.turtleEye;
    this.ctx.beginPath();
    this.ctx.arc(r * 0.6, 0, r * 0.25, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  render() {
    this.clear();
    // Draw trail
    this.trail.forEach(t => {
      this.ctx.fillStyle = this.colors.trail;
      this.ctx.fillRect(t.x * this.cellSize, t.y * this.cellSize, this.cellSize, this.cellSize);
    });
    // Draw blocks
    this.blocks.forEach(b => this.drawBlock(b.x, b.y, b.color || this.colors.block));
    // Draw turtle
    this.drawTurtle();
  }

  // Commands (queued for animation)
  forward() { this.animQueue.push({ type: 'forward' }); }
  left() { this.animQueue.push({ type: 'left' }); }
  right() { this.animQueue.push({ type: 'right' }); }
  placeBlock(color) { this.animQueue.push({ type: 'place', color }); }
  turnAround() { this.animQueue.push({ type: 'turn180' }); }
  up() { this.animQueue.push({ type: 'up' }); }

  // Execute one step
  executeStep(step) {
    const dirs = [[1,0],[0,1],[-1,0],[0,-1]]; // right, down, left, up
    switch(step.type) {
      case 'forward':
        this.trail.push({x: this.x, y: this.y});
        this.x += dirs[this.dir][0];
        this.y += dirs[this.dir][1];
        // Clamp
        this.x = Math.max(0, Math.min(this.cols - 1, this.x));
        this.y = Math.max(0, Math.min(this.rows - 1, this.y));
        break;
      case 'left':
        this.dir = (this.dir + 3) % 4;
        break;
      case 'right':
        this.dir = (this.dir + 1) % 4;
        break;
      case 'turn180':
        this.dir = (this.dir + 2) % 4;
        break;
      case 'up':
        // Move up regardless of direction (for wall building)
        if (this.y > 0) this.y--;
        break;
      case 'place':
        this.blocks.push({x: this.x, y: this.y, color: step.color || this.colors.block});
        break;
    }
  }

  // Animate queued commands
  async play(onComplete) {
    if (this.animating) return;
    this.animating = true;
    
    for (const step of this.animQueue) {
      this.executeStep(step);
      this.render();
      await new Promise(r => setTimeout(r, this.stepDelay));
    }
    
    this.animQueue = [];
    this.animating = false;
    if (onComplete) onComplete();
  }

  // Reset
  reset(options = {}) {
    this.x = options.startX || 0;
    this.y = options.startY || 0;
    this.dir = options.startDir || 0;
    this.blocks = [];
    this.trail = [];
    this.animQueue = [];
    this.animating = false;
    this.render();
  }

  // Convenience: build line
  buildLine(length) {
    for (let i = 0; i < length; i++) {
      this.placeBlock();
      this.forward();
    }
  }

  // Convenience: build rectangle
  buildRect(w, h) {
    for (let row = 0; row < h; row++) {
      for (let col = 0; col < w; col++) {
        this.placeBlock();
        if (col < w - 1) this.forward();
      }
      if (row < h - 1) {
        // Next row
        if (row % 2 === 0) {
          this.right();
          this.forward();
          this.right();
        } else {
          this.left();
          this.forward();
          this.left();
        }
      }
    }
  }
}

// Confetti/particle effect for correct answers
function showConfetti(element) {
  const rect = element.getBoundingClientRect();
  const colors = ['#4CAF50', '#4AEDD9', '#FFD700', '#FF5252', '#c792ea'];
  
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      width: ${4 + Math.random() * 6}px;
      height: ${4 + Math.random() * 6}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${rect.left + rect.width/2}px;
      top: ${rect.top + rect.height/2}px;
      pointer-events: none;
      z-index: 9999;
      border-radius: 2px;
    `;
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / 30;
    const velocity = 3 + Math.random() * 5;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 3;
    let x = 0, y = 0, opacity = 1;
    
    function animate() {
      x += vx;
      y += vy + 0.5; // gravity
      opacity -= 0.02;
      particle.style.transform = `translate(${x}px, ${y}px) rotate(${x * 3}deg)`;
      particle.style.opacity = opacity;
      if (opacity > 0) requestAnimationFrame(animate);
      else particle.remove();
    }
    requestAnimationFrame(animate);
  }
}