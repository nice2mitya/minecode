/* ===== MineCode Gamification Engine ===== */

const MineCode = {
  // Level thresholds
  levels: [
    { name: 'Деревянный', min: 0, icon: '🪵' },
    { name: 'Каменный', min: 200, icon: '🪨' },
    { name: 'Железный', min: 500, icon: '⛓️' },
    { name: 'Алмазный', min: 1000, icon: '💎' },
    { name: 'Незеритовый', min: 2000, icon: '🔮' },
  ],

  achievements: {
    first_block: { name: '🔨 Первый блок', desc: 'Прошёл первый урок', xpReq: 100 },
    quiz_master_3: { name: '🧠 Знаток', desc: 'Ответил правильно на 3 квиза', quizReq: 3 },
    quiz_master_10: { name: '🎓 Мастер квизов', desc: 'Ответил правильно на 10 квизов', quizReq: 10 },
    boss_slayer: { name: '👹 Убийца боссов', desc: 'Прошёл первый Boss Challenge', bossReq: 1 },
    streak_3: { name: '🔥 Тройка', desc: '3 дня подряд', streakReq: 3 },
    streak_7: { name: '🔥🔥 Неделя', desc: '7 дней подряд', streakReq: 7 },
  },

  // Get state from localStorage
  getState() {
    const def = { xp: 0, quizzesCompleted: {}, lessonsCompleted: [], bossesCompleted: [], streak: 0, lastVisit: null, achievementsUnlocked: [] };
    try {
      const raw = localStorage.getItem('minecode_state');
      return raw ? { ...def, ...JSON.parse(raw) } : def;
    } catch { return def; }
  },

  saveState(state) {
    localStorage.setItem('minecode_state', JSON.stringify(state));
  },

  getLevel(xp) {
    let level = this.levels[0];
    for (const l of this.levels) {
      if (xp >= l.min) level = l;
    }
    return level;
  },

  getNextLevel(xp) {
    for (const l of this.levels) {
      if (xp < l.min) return l;
    }
    return null;
  },

  getLevelProgress(xp) {
    const cur = this.getLevel(xp);
    const next = this.getNextLevel(xp);
    if (!next) return 100;
    const range = next.min - cur.min;
    const progress = xp - cur.min;
    return Math.round((progress / range) * 100);
  },

  addXP(amount, reason) {
    const state = this.getState();
    const oldLevel = this.getLevel(state.xp);
    state.xp += amount;
    this.saveState(state);

    const newLevel = this.getLevel(state.xp);
    if (newLevel.name !== oldLevel.name) {
      this.showAchievement(`${newLevel.icon} Новый уровень!`, `Ты теперь ${newLevel.name}`, true);
    }

    this.updateUI();
    this.showXPPopup(amount);
    return state.xp;
  },

  completeQuiz(quizId) {
    const state = this.getState();
    if (state.quizzesCompleted[quizId]) return false;
    state.quizzesCompleted[quizId] = true;
    this.saveState(state);
    this.checkAchievements();
    return true;
  },

  completeLesson(lessonId) {
    const state = this.getState();
    if (!state.lessonsCompleted.includes(lessonId)) {
      state.lessonsCompleted.push(lessonId);
      this.saveState(state);
      this.checkAchievements();
    }
  },

  completeBoss(bossId) {
    const state = this.getState();
    if (!state.bossesCompleted.includes(bossId)) {
      state.bossesCompleted.push(bossId);
      this.saveState(state);
      this.checkAchievements();
    }
  },

  updateStreak() {
    const state = this.getState();
    const today = new Date().toDateString();
    if (state.lastVisit === today) return;

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (state.lastVisit === yesterday) {
      state.streak++;
    } else if (state.lastVisit !== today) {
      state.streak = 1;
    }
    state.lastVisit = today;
    this.saveState(state);
    this.checkAchievements();
  },

  checkAchievements() {
    const state = this.getState();
    const quizCount = Object.keys(state.quizzesCompleted).length;

    const checks = [
      ['first_block', () => state.lessonsCompleted.length >= 1],
      ['quiz_master_3', () => quizCount >= 3],
      ['quiz_master_10', () => quizCount >= 10],
      ['boss_slayer', () => state.bossesCompleted.length >= 1],
      ['streak_3', () => state.streak >= 3],
      ['streak_7', () => state.streak >= 7],
    ];

    for (const [id, check] of checks) {
      if (!state.achievementsUnlocked.includes(id) && check()) {
        state.achievementsUnlocked.push(id);
        this.saveState(state);
        const ach = this.achievements[id];
        this.showAchievement(ach.name, ach.desc);
      }
    }
  },

  showAchievement(name, desc, isLevel = false) {
    let popup = document.querySelector('.achievement-popup');
    if (!popup) {
      popup = document.createElement('div');
      popup.className = 'achievement-popup';
      document.body.appendChild(popup);
    }
    popup.innerHTML = `
      <div class="ach-title">${isLevel ? '⬆️ LEVEL UP' : '🏆 ДОСТИЖЕНИЕ'}</div>
      <div class="ach-name">${name}</div>
      <div class="ach-desc">${desc}</div>
    `;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 3500);
  },

  showXPPopup(amount) {
    // Flash screen border green
    document.body.style.boxShadow = 'inset 0 0 50px rgba(76, 175, 80, 0.5)';
    setTimeout(() => { document.body.style.boxShadow = ''; }, 300);
    
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--font-mono);font-size:2.5rem;color:#FFD700;font-weight:700;z-index:9999;pointer-events:none;animation:xpPop 1.2s forwards;text-shadow:0 0 20px #FFD700;';
    el.textContent = `+${amount} XP`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  },

  updateUI() {
    const state = this.getState();
    const level = this.getLevel(state.xp);
    const progress = this.getLevelProgress(state.xp);

    const xpText = document.querySelector('.xp-text');
    const xpBar = document.querySelector('.xp-bar-fill');
    const levelBadge = document.querySelector('.level-badge');
    const streakEl = document.querySelector('.streak-display');

    if (xpText) xpText.textContent = `${state.xp} XP`;
    if (xpBar) xpBar.style.width = `${progress}%`;
    if (levelBadge) levelBadge.textContent = `${level.icon} ${level.name}`;
    if (streakEl) streakEl.textContent = state.streak > 0 ? `🔥 ${state.streak}` : '';
  },

  // Initialize header
  initHeader() {
    this.updateStreak();
    this.updateUI();
  },

  // Initialize particles
  initParticles(count = 20) {
    const container = document.getElementById('particles');
    if (!container) return;
    const colors = ['#4CAF50', '#4AEDD9', '#FFD700', '#7f7f7f'];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'pixel';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 8 + 's';
      p.style.animationDuration = (6 + Math.random() * 4) + 's';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      container.appendChild(p);
    }
  },
};

