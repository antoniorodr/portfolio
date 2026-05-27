/* ============================================
   Theme Toggle
   ============================================ */

const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

if (mobileThemeToggle) {
  mobileThemeToggle.addEventListener('click', toggleTheme);
}

/* ============================================
   Language Toggle
   ============================================ */

const langToggle = document.getElementById('langToggle');
const mobileLangToggle = document.getElementById('mobileLangToggle');

function toggleLanguage() {
  const currentLocale = window.LOCALE;
  const nextLocale = currentLocale === 'en' ? 'no' : 'en';
  localStorage.setItem('lang', nextLocale);

  const currentPath = window.location.pathname;
  const newPath = currentPath.replace(`/${currentLocale}/`, `/${nextLocale}/`);
  window.location.href = newPath;
}

if (langToggle) {
  langToggle.addEventListener('click', toggleLanguage);
}

if (mobileLangToggle) {
  mobileLangToggle.addEventListener('click', toggleLanguage);
}

/* ============================================
   Mobile Menu
   ============================================ */

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  });
}

/* ============================================
   Mobile CV Dropdown
   ============================================ */

document.querySelectorAll('.mobile-dropdown-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    trigger.closest('.mobile-dropdown').classList.toggle('open');
  });
});

/* ============================================
   Courses Modal
   ============================================ */

function openCoursesModal() {
  document.getElementById('coursesModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCoursesModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('coursesModal').classList.remove('active');
  document.body.style.overflow = '';
}

/* ============================================
   Project Modal
   ============================================ */

function openProjectModal(index) {
  const project = window.PROJECTS_DATA[index];
  if (!project) return;

  document.getElementById('projectModalTitle').textContent = project.name;

  const i18n = window.I18N_MODAL || {};

  let linksHtml = '';
  if (project.links.github) {
    linksHtml += `<a href="${project.links.github}" class="project-modal-link" target="_blank" rel="noopener">
      <svg width="16" height="16"><use href="/static/sprites.svg#icon-github"/></svg>
      ${i18n.github || 'GitHub'}
    </a>`;
  }
  if (project.links.website) {
    linksHtml += `<a href="${project.links.website}" class="project-modal-link" target="_blank" rel="noopener">
      <svg width="16" height="16"><use href="/static/sprites.svg#icon-external"/></svg>
      ${i18n.website || 'Website'}
    </a>`;
  }
  if (project.links.demo) {
    linksHtml += `<a href="${project.links.demo}" class="project-modal-link" target="_blank" rel="noopener">
      <svg width="16" height="16"><use href="/static/sprites.svg#icon-external"/></svg>
      ${i18n.liveDemo || 'Live Demo'}
    </a>`;
  }

  const techHtml = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

  let achievementsHtml = '';
  if (project.details && project.details.achievements) {
    const items = project.details.achievements.map(a => `<li>${a}</li>`).join('');
    achievementsHtml = `<div class="project-modal-section">
      <h4>${i18n.keyAchievements || 'Key achievements & learnings'}</h4>
      <ul class="project-modal-achievements">${items}</ul>
    </div>`;
  }

  let roleHtml = '';
  if (project.details && project.details.role) {
    roleHtml = `<div class="project-modal-section">
      <h4>${i18n.myRole || 'My role'}</h4>
      <p>${project.details.role}</p>
    </div>`;
  }

  document.getElementById('projectModalContent').innerHTML = `
    <div class="project-modal-content">
      <p class="project-modal-description">${project.modalDescription || project.description}</p>
      <div class="project-modal-section">
        <h4>${i18n.technologies || 'Technologies'}</h4>
        <div class="project-modal-tech">${techHtml}</div>
      </div>
      ${roleHtml}
      ${achievementsHtml}
      ${linksHtml ? `<div class="project-modal-section">
        <h4>${i18n.links || 'Links'}</h4>
        <div class="project-modal-links">${linksHtml}</div>
      </div>` : ''}
    </div>
  `;

  document.getElementById('projectModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('projectModal').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCoursesModal();
    closeProjectModal();
  }
});

/* ============================================
   Projects Pagination
   ============================================ */

const PROJECTS_PER_PAGE = 6;
let currentPage = 1;

function initPagination() {
  const cards = document.querySelectorAll('.project-card');
  const totalPages = Math.ceil(cards.length / PROJECTS_PER_PAGE);
  showPage(1, cards, totalPages);
}

function showPage(page, cards, totalPages) {
  const start = (page - 1) * PROJECTS_PER_PAGE;
  const end = start + PROJECTS_PER_PAGE;

  cards.forEach((card, index) => {
    card.style.display = (index >= start && index < end) ? '' : 'none';
  });

  document.getElementById('prevBtn').disabled = page === 1;
  document.getElementById('nextBtn').disabled = page === totalPages;
  document.getElementById('pageInfo').textContent = `Page ${page} of ${totalPages}`;
}

function changePage(direction) {
  const cards = document.querySelectorAll('.project-card');
  const totalPages = Math.ceil(cards.length / PROJECTS_PER_PAGE);
  currentPage = Math.max(1, Math.min(totalPages, currentPage + direction));
  showPage(currentPage, cards, totalPages);

  document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('DOMContentLoaded', initPagination);
