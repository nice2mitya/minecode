/* ===== MineCode Gamification Engine ===== */

function detectLangFromPath(pathname = '/') {
  const m = pathname.match(/^\/(es|en)(?:\/|$)/);
  return m ? m[1] : 'ru';
}

const MINECODE_LANG = window.__MINECODE_LANG || detectLangFromPath(window.location.pathname);
const SUPPORTED_LANGS = ['ru', 'es', 'en'];

const I18N = {
  ru: {
    level_wood: 'Деревянный',
    level_stone: 'Каменный',
    level_iron: 'Железный',
    level_diamond: 'Алмазный',
    level_netherite: 'Незеритовый',
    ach_first_block_name: '🔨 Первый блок',
    ach_first_block_desc: 'Прошёл первый урок',
    ach_quiz_master_3_name: '🧠 Знаток',
    ach_quiz_master_3_desc: 'Ответил правильно на 3 квиза',
    ach_quiz_master_10_name: '🎓 Мастер квизов',
    ach_quiz_master_10_desc: 'Ответил правильно на 10 квизов',
    ach_boss_slayer_name: '👹 Убийца боссов',
    ach_boss_slayer_desc: 'Прошёл первый Boss Challenge',
    ach_streak_3_name: '🔥 Тройка',
    ach_streak_3_desc: '3 дня подряд',
    ach_streak_7_name: '🔥🔥 Неделя',
    ach_streak_7_desc: '7 дней подряд',
    level_up_title: '⬆️ LEVEL UP',
    achievement_title: '🏆 ДОСТИЖЕНИЕ',
    level_up_name: '{icon} Новый уровень!',
    level_up_desc: 'Ты теперь {level}',
    replay: '🔄 Запустить заново',
    quiz_correct: '✅ Верно! {explanation}',
    quiz_wrong: '❌ Неправильно. {explanation}',
    fill_quiz_correct: '✅ Всё верно!',
    fill_quiz_wrong: '❌ Не совсем. Попробуй ещё раз!',
    already_completed: '✅ Уже пройдено!',
    boss_already: '✅ Босс повержен!',
    boss_defeated: '✅ БОСС ПОВЕРЖЕН! 🏆',
    boss_retry: '❌ Не сдавайся! Попробуй ещё.',
    lesson_locked_title: 'Урок заблокирован',
    lesson_locked_subtitle: 'Сначала пройди урок {lesson}',
    course_map: '← Карта курса',
    lesson_done: '✅ Урок пройден',
    fill_already_solved: '✅ Уже решено!',
    fill_all_correct: '✅ Всё верно! Отличная работа!',
    fill_one_wrong: '🤔 Почти! Одно поле неправильно. Подсвечено красным.',
    fill_many_wrong: '💪 {count} поля неверно. Красные поля нужно исправить.',
    anti_copy: '🚫 Попробуй написать сам! Копировать решение — не учиться.',
    module1_complete_done: '✅ Модуль 1 завершён!',
  },
  es: {
    level_wood: 'Madera',
    level_stone: 'Piedra',
    level_iron: 'Hierro',
    level_diamond: 'Diamante',
    level_netherite: 'Netherita',
    ach_first_block_name: '🔨 Primer bloque',
    ach_first_block_desc: 'Completaste la primera lección',
    ach_quiz_master_3_name: '🧠 Experto',
    ach_quiz_master_3_desc: 'Respondiste correctamente 3 quizzes',
    ach_quiz_master_10_name: '🎓 Maestro de quizzes',
    ach_quiz_master_10_desc: 'Respondiste correctamente 10 quizzes',
    ach_boss_slayer_name: '👹 Cazador de jefes',
    ach_boss_slayer_desc: 'Completaste tu primer Boss Challenge',
    ach_streak_3_name: '🔥 Racha 3',
    ach_streak_3_desc: '3 días seguidos',
    ach_streak_7_name: '🔥🔥 Semana completa',
    ach_streak_7_desc: '7 días seguidos',
    level_up_title: '⬆️ SUBES DE NIVEL',
    achievement_title: '🏆 LOGRO',
    level_up_name: '{icon} ¡Nuevo nivel!',
    level_up_desc: 'Ahora eres {level}',
    replay: '🔄 Ejecutar de nuevo',
    quiz_correct: '✅ ¡Correcto! {explanation}',
    quiz_wrong: '❌ Incorrecto. {explanation}',
    fill_quiz_correct: '✅ ¡Todo correcto!',
    fill_quiz_wrong: '❌ Casi. ¡Inténtalo otra vez!',
    already_completed: '✅ ¡Ya completado!',
    boss_already: '✅ ¡Jefe derrotado!',
    boss_defeated: '✅ ¡JEFE DERROTADO! 🏆',
    boss_retry: '❌ ¡No te rindas! Inténtalo otra vez.',
    lesson_locked_title: 'Lección bloqueada',
    lesson_locked_subtitle: 'Primero completa la lección {lesson}',
    course_map: '← Mapa del curso',
    lesson_done: '✅ Lección completada',
    fill_already_solved: '✅ ¡Ya resuelto!',
    fill_all_correct: '✅ ¡Todo correcto! ¡Gran trabajo!',
    fill_one_wrong: '🤔 Casi. Un campo está mal. Está marcado en rojo.',
    fill_many_wrong: '💪 {count} campos están mal. Corrige los campos en rojo.',
    anti_copy: '🚫 ¡Intenta escribirlo tú! Copiar la solución no es aprender.',
    module1_complete_done: '✅ ¡Módulo 1 completado!',
  },
  en: {
    level_wood: 'Wooden',
    level_stone: 'Stone',
    level_iron: 'Iron',
    level_diamond: 'Diamond',
    level_netherite: 'Netherite',
    ach_first_block_name: '🔨 First block',
    ach_first_block_desc: 'Completed your first lesson',
    ach_quiz_master_3_name: '🧠 Quiz starter',
    ach_quiz_master_3_desc: 'Answered 3 quizzes correctly',
    ach_quiz_master_10_name: '🎓 Quiz master',
    ach_quiz_master_10_desc: 'Answered 10 quizzes correctly',
    ach_boss_slayer_name: '👹 Boss slayer',
    ach_boss_slayer_desc: 'Completed your first Boss Challenge',
    ach_streak_3_name: '🔥 3-day streak',
    ach_streak_3_desc: '3 days in a row',
    ach_streak_7_name: '🔥🔥 Weekly streak',
    ach_streak_7_desc: '7 days in a row',
    level_up_title: '⬆️ LEVEL UP',
    achievement_title: '🏆 ACHIEVEMENT',
    level_up_name: '{icon} New level!',
    level_up_desc: 'You are now {level}',
    replay: '🔄 Run again',
    quiz_correct: '✅ Correct! {explanation}',
    quiz_wrong: '❌ Incorrect. {explanation}',
    fill_quiz_correct: '✅ All correct!',
    fill_quiz_wrong: '❌ Not quite. Try again!',
    already_completed: '✅ Already completed!',
    boss_already: '✅ Boss defeated!',
    boss_defeated: '✅ BOSS DEFEATED! 🏆',
    boss_retry: '❌ Don’t give up! Try again.',
    lesson_locked_title: 'Lesson locked',
    lesson_locked_subtitle: 'Complete lesson {lesson} first',
    course_map: '← Course map',
    lesson_done: '✅ Lesson completed',
    fill_already_solved: '✅ Already solved!',
    fill_all_correct: '✅ All correct! Great job!',
    fill_one_wrong: '🤔 Almost. One field is wrong. It is highlighted in red.',
    fill_many_wrong: '💪 {count} fields are wrong. Fix the red fields.',
    anti_copy: '🚫 Try to write it yourself! Copying the solution is not learning.',
    module1_complete_done: '✅ Module 1 completed!',
  },
};

