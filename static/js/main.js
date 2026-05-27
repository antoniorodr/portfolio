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

  let linksHtml = '';
  if (project.links.github) {
    linksHtml += `<a href="${project.links.github}" class="project-modal-link" target="_blank" rel="noopener">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      GitHub
    </a>`;
  }
  if (project.links.website) {
    linksHtml += `<a href="${project.links.website}" class="project-modal-link" target="_blank" rel="noopener">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      Website
    </a>`;
  }
  if (project.links.demo) {
    linksHtml += `<a href="${project.links.demo}" class="project-modal-link" target="_blank" rel="noopener">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      Live Demo
    </a>`;
  }

  const techHtml = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

  let achievementsHtml = '';
  if (project.details && project.details.achievements) {
    const items = project.details.achievements.map(a => `<li>${a}</li>`).join('');
    achievementsHtml = `<div class="project-modal-section">
      <h4>Key achievements &amp; learnings</h4>
      <ul class="project-modal-achievements">${items}</ul>
    </div>`;
  }

  let roleHtml = '';
  if (project.details && project.details.role) {
    roleHtml = `<div class="project-modal-section">
      <h4>My role</h4>
      <p>${project.details.role}</p>
    </div>`;
  }

  document.getElementById('projectModalContent').innerHTML = `
    <div class="project-modal-content">
      <p class="project-modal-description">${project.modalDescription || project.description}</p>
      <div class="project-modal-section">
        <h4>Technologies</h4>
        <div class="project-modal-tech">${techHtml}</div>
      </div>
      ${roleHtml}
      ${achievementsHtml}
      ${linksHtml ? `<div class="project-modal-section">
        <h4>Links</h4>
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
