// Project configuration
const projectFiles = [
  "stressio.html",
  "lexy.html", 
  "memo.html",
  "tictactoe.html",
  "spotify.html",
  "cafe.html",
  "colorextractor.html",
  "LOTR.html",
  "evhotels.html",
  "simpleportfolio.html"
];

// Pagination configuration
let currentProjectsShown = 0;
const projectsPerLoad = 6;
const initialProjects = 3;

// Modal functions for project details
function openProjectModal(projectId) {
  const modal = document.getElementById(`${projectId}-modal`);
  if (modal) {
    modal.showModal();
    // Add scroll lock to body
    document.body.style.overflow = 'hidden';
  }
}

function closeProjectModal(projectId) {
  const modal = document.getElementById(`${projectId}-modal`);
  if (modal) {
    modal.close();
    // Remove scroll lock from body
    document.body.style.overflow = 'auto';
  }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal-backdrop')) {
    document.body.style.overflow = 'auto';
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    document.body.style.overflow = 'auto';
  }
});

// Load project HTML from file
async function loadProjectHTML(filename) {
  try {
    const response = await fetch(`partials/projects/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Error loading project:", error);
    return `<div class="card bg-error text-error-content p-4">
              <h3>Error loading project</h3>
              <p>Could not load ${filename}</p>
            </div>`;
  }
}

// Animate project cards as they appear
function animateProjectCards() {
  const newCards = document.querySelectorAll(".project-card:not(.animated)");
  newCards.forEach((card, index) => {
    card.classList.add("animated");
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    
    setTimeout(() => {
      card.style.transition = "opacity 0.5s ease-in-out, transform 0.5s ease-in-out";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 100);
  });
}

// Load projects with pagination
async function loadProjects(count) {
  const container = document.getElementById("projects-container");
  const projectsToLoad = projectFiles.slice(currentProjectsShown, currentProjectsShown + count);
  
  // Show loading indicator
  const loadMoreBtn = document.getElementById("load-more-btn");
  const originalBtnText = loadMoreBtn.innerHTML;
  loadMoreBtn.innerHTML = `
    <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Loading...
  `;
  loadMoreBtn.disabled = true;
  
  try {
    // Load all project HTML files
    const projectsHTML = await Promise.all(
      projectsToLoad.map(filename => loadProjectHTML(filename))
    );
    
    // Add each project to the container
    projectsHTML.forEach(html => {
      const projectWrapper = document.createElement("div");
      projectWrapper.className = "project-card";
      projectWrapper.innerHTML = html;
      container.appendChild(projectWrapper);
    });
    
    currentProjectsShown += count;
    
    // Animate new cards
    setTimeout(() => {
      animateProjectCards();
    }, 50);
    
    // Update button state
    updateLoadMoreButton();
    
  } catch (error) {
    console.error("Error loading projects:", error);
    // Restore button on error
    loadMoreBtn.innerHTML = originalBtnText;
    loadMoreBtn.disabled = false;
  }
}

// Update the Load More button state
function updateLoadMoreButton() {
  const loadMoreBtn = document.getElementById("load-more-btn");
  const remainingProjects = projectFiles.length - currentProjectsShown;
  
  if (remainingProjects <= 0) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.disabled = false;
    loadMoreBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Load More (${remainingProjects} remaining)
    `;
  }
}

// Initialize projects when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Load initial projects
  loadProjects(initialProjects);
  
  // Add event listener to load more button
  document.getElementById("load-more-btn").addEventListener("click", function() {
    loadProjects(projectsPerLoad);
  });
});

// Optional: Add smooth scrolling to new projects
function scrollToNewProjects() {
  const allCards = document.querySelectorAll(".project-card");
  if (allCards.length > initialProjects) {
    const targetCard = allCards[currentProjectsShown - projectsPerLoad];
    if (targetCard) {
      targetCard.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
    }
  }
}