function t(key, vars = {}) {
  const dict = I18N[MINECODE_LANG] || I18N.ru;
  const fallback = I18N.ru;
  let text = dict[key] || fallback[key] || key;
  for (const [k, v] of Object.entries(vars)) {
    text = text.replaceAll(`{${k}}`, String(v));
  }
  return text;
}

function stripLocalePrefix(path) {
  if (!path || !path.startsWith('/')) return path;
  if (path === '/es' || path.startsWith('/es/')) return path.slice(3) || '/';
  if (path === '/en' || path.startsWith('/en/')) return path.slice(3) || '/';
  return path;
}

function localizedPath(path, lang = MINECODE_LANG) {
  if (!path || !path.startsWith('/')) return path;
  const cleanPath = stripLocalePrefix(path);
  if (lang === 'ru') return cleanPath;
  return cleanPath === '/' ? `/${lang}` : `/${lang}${cleanPath}`;
}

function initLanguageToggle() {
  const headerStats = document.querySelector('.header-stats');
  if (!headerStats) return;

  const wrap = document.createElement('div');
  wrap.className = 'lang-toggle-wrap';
  wrap.style.cssText = 'display:inline-flex;gap:0.25rem;align-items:center;';

  const suffix = `${window.location.search || ''}${window.location.hash || ''}`;

  SUPPORTED_LANGS.forEach(lang => {
    const btn = document.createElement('a');
    btn.className = `lang-toggle-btn${lang === MINECODE_LANG ? ' is-active' : ''}`;
    btn.href = `${localizedPath(window.location.pathname, lang)}${suffix}`;
    btn.textContent = lang.toUpperCase();

    const base = 'display:inline-flex;align-items:center;justify-content:center;padding:0.3rem 0.5rem;border:1px solid var(--border);border-radius:6px;font-family:var(--font-mono);font-size:0.68rem;text-decoration:none;';
    const active = 'background:var(--green);color:#111;border-color:var(--green);';
    const idle = 'color:var(--text);';
    btn.style.cssText = `${base}${lang === MINECODE_LANG ? active : idle}`;

    wrap.appendChild(btn);
  });

  headerStats.appendChild(wrap);
}

