/* ==========================================================================
   MOHAMMED ASAD ALI — PORTFOLIO INTERACTIVE & CANVAS ENGINE (v3.0)
   ========================================================================== */

const TOTAL_FRAMES = 251;
const canvas = document.getElementById('frame-canvas');
const ctx = canvas.getContext('2d');
const loader = document.getElementById('loader');
const progressText = document.getElementById('progress-text');

const images = [];
let loadedCount = 0;

let currentFrame = 1;
let targetFrame = 1;

// Crop ratio to remove letterbox black bars from source frames (top & bottom ~12.6%)
const CROP_TOP_RATIO = 0.1259;
const CROP_BOTTOM_RATIO = 0.1259;

/* --------------------------------------------------------------------------
   CANVAS & FRAME SCALING ENGINE
   -------------------------------------------------------------------------- */
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
}

function getFramePath(index) {
  const paddedIndex = String(index).padStart(3, '0');
  return `./ezgif-frame-${paddedIndex}.jpg`;
}

function drawFrame(frameIndex) {
  const img = images[frameIndex - 1];
  if (!img || !img.complete) return;

  const cw = canvas.width;
  const ch = canvas.height;

  ctx.clearRect(0, 0, cw, ch);
  ctx.filter = 'brightness(1.05)'; // 5% brightness boost

  const imgW = img.naturalWidth;
  const imgH = img.naturalHeight;

  if (!imgW || !imgH) return;

  // Active movie content area (excluding black bars)
  const cropY = imgH * CROP_TOP_RATIO;
  const cropH = imgH * (1 - CROP_TOP_RATIO - CROP_BOTTOM_RATIO);
  const cropW = imgW;

  // Scale active content to cover canvas completely without black borders
  const hRatio = cw / cropW;
  const vRatio = ch / cropH;
  const ratio = Math.max(hRatio, vRatio);

  const renderW = cropW * ratio;
  const renderH = cropH * ratio;
  const offsetX = (cw - renderW) / 2;
  const offsetY = (ch - renderH) / 2;

  ctx.drawImage(
    img,
    0, cropY, cropW, cropH,
    offsetX, offsetY, renderW, renderH
  );
}

/* --------------------------------------------------------------------------
   SCROLL POSITION & LERP SYNC ENGINE (Maps Full Page Scroll to 251 Frames)
   -------------------------------------------------------------------------- */
function updateTargetFrame() {
  const scrollTop = Math.max(
    window.scrollY || 0,
    window.pageYOffset || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0
  );

  const maxScroll = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    document.documentElement.offsetHeight,
    document.body.offsetHeight
  ) - window.innerHeight;

  const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
  targetFrame = 1 + progress * (TOTAL_FRAMES - 1);
}

function animate() {
  const diff = targetFrame - currentFrame;
  if (Math.abs(diff) > 0.001) {
    currentFrame += diff * 0.12; // Smooth lerp
  } else {
    currentFrame = targetFrame;
  }

  const frameToDraw = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(currentFrame)));
  drawFrame(frameToDraw);

  requestAnimationFrame(animate);
}

/* --------------------------------------------------------------------------
   ASSET PRELOADER
   -------------------------------------------------------------------------- */
function preloadImages() {
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = getFramePath(i);

    const onFinish = () => {
      loadedCount++;
      const percent = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
      progressText.textContent = `LOADING ASSETS ${percent}%`;

      if (loadedCount === TOTAL_FRAMES) {
        onAllLoaded();
      }
    };

    img.onload = onFinish;
    img.onerror = onFinish;
    images.push(img);
  }
}

function onAllLoaded() {
  loader.classList.add('hidden');
  updateTargetFrame();
  drawFrame(1);
  requestAnimationFrame(animate);
}

/* --------------------------------------------------------------------------
   PROJECT DETAILS MODAL DATA & CONTROLLER
   -------------------------------------------------------------------------- */
