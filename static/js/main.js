// -------------------- Load partial HTML --------------------
async function loadPartial(url, containerId, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const response = await fetch(url);
    if (!response.ok) {
        container.innerHTML = `<p>Kunne ikke laste ${url}</p>`;
        return;
    }

    const html = await response.text();
    container.innerHTML = html;

    if (containerId === "footer-container") {
        const yearSpan = document.getElementById("year");
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    }

    if (typeof callback === "function") {
        callback();
    }
}

// -------------------- Load navbar --------------------
loadPartial("partials/navbar.html", "navbar-container", () => {
    document.addEventListener("DOMContentLoaded", () => {
        const themeController = document.querySelector(".theme-controller");
        if (!themeController) return;

        const savedTheme = localStorage.getItem("theme") || "forest";
        applyTheme(savedTheme);

        themeController.checked = savedTheme === "forest";

        themeController.addEventListener("change", () => {
            const theme = themeController.checked ? "forest" : "corporate";

            applyTheme(theme);
            localStorage.setItem("theme", theme);
        });

        function applyTheme(theme) {
            document.documentElement.setAttribute("data-theme", theme);
        }
    });
});

// -------------------- Load main page content --------------------
loadPartial("partials/footer.html", "footer-container");
loadPartial("partials/presentation.html", "presentation-container");
loadPartial("partials/experience.html", "experience-container");

// -------------------- Projects Pagination --------------------
const projects = [
    {
        url: "partials/projects/stressio.html",
        containerId: "stressio-container",
    },
    { url: "partials/projects/lexy.html", containerId: "lexy-container" },
    { url: "partials/projects/memo.html", containerId: "memo-container" },
    { url: "partials/projects/tictactoe.html", containerId: "tic-container" },
    { url: "partials/projects/spotify.html", containerId: "spotify-container" },
    { url: "partials/projects/cafe.html", containerId: "cafe-container" },
    {
        url: "partials/projects/colorextractor.html",
        containerId: "color-container",
    },
    { url: "partials/projects/LOTR.html", containerId: "lotr-container" },
    {
        url: "partials/projects/evhotels.html",
        containerId: "evhotels-container",
    },
    {
        url: "partials/projects/simpleportfolio.html",
        containerId: "simpleportfolio-container",
    },
];

const projectsPerPage = 3;
let currentPage = 1;

// Render one page of projects
async function renderProjectsPage() {
    const container = document.getElementById("projects-container");
    if (!container) return;

    // Preserve current height to prevent "popping"
    const currentHeight = container.offsetHeight;
    if (currentHeight > 0) {
        container.style.minHeight = `${currentHeight}px`;
        container.style.transition = "min-height 0.3s ease-in-out";
    }

    container.innerHTML = "";

    const start = (currentPage - 1) * projectsPerPage;
    const end = start + projectsPerPage;
    const pageProjects = projects.slice(start, end);

    for (const proj of pageProjects) {
        const projectDiv = document.createElement("div");
        projectDiv.id = proj.containerId;
        container.appendChild(projectDiv);
        await loadPartial(proj.url, proj.containerId); // load project partial
    }

    // Remove min-height after content is loaded to allow natural sizing
    setTimeout(() => {
        container.style.minHeight = "";
        // Remove transition after the height change to avoid conflicts with other animations
        setTimeout(() => {
            container.style.transition = "";
        }, 300);
    }, 50);

    // Update page info
    const pageInfo = document.getElementById("page-info");
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(projects.length / projectsPerPage)}`;
    }

    updatePaginationButtons();
}

// Disable prev/next on first/last page
function updatePaginationButtons() {
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn)
        nextBtn.disabled =
            currentPage === Math.ceil(projects.length / projectsPerPage);
}

// Load projects partial and add event listeners when ready
loadPartial("partials/projects.html", "projects-container-wrapper", () => {
    // Legg til events etter at partial er lastet!
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderProjectsPage();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentPage < Math.ceil(projects.length / projectsPerPage)) {
                currentPage++;
                renderProjectsPage();
            }
        });
    }

    renderProjectsPage();
});