// Add XP popup animation
const style = document.createElement('style');
style.textContent = `@keyframes xpPop { 0% { opacity:1; transform:translate(-50%,-50%) scale(0.5); } 50% { transform:translate(-50%,-50%) scale(1.3); } 100% { opacity:0; transform:translate(-50%,-80%) scale(1); } }`;
document.head.appendChild(style);

// ===== TURTLE CANVAS REWARDS =====
function initTurtleRewards() {
  document.querySelectorAll('[data-turtle]').forEach(block => {
    const canvasEl = block.querySelector('canvas');
    if (!canvasEl) return;
    
    // Hide canvas initially
    canvasEl.style.display = 'none';
    
    // Watch for correct completion
    const observer = new MutationObserver(() => {
      const feedback = block.querySelector('.code-feedback');
      if (feedback && feedback.classList.contains('correct')) {
        canvasEl.style.display = 'block';
        const turtleType = block.dataset.turtle;
        const tc = new TurtleCanvas(canvasEl.id, getTurtleOptions(turtleType));
        tc.render();
        
        // Build the appropriate shape
        switch(turtleType) {
          case 'line-8':
            tc.buildLine(8);
            break;
          case 'rect-5-3':
            tc.buildRect(5, 3);
            break;
          case 'farm':
            // Two rows of farm blocks
            for (let i = 0; i < 6; i++) {
              tc.placeBlock('#2d8a2d');
              tc.forward();
            }
            tc.right(); tc.forward(); tc.forward(); tc.right();
            for (let i = 0; i < 6; i++) {
              tc.placeBlock('#8B6914');
              tc.forward();
            }
            break;
        }
        tc.play(() => showConfetti(canvasEl));
        observer.disconnect();
      }
    });
    
    const feedback = block.querySelector('.code-feedback');
    if (feedback) observer.observe(feedback, { attributes: true, attributeFilter: ['class'] });
  });
}

