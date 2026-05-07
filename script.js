const CLOUD_NAME = "dobyynnth";        // ⚠️ replace this
const UPLOAD_PRESET = "portfolio";  // ⚠️ replace this

/* LOAD SAVED IMAGES */
window.onload = function () {
    const savedImages = JSON.parse(localStorage.getItem("certificates")) || [];
    savedImages.forEach(src => createImageCard(src));
};

/* ADD IMAGE */
async function addImage() {
    const input = document.getElementById("fileInput");
    const file = input.files[0];

    if (!file) {
        alert("Select an image first!");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        console.log("Cloudinary response:", data);

        if (!data.secure_url) {
            alert("Upload failed! Check preset/cloud name.");
            return;
        }

        const imageUrl = data.secure_url;

        createImageCard(imageUrl);

        // SAVE TO LOCAL STORAGE
        const savedImages = JSON.parse(localStorage.getItem("certificates")) || [];
        savedImages.push(imageUrl);
        localStorage.setItem("certificates", JSON.stringify(savedImages));

        input.value = "";

    } catch (err) {
        console.error("Upload error:", err);
        alert("Error uploading image");
    }
}

/* CREATE IMAGE CARD */
function createImageCard(src) {
    const gallery = document.getElementById("gallery");

    const card = document.createElement("div");
    card.className = "image-card";

    const img = document.createElement("img");
    img.src = src;

    // FULLSCREEN VIEW
    img.onclick = () => openModal(src);

    const delBtn = document.createElement("button");
    delBtn.innerText = "X";
    delBtn.className = "delete-btn";

    delBtn.onclick = () => {
        card.remove();
        removeFromStorage(src);
    };

    card.appendChild(img);
    card.appendChild(delBtn);
    gallery.appendChild(card);
}

/* REMOVE FROM STORAGE */
function removeFromStorage(src) {
    let savedImages = JSON.parse(localStorage.getItem("certificates")) || [];
    savedImages = savedImages.filter(img => img !== src);
    localStorage.setItem("certificates", JSON.stringify(savedImages));
}

/* MODAL OPEN */
function openModal(src) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");

    modal.style.display = "flex";
    modalImg.src = src;
}

/* MODAL CLOSE */
function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

/* ELEMENTS */
const addProjectBtn = document.getElementById("addProjectBtn");

const projectModal = document.getElementById("projectModal");

const closeModalBtn = document.getElementById("closeModalBtn");

const saveProjectBtn = document.getElementById("saveProjectBtn");

const projectsContainer = document.getElementById("projectsContainer");

/* LOAD SAVED PROJECTS */
window.addEventListener("DOMContentLoaded", loadProjects);

/* OPEN MODAL */
addProjectBtn.addEventListener("click", () => {

    projectModal.classList.add("active");

});

/* CLOSE MODAL */
closeModalBtn.addEventListener("click", () => {

    projectModal.classList.remove("active");

});

/* SAVE PROJECT */
saveProjectBtn.addEventListener("click", () => {

    const projectName =
        document.getElementById("projectName").value;

    const projectDescription =
        document.getElementById("projectDescription").value;

    const githubLink =
        document.getElementById("githubLink").value;

    if (!projectName) return;

    const projectData = {
        name: projectName,
        description: projectDescription,
        github: githubLink
    };

    createProjectCard(projectData);

    saveProject(projectData);

    /* CLEAR INPUTS */
    document.getElementById("projectName").value = "";

    document.getElementById("projectDescription").value = "";

    document.getElementById("githubLink").value = "";

    /* CLOSE MODAL */
    projectModal.classList.remove("active");

});

/* CREATE CARD */
function createProjectCard(project) {

    const card = document.createElement("div");

    card.classList.add("project-card");

    card.innerHTML = `

        <button class="delete-btn">✖</button>

        <h2>${project.name}</h2>

        <p>${project.description}</p>

        <a href="${project.github}" target="_blank">
            View Project ↗
        </a>

    `;

    /* DELETE */
    const deleteBtn = card.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", () => {

        card.remove();

        deleteProject(project.name);

    });

    projectsContainer.appendChild(card);

}

/* SAVE */
function saveProject(project) {

    let projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    projects.push(project);

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );

}

/* LOAD */
function loadProjects() {

    let projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    projects.forEach(project => {

        createProjectCard(project);

    });

}

/* DELETE */
function deleteProject(projectName) {

    let projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    projects = projects.filter(
        project => project.name !== projectName
    );

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );

}