const projectData = {
  'neuro-voice': {
    title: 'Neuro Voice – AI Voice System',
    category: 'Speech AI & Natural Language Processing',
    summary: 'An end-to-end AI voice synthesis and recognition system offering real-time speech-to-text, text-to-speech, multilingual translation, and zero-shot voice cloning using short reference audio samples.',
    problem: 'Traditional voice synthesis models lack adaptability, requiring hours of studio recording for custom voices. Neuro Voice addresses this by enabling rapid zero-shot voice cloning from 3-second audio clips.',
    features: [
      'Zero-shot voice cloning with minimal reference audio clips.',
      'Multilingual Speech-to-Text (STT) and Text-to-Speech (TTS) integration.',
      'Acoustic feature extraction and vocoder neural networks for high-fidelity audio.',
      'Interactive control panel for pitch, rate, and emotion modulation.'
    ],
    tech: ['Python', 'NLP', 'Speech AI', 'PyTorch', 'FastAPI', 'Librosa'],
    github: 'https://github.com/mohammedasad2518'
  },
  'rag-billing': {
    title: 'RAG Billing Assistant',
    category: 'Generative AI & Agentic Orchestration',
    summary: 'A decision-aware intelligent assistant using Retrieval-Augmented Generation (RAG) for automated invoice parsing, intent classification, customer refund workflows, and human-in-the-loop approval hooks.',
    problem: 'Enterprise billing support handles thousands of repetitive queries daily while requiring strict compliance for refund approvals. This system automates routine answers while routing high-risk requests to human supervisors.',
    features: [
      'Multi-agent graph workflow built with LangGraph and LangChain.',
      'Vector store retrieval over PDF invoices and policy documents.',
      'Automated intent routing and confidence scoring.',
      'Human-in-the-loop escalation mechanism for sensitive refund transactions.'
    ],
    tech: ['Python', 'LangChain', 'LangGraph', 'RAG', 'LLMs', 'ChromaDB'],
    github: 'https://github.com/mohammedasad2518'
  },
  'drowsiness-detection': {
    title: 'Driver Drowsiness Detection System',
    category: 'Computer Vision & Real-time Safety AI',
    summary: 'A computer vision safety system that monitors driver eye blink rate, facial landmark dynamics, and head posture in real-time to detect fatigue and trigger acoustic alerts.',
    problem: 'Driver fatigue is a leading cause of highway accidents worldwide. This system provides non-intrusive, real-time computer vision monitoring without specialized hardware.',
    features: [
      'Real-time 68-point facial landmark tracking with OpenCV & Dlib.',
      'Eye Aspect Ratio (EAR) algorithm calculation to monitor blink duration.',
      'Yawn and head-nodding frequency analysis.',
      'Instant audio alarm trigger upon sustained closure thresholds.'
    ],
    tech: ['Python', 'OpenCV', 'Computer Vision', 'Machine Learning', 'NumPy'],
    github: 'https://github.com/mohammedasad2518'
  },
  'resume-screening': {
    title: 'AI Resume Screening System',
    category: 'NLP & HR Automation',
    summary: 'An AI-powered candidate evaluation platform that parses multi-format resumes, extracts technical skills, generates candidate vector embeddings, and ranks profiles against job descriptions.',
    problem: 'Recruiters spend hundreds of hours manually reviewing resumes. Traditional keyword ATS filters miss qualified candidates due to synonym mismatches.',
    features: [
      'Semantic parsing of PDF/Docx resumes into structured JSON.',
      'Embedding similarity matching between candidate profiles and job requirements.',
      'Skill extraction and experience duration normalization.',
      'Ranked dashboard output with match percentage and missing skill insights.'
    ],
    tech: ['Python', 'NLP', 'LLMs', 'LangChain', 'Scikit-Learn'],
    github: 'https://github.com/mohammedasad2518'
  },
  'fitness-planner': {
    title: 'Fitness Workout Planner',
    category: 'Personalization & Health Tech',
    summary: 'A personalized fitness and nutrition recommendation engine that creates customized exercise routines, calculates caloric targets, and tracks workout progression over time.',
    problem: 'Generic workout plans fail to account for individual body metrics, goals, and equipment availability.',
    features: [
      'Personalized workout generator based on user fitness level and equipment.',
      'Macronutrient calculator tailored to muscle gain, fat loss, or maintenance.',
      'Interactive progress tracker with visual exercise demonstrations.',
      'Responsive web interface designed for mobile and desktop access.'
    ],
    tech: ['Python', 'HTML5', 'CSS3', 'JavaScript'],
    github: 'https://github.com/mohammedasad2518'
  },
  'car-rental': {
    title: 'Car Rental Backend Service',
    category: 'Backend Engineering & REST APIs',
    summary: 'A high-performance backend microservice managing vehicle fleets, customer bookings, rental schedules, and transactional REST API endpoints.',
    problem: 'Vehicle rental providers require concurrent reservation handling to prevent double-booking and ensure real-time inventory visibility.',
    features: [
      'Asynchronous FastAPI architecture with relational database integration.',
      'JWT authentication and role-based access control (RBAC).',
      'Vehicle search filtering by brand, price, capacity, and availability dates.',
      'Structured database schema handling active bookings and payment status.'
    ],
    tech: ['FastAPI', 'Python', 'REST APIs', 'SQLAlchemy', 'PostgreSQL/SQLite'],
    github: 'https://github.com/mohammedasad2518'
  }
};

const modal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