function getTurtleOptions(type) {
  switch(type) {
    case 'line-8': return { cols: 10, rows: 2, cellSize: 36, startX: 0, startY: 0 };
    case 'rect-5-3': return { cols: 7, rows: 5, cellSize: 36, startX: 0, startY: 0 };
    case 'farm': return { cols: 8, rows: 5, cellSize: 36, startX: 0, startY: 1, stepDelay: 200 };
    default: return {};
  }
}

// ===== QUIZ ENGINE =====
function initQuizzes() {
  document.querySelectorAll('.quiz-block[data-quiz-id]').forEach(block => {
    const quizId = block.dataset.quizId;
    const correct = block.dataset.correct;
    const explanation = block.dataset.explanation || '';
    const xpReward = parseInt(block.dataset.xp) || 10;
    const state = MineCode.getState();

    // Already completed?
    if (state.quizzesCompleted[quizId]) {
      markQuizCompleted(block, correct);
      return;
    }

    const options = block.querySelectorAll('.quiz-option');
    const feedback = block.querySelector('.quiz-feedback');
    const retryBtn = block.querySelector('.quiz-retry');

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        if (opt.classList.contains('disabled')) return;

        const val = opt.dataset.value;
        options.forEach(o => o.classList.add('disabled'));

        if (val === correct) {
          opt.classList.add('correct');
          feedback.className = 'quiz-feedback show correct';
          feedback.textContent = `✅ Верно! ${explanation}`;
          if (typeof showConfetti === 'function') showConfetti(opt);
          if (MineCode.completeQuiz(quizId)) {
            MineCode.addXP(xpReward, `Quiz ${quizId}`);
          }
        } else {
          opt.classList.add('wrong');
          // Show correct one
          options.forEach(o => { if (o.dataset.value === correct) o.classList.add('correct'); });
          feedback.className = 'quiz-feedback show wrong';
          feedback.textContent = `❌ Неправильно. ${explanation}`;
          if (retryBtn) retryBtn.classList.add('show');
        }
      });
    });

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        options.forEach(o => { o.classList.remove('disabled', 'correct', 'wrong'); });
        feedback.className = 'quiz-feedback';
        retryBtn.classList.remove('show');
      });
    }
  });

  // Fill-in quizzes
  document.querySelectorAll('.quiz-block[data-quiz-type="fill"]').forEach(block => {
    const quizId = block.dataset.quizId;
    const xpReward = parseInt(block.dataset.xp) || 10;
    const state = MineCode.getState();
    if (state.quizzesCompleted[quizId]) return;

    const btn = block.querySelector('.quiz-submit-btn');
    const feedback = block.querySelector('.quiz-feedback');
    const inputs = block.querySelectorAll('.quiz-fill-input');

    if (btn) {
      btn.addEventListener('click', () => {
        let allCorrect = true;
        inputs.forEach(inp => {
          const expected = inp.dataset.answer.toLowerCase().trim();
          const given = inp.value.toLowerCase().trim();
          if (given === expected) {
            inp.style.borderColor = 'var(--green)';
          } else {
            inp.style.borderColor = 'var(--red)';
            allCorrect = false;
          }
        });

        if (allCorrect) {
          feedback.className = 'quiz-feedback show correct';
          feedback.textContent = '✅ Всё верно!';
          if (MineCode.completeQuiz(quizId)) {
            MineCode.addXP(xpReward, `Fill quiz ${quizId}`);
          }
        } else {
          feedback.className = 'quiz-feedback show wrong';
          feedback.textContent = '❌ Не совсем. Попробуй ещё раз!';
        }
      });
    }
  });
}

function markQuizCompleted(block, correctValue) {
  const options = block.querySelectorAll('.quiz-option');
  options.forEach(o => {
    o.classList.add('disabled');
    if (o.dataset.value === correctValue) o.classList.add('correct');
  });
  const fb = block.querySelector('.quiz-feedback');
  if (fb) { fb.className = 'quiz-feedback show correct'; fb.textContent = '✅ Уже пройдено!'; }
}

