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
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--font-mono);font-size:2rem;color:#FFD700;font-weight:700;z-index:9999;pointer-events:none;animation:xpPop 1s forwards;';
    el.textContent = `+${amount} XP`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
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
style.textContent = `@keyframes xpPop { 0% { opacity:1; transform:translate(-50%,-50%) scale(0.5); } 50% { transform:translate(-50%,-50%) scale(1.2); } 100% { opacity:0; transform:translate(-50%,-80%) scale(1); } }`;
document.head.appendChild(style);

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
      if (fb) { fb.className = 'quiz-feedback show correct'; fb.textContent = '✅ Boss побеждён!'; }
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
          feedback.textContent = '✅ BOSS DEFEATED! 🏆';
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

// ===== COURSE MAP HELPERS =====
function updateCourseMap() {
  const state = MineCode.getState();
  document.querySelectorAll('.module-lessons li').forEach(li => {
    const lessonId = li.dataset.lessonId;
    if (lessonId && state.lessonsCompleted.includes(lessonId)) {
      const icon = li.querySelector('.lesson-status-icon');
      if (icon) icon.textContent = '✅';
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

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  MineCode.initHeader();
  MineCode.initParticles();
  initQuizzes();
  initBossQuiz();
  initLessonComplete();
  if (document.querySelector('.module-card')) updateCourseMap();
});