const MineCode = {
  // Level thresholds
  levels: [
    { name: t('level_wood'), min: 0, icon: '🪵' },
    { name: t('level_stone'), min: 200, icon: '🪨' },
    { name: t('level_iron'), min: 500, icon: '⛓️' },
    { name: t('level_diamond'), min: 1000, icon: '💎' },
    { name: t('level_netherite'), min: 2000, icon: '🔮' },
  ],

  achievements: {
    first_block: { name: t('ach_first_block_name'), desc: t('ach_first_block_desc'), xpReq: 100 },
    quiz_master_3: { name: t('ach_quiz_master_3_name'), desc: t('ach_quiz_master_3_desc'), quizReq: 3 },
    quiz_master_10: { name: t('ach_quiz_master_10_name'), desc: t('ach_quiz_master_10_desc'), quizReq: 10 },
    boss_slayer: { name: t('ach_boss_slayer_name'), desc: t('ach_boss_slayer_desc'), bossReq: 1 },
    streak_3: { name: t('ach_streak_3_name'), desc: t('ach_streak_3_desc'), streakReq: 3 },
    streak_7: { name: t('ach_streak_7_name'), desc: t('ach_streak_7_desc'), streakReq: 7 },
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
      this.showAchievement(
        t('level_up_name', { icon: newLevel.icon }),
        t('level_up_desc', { level: newLevel.name }),
        true,
      );
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
      <div class="ach-title">${isLevel ? t('level_up_title') : t('achievement_title')}</div>
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
        
        // Add replay button
        let replayBtn = block.querySelector('.turtle-replay-btn');
        if (!replayBtn) {
          replayBtn = document.createElement('button');
          replayBtn.className = 'turtle-replay-btn';
          replayBtn.textContent = t('replay');
          canvasEl.after(replayBtn);
        }
        replayBtn.style.display = 'inline-block';
        replayBtn.onclick = () => {
          const tc2 = new TurtleCanvas(canvasEl.id, getTurtleOptions(turtleType));
          tc2.render();
          switch(turtleType) {
            case 'line-8': tc2.buildLine(8); break;
            case 'rect-5-3': tc2.buildRect(5, 3); break;
            case 'farm':
              for (let i = 0; i < 6; i++) { tc2.placeBlock('#2d8a2d'); tc2.forward(); }
              tc2.right(); tc2.forward(); tc2.forward(); tc2.right();
              for (let i = 0; i < 6; i++) { tc2.placeBlock('#8B6914'); tc2.forward(); }
              break;
          }
          tc2.play(() => showConfetti(canvasEl));
        };
        
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
          feedback.textContent = t('quiz_correct', { explanation });
          if (typeof showConfetti === 'function') showConfetti(opt);
          if (MineCode.completeQuiz(quizId)) {
            MineCode.addXP(xpReward, `Quiz ${quizId}`);
          }
        } else {
          opt.classList.add('wrong');
          // Show correct one
          options.forEach(o => { if (o.dataset.value === correct) o.classList.add('correct'); });
          feedback.className = 'quiz-feedback show wrong';
          feedback.textContent = t('quiz_wrong', { explanation });
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
          feedback.textContent = t('fill_quiz_correct');
          if (MineCode.completeQuiz(quizId)) {
            MineCode.addXP(xpReward, `Fill quiz ${quizId}`);
          }
        } else {
          feedback.className = 'quiz-feedback show wrong';
          feedback.textContent = t('fill_quiz_wrong');
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
  if (fb) { fb.className = 'quiz-feedback show correct'; fb.textContent = t('already_completed'); }
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
      if (fb) { fb.className = 'quiz-feedback show correct'; fb.textContent = t('boss_already'); }
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
          feedback.textContent = t('boss_defeated');
          if (typeof showConfetti === 'function') showConfetti(block);
          MineCode.completeBoss(bossId);
          MineCode.addXP(xpReward, `Boss ${bossId}`);
        } else {
          opt.classList.add('wrong');
          options.forEach(o => { if (o.dataset.value === correct) o.classList.add('correct'); });
          feedback.className = 'quiz-feedback show wrong';
          feedback.textContent = t('boss_retry');
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
  'm2-01': 'm1-06',
  'm2-02': 'm2-01',
  'm2-03': 'm2-02',
  'm2-04': 'm2-03',
  'm2-05': 'm2-04',
  'm2-06': 'm2-05',
  'm2-07': 'm2-06',
  'm3-01': 'm2-07',
  'm3-02': 'm3-01',
  'm3-03': 'm3-02',
  'm3-04': 'm3-03',
  'm3-05': 'm3-04',
  'm3-06': 'm3-05',
  'm3-07': 'm3-06',
  'm4-01': 'm3-07',
  'm4-02': 'm4-01',
  'm4-03': 'm4-02',
  'm4-04': 'm4-03',
  'm4-05': 'm4-04',
  'm4-06': 'm4-05',
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
    const prereqNum = prereq.replace('m', '').replace('-', '.');

    const overlay = document.createElement('div');
    overlay.className = 'lesson-locked-overlay';
    overlay.innerHTML = `
      <div class="lesson-locked-message">
        <span class="locked-icon">🔒</span>
        <h2>${t('lesson_locked_title')}</h2>
        <p>${t('lesson_locked_subtitle', { lesson: prereqNum })}</p>
        <a href="${localizedPath('/course-map')}" class="cta-btn" style="margin-top:1rem;font-size:0.9rem;">${t('course_map')}</a>
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
    btn.textContent = t('lesson_done');
    btn.disabled = true;
    btn.style.opacity = '0.6';
    return;
  }

  btn.addEventListener('click', () => {
    MineCode.completeLesson(lessonId);
    MineCode.addXP(100, `Lesson ${lessonId}`);
    btn.textContent = t('lesson_done');
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
      feedback.textContent = t('fill_already_solved');
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
        feedback.textContent = t('fill_all_correct');
        if (typeof showConfetti === 'function') showConfetti(btn);
        if (MineCode.completeQuiz('fill-' + taskId)) {
          MineCode.addXP(15, 'fill-' + taskId);
        }
        inputs.forEach(inp => inp.disabled = true);
      } else if (wrongCount === 1) {
        feedback.className = 'code-feedback show wrong';
        feedback.textContent = t('fill_one_wrong');
      } else {
        feedback.className = 'code-feedback show wrong';
        feedback.textContent = t('fill_many_wrong', { count: wrongCount });
      }
    });
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initLanguageToggle();
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
      e.clipboardData.setData('text/plain', t('anti_copy'));
    });
  });
  if (document.querySelector('.module-card')) updateCourseMap();
});