// ===== BOSS QUIZ =====
function initBossQuiz() {
  document.querySelectorAll('.boss-block[data-boss-id]').forEach(block => {
    const bossId = block.dataset.bossId;
    const correct = block.dataset.correct;
    const xpReward = parseInt(block.dataset.xp) || 50;
    const state = MineCode.getState();

    if (state.bossesCompleted && state.bossesCompleted.includes(bossId)) {
      const options = block.querySelectorAll('.quiz-option');
      options.forEach(o => { o.classList.add('disabled'); if (o.dataset.value === correct) o.classList.add('correct'); });
      const fb = block.querySelector('.quiz-feedback');
      if (fb) { fb.className = 'quiz-feedback show correct'; fb.textContent = '✅ Босс повержен!'; }
      return;
    }

    const options = block.querySelectorAll('.quiz-option');
    const feedback = block.querySelector('.quiz-feedback');
    const retryBtn = block.querySelector('.quiz-retry');

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        if (opt.classList.contains('disabled')) return;
        const val = opt.dataset.value;
        options.forEach(o => o.classList.add('disabled'));

        if (val === correct) {
          opt.classList.add('correct');
          feedback.className = 'quiz-feedback show correct';
          feedback.textContent = '✅ БОСС ПОВЕРЖЕН! 🏆';
          if (typeof showConfetti === 'function') showConfetti(block);
          MineCode.completeBoss(bossId);
          MineCode.addXP(xpReward, `Boss ${bossId}`);
        } else {
          opt.classList.add('wrong');
          options.forEach(o => { if (o.dataset.value === correct) o.classList.add('correct'); });
          feedback.className = 'quiz-feedback show wrong';
          feedback.textContent = '❌ Не сдавайся! Попробуй ещё.';
          if (retryBtn) retryBtn.classList.add('show');
        }
      });
    });

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        options.forEach(o => { o.classList.remove('disabled', 'correct', 'wrong'); });
        feedback.className = 'quiz-feedback';
        retryBtn.classList.remove('show');
      });
    }
  });
}

// ===== LESSON PREREQUISITES =====
const LESSON_PREREQS = {
  'm1-01': null,
  'm1-02': 'm1-01',
  'm1-03': 'm1-02',
  'm1-04': 'm1-03',
  'm1-05': 'm1-04',
  'm1-06': 'm1-05',
};

function isLessonUnlocked(lessonId) {
  const prereq = LESSON_PREREQS[lessonId];
  if (!prereq) return true;
  const state = MineCode.getState();
  return state.lessonsCompleted.includes(prereq);
}

function initLessonLocking() {
  const completeBtn = document.querySelector('.lesson-complete-btn');
  if (!completeBtn) return;

  const currentLesson = completeBtn.dataset.lessonId;
  if (!currentLesson) return;

  if (!isLessonUnlocked(currentLesson)) {
    const prereq = LESSON_PREREQS[currentLesson];
    const prereqNum = prereq.replace('m1-0', '1.');

    const overlay = document.createElement('div');
    overlay.className = 'lesson-locked-overlay';
    overlay.innerHTML = `
      <div class="lesson-locked-message">
        <span class="locked-icon">🔒</span>
        <h2>Урок заблокирован</h2>
        <p>Сначала пройди урок ${prereqNum}</p>
        <a href="/course-map" class="cta-btn" style="margin-top:1rem;font-size:0.9rem;">← Карта курса</a>
      </div>
    `;

    const content = document.querySelector('.page-content');
    if (content) {
      const sections = content.querySelectorAll('.lesson-section, .quiz-block, .boss-block, .fill-code-block, .lesson-nav, .lesson-complete-btn, .reflection-box');
      sections.forEach(s => s.style.display = 'none');

      const header = content.querySelector('.lesson-header');
      if (header) header.after(overlay);
      else content.prepend(overlay);
    }
  }
}

