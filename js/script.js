
// PERSONAL PORTFOLIO JAVASCRIPT

// 1. DARK / LIGHT MODE
const themeToggle = document.getElementById("themeToggle");

// Check if the visitor previously selected dark mode
if (localStorage.getItem("portfolioTheme") === "dark") {
    document.body.classList.add("dark-mode");
}

function updateThemeButton() {
    if (!themeToggle) return;

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️ Light";
    } else {
        themeToggle.textContent = "🌙 Dark";
    }
}

updateThemeButton();

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        const theme = document.body.classList.contains("dark-mode")
            ? "dark"
            : "light";

        localStorage.setItem("portfolioTheme", theme);
        updateThemeButton();
    });
}


// 2. PROJECT DATA
const projectContainer = document.getElementById("projectContainer");
const projectSearch = document.getElementById("projectSearch");
const projectCount = document.getElementById("projectCount");
const filterButtons = document.querySelectorAll(".filter-btn");

let allProjects = [];
let selectedCategory = "All";


// 3. LOAD PROJECTS FROM JSON
async function loadProjects() {
    if (!projectContainer) return;

    try {
        const response = await fetch("data/projects.json");

        if (!response.ok) {
            throw new Error("Could not load projects.");
        }

        allProjects = await response.json();

        displayProjects();

    } catch (error) {
        console.error("Error loading projects:", error);

        projectContainer.innerHTML = `
            <div class="col-12 text-center">
                <p>Sorry, the projects could not be loaded.
                Please try again later.</p>
            </div>
        `;
    }
}


// 4. DISPLAY PROJECT CARDS
function displayProjects() {
    if (!projectContainer) return;

    const searchText = projectSearch
        ? projectSearch.value.toLowerCase().trim()
        : "";

    const filteredProjects = allProjects.filter(function (project) {

        const matchesCategory =
            selectedCategory === "All" ||
            project.category === selectedCategory;

        const searchableText = [
            project.title,
            project.description,
            project.category,
            ...project.technologies
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchText);

        return matchesCategory && matchesSearch;
    });

    // Remove the old cards
    projectContainer.innerHTML = "";

    if (projectCount) {
        projectCount.textContent =
            `Showing ${filteredProjects.length} project(s)`;
    }

    if (filteredProjects.length === 0) {
        projectContainer.innerHTML = `
            <div class="col-12 text-center">
                <p>No projects found. Try another search or category.</p>
            </div>
        `;
        return;
    }

    // Create a card for every matching project
    filteredProjects.forEach(function (project) {

        const column = document.createElement("div");
        column.className = "col-md-6 col-lg-4";

        const card = document.createElement("div");
        card.className = "custom-card project-card h-100";

        const category = document.createElement("p");
        category.className = "project-category";
        category.textContent = project.category;

        const title = document.createElement("h3");
        title.textContent = project.title;

        const description = document.createElement("p");
        description.textContent = project.description;

        const technologies = document.createElement("div");
        technologies.className = "mt-3";

        project.technologies.forEach(function (technology) {
            const badge = document.createElement("span");
            badge.className = "badge skill-badge";
            badge.textContent = technology;
            technologies.appendChild(badge);
        });

        card.appendChild(category);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(technologies);

        column.appendChild(card);
        projectContainer.appendChild(column);
    });
}


// 5. FILTER PROJECTS BY CATEGORY
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {

        selectedCategory = button.dataset.category;

        filterButtons.forEach(function (otherButton) {
            otherButton.classList.remove("active", "btn-pink");
            otherButton.classList.add("btn-outline-pink");
        });

        button.classList.add("active", "btn-pink");
        button.classList.remove("btn-outline-pink");

        displayProjects();
    });
});


// 6. SEARCH PROJECTS
if (projectSearch) {
    projectSearch.addEventListener("input", function () {
        displayProjects();
    });
}


// 7. LOAD PROJECTS WHEN THE PAGE OPENS
loadProjects();