function openModal(projectId) {
  const data = projectData[projectId];
  if (!data) return;

  modalBody.innerHTML = `
    <div class="modal-header">
      <span style="font-family: var(--font-heading); font-size: 12px; font-weight: 800; color: var(--accent-amber); letter-spacing: 2px; text-transform: uppercase;">${data.category}</span>
      <h2 style="font-family: var(--font-heading); font-size: 26px; color: var(--text-primary); margin: 6px 0 16px 0;">${data.title}</h2>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4 style="color: var(--accent-amber); font-family: var(--font-heading); margin-bottom: 6px;">Overview</h4>
      <p style="color: var(--text-secondary); line-height: 1.6;">${data.summary}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h4 style="color: var(--accent-amber); font-family: var(--font-heading); margin-bottom: 6px;">Problem Statement</h4>
      <p style="color: var(--text-secondary); line-height: 1.6;">${data.problem}</p>
    </div>

    <div style="margin-bottom: 24px;">
      <h4 style="color: var(--accent-amber); font-family: var(--font-heading); margin-bottom: 10px;">Key Features</h4>
      <ul style="color: var(--text-secondary); padding-left: 20px; line-height: 1.7;">
        ${data.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>

    <div style="margin-bottom: 28px;">
      <h4 style="color: var(--accent-amber); font-family: var(--font-heading); margin-bottom: 10px;">Technologies Used</h4>
      <div class="project-tech-stack">
        ${data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>
    </div>

    <div style="display: flex; gap: 16px; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 20px;">
      <a href="${data.github}" target="_blank" rel="noopener" class="btn btn-primary">
        <i class="fab fa-github"></i>
        <span>VIEW GITHUB REPOSITORY</span>
      </a>
    </div>
  `;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.modal-trigger').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const projId = e.currentTarget.getAttribute('data-project');
    openModal(projId);
  });
});

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* --------------------------------------------------------------------------
   ANIMATED STATS COUNTER
   -------------------------------------------------------------------------- */
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function animateStats() {
  statNumbers.forEach(stat => {
    const target = parseFloat(stat.getAttribute('data-target'));
    const isDecimal = stat.getAttribute('data-decimals') === '1';
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      stat.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
    }, stepTime);
  });
}

const statsSection = document.getElementById('achievements');
if (statsSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        animateStats();
        statsAnimated = true;
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

/* --------------------------------------------------------------------------
   CONTACT FORM & TOAST
   -------------------------------------------------------------------------- */
const contactForm = document.getElementById('contact-form');
const toast = document.getElementById('toast');

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value;
    showToast(`Thank you ${name}! Your message has been sent.`);
    contactForm.reset();
  });
}

/* --------------------------------------------------------------------------
   AUDIO TOGGLE CONTROLLER FOR BATMAN THEME SONG
   -------------------------------------------------------------------------- */
const audioBtn = document.getElementById('audio-toggle-btn');
const audioIcon = document.getElementById('audio-icon');
const batmanAudio = document.getElementById('batman-audio');

if (audioBtn && batmanAudio) {
  audioBtn.addEventListener('click', () => {
    if (batmanAudio.paused) {
      batmanAudio.play().then(() => {
        audioBtn.classList.add('playing');
        audioIcon.className = 'fas fa-volume-up';
        showToast('Batman Theme Song Playing');
      }).catch(err => {
        console.error('Audio play error:', err);
      });
    } else {
      batmanAudio.pause();
      audioBtn.classList.remove('playing');
      audioIcon.className = 'fas fa-volume-mute';
      showToast('Theme Song Muted');
    }
  });
}

/* --------------------------------------------------------------------------
   NAVIGATION SCROLL CONTROLLER
   - Visible ONLY on initial Hero screen
   - Fades out & slides up when scrolling down into About, Projects, Skills, etc.
   - Smoothly reappears when returning to top
   -------------------------------------------------------------------------- */
const navbar = document.getElementById('navbar');
const hamburgerBtn = document.getElementById('hamburger-btn');
const navLinks = document.getElementById('nav-links');

function handleNavbarVisibility() {
  const scrollTop = Math.max(
    window.scrollY || 0,
    window.pageYOffset || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0
  );

  if (scrollTop > 80) {
    navbar.classList.add('nav-hidden');
  } else {
    navbar.classList.remove('nav-hidden');
  }
}

window.addEventListener('scroll', handleNavbarVisibility, { passive: true });

if (hamburgerBtn && navLinks) {
  hamburgerBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// Active Nav Link Observer
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 150;
    const sectionId = current.getAttribute('id');
    const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);

    if (navLink) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        navLink.classList.add('active');
      }
    }
  });
}, { passive: true });

/* --------------------------------------------------------------------------
   EVENT LISTENERS & INITIALIZATION
   -------------------------------------------------------------------------- */
window.addEventListener('resize', () => {
  resizeCanvas();
  updateTargetFrame();
  drawFrame(Math.min(TOTAL_FRAMES, Math.max(1, Math.round(currentFrame))));
});

window.addEventListener('scroll', updateTargetFrame, { passive: true });
window.addEventListener('wheel', updateTargetFrame, { passive: true });
window.addEventListener('touchmove', updateTargetFrame, { passive: true });

resizeCanvas();
preloadImages();
handleNavbarVisibility();