// ===== COURSE MAP HELPERS =====
function updateCourseMap() {
  const state = MineCode.getState();

  document.querySelectorAll('.module-lessons li[data-lesson-id]').forEach(li => {
    const lessonId = li.dataset.lessonId;
    const icon = li.querySelector('.lesson-status-icon');
    const link = li.querySelector('a');

    if (state.lessonsCompleted.includes(lessonId)) {
      if (icon) icon.textContent = '✅';
    } else if (isLessonUnlocked(lessonId)) {
      if (icon) icon.textContent = '📖';
    } else {
      if (icon) icon.textContent = '🔒';
      if (link) {
        const span = document.createElement('span');
        span.className = 'locked-lesson';
        span.textContent = link.textContent;
        link.replaceWith(span);
      }
    }
  });

  // Update progress bars
  document.querySelectorAll('.module-card').forEach(card => {
    const lessons = card.querySelectorAll('.module-lessons li[data-lesson-id]');
    const total = lessons.length;
    if (total === 0) return;
    let done = 0;
    lessons.forEach(l => {
      if (state.lessonsCompleted.includes(l.dataset.lessonId)) done++;
    });
    const fill = card.querySelector('.module-progress-fill');
    if (fill) fill.style.width = `${Math.round((done / total) * 100)}%`;
  });
}

// ===== LESSON COMPLETE BUTTON =====
function initLessonComplete() {
  const btn = document.querySelector('.lesson-complete-btn');
  if (!btn) return;
  const lessonId = btn.dataset.lessonId;
  const state = MineCode.getState();

  if (state.lessonsCompleted.includes(lessonId)) {
    btn.textContent = '✅ Урок пройден';
    btn.disabled = true;
    btn.style.opacity = '0.6';
    return;
  }

  btn.addEventListener('click', () => {
    MineCode.completeLesson(lessonId);
    MineCode.addXP(100, `Lesson ${lessonId}`);
    btn.textContent = '✅ Урок пройден';
    btn.disabled = true;
    btn.style.opacity = '0.6';
  });
}

// ===== FILL-IN-THE-BLANK VALIDATION =====
function initFillBlanks() {
  document.querySelectorAll('.fill-code-block').forEach(block => {
    const taskId = block.dataset.taskId;
    const btn = block.querySelector('.code-run-btn');
    const inputs = block.querySelectorAll('.fill-blank');
    let feedback = block.querySelector('.code-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'code-feedback';
      block.appendChild(feedback);
    }

    // Check if already completed
    const state = MineCode.getState();
    if (state.quizzesCompleted && state.quizzesCompleted['fill-' + taskId]) {
      inputs.forEach(inp => {
        inp.value = inp.dataset.answer.split('/')[0];
        inp.disabled = true;
        inp.classList.add('correct');
      });
      feedback.className = 'code-feedback show correct';
      feedback.textContent = '✅ Уже решено!';
      return;
    }

    btn.addEventListener('click', () => {
      let allCorrect = true;
      let wrongCount = 0;

      inputs.forEach(inp => {
        const expected = inp.dataset.answer.toLowerCase().trim();
        const given = inp.value.toLowerCase().trim();
        const acceptedAnswers = expected.split('/').map(a => a.trim());

        if (acceptedAnswers.includes(given)) {
          inp.classList.remove('wrong');
          inp.classList.add('correct');
        } else {
          inp.classList.remove('correct');
          inp.classList.add('wrong');
          allCorrect = false;
          wrongCount++;
        }
      });

      if (allCorrect) {
        feedback.className = 'code-feedback show correct';
        feedback.textContent = '✅ Всё верно! Отличная работа!';
        if (typeof showConfetti === 'function') showConfetti(btn);
        if (MineCode.completeQuiz('fill-' + taskId)) {
          MineCode.addXP(15, 'fill-' + taskId);
        }
        inputs.forEach(inp => inp.disabled = true);
      } else if (wrongCount === 1) {
        feedback.className = 'code-feedback show wrong';
        feedback.textContent = '🤔 Почти! Одно поле неправильно. Подсвечено красным.';
      } else {
        feedback.className = 'code-feedback show wrong';
        feedback.textContent = `💪 ${wrongCount} поля неверно. Красные поля нужно исправить.`;
      }
    });
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  MineCode.initHeader();
  MineCode.initParticles();
  initLessonLocking();
  initQuizzes();
  initBossQuiz();
  initFillBlanks();
  initLessonComplete();
  initTurtleRewards();

  // Anti-copypaste on solution blocks
  document.querySelectorAll('details summary').forEach(s => {
    s.parentElement.addEventListener('copy', e => {
      e.preventDefault();
      e.clipboardData.setData('text/plain', '🚫 Попробуй написать сам! Копировать решение — не учиться.');
    });
  });
  if (document.querySelector('.module-card')) updateCourseMap();
});
