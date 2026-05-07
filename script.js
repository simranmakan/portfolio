/* =========================
   SUPABASE CONFIG
========================= */

const SUPABASE_URL =
"https://tbkqhfaujqotofvsvczo.supabase.co";

const SUPABASE_KEY =
"sb_publishable_Y6g3eK65yIF_cRpToXiKMQ_QecYHC0T";

const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

/* =========================
   LOAD CERTIFICATES
========================= */

window.onload = async function () {

    const { data, error } = await client
        .from("certificates")
        .select("*");

    if (error) {
        console.log(error);
        return;
    }

    data.forEach(item => {
    createImageCard(item.image_url, item.id);
});
};

/* =========================
   ADD IMAGE
========================= */

async function addImage() {

    const input = document.getElementById("fileInput");
    const file = input.files[0];

    if (!file) {
        alert("Select an image first!");
        return;
    }

    const fileName =
        Date.now() + "-" + file.name;

    /* UPLOAD TO STORAGE */
    const { error: uploadError } =
        await client.storage
            .from("certificates")
            .upload(fileName, file);

    if (uploadError) {
        console.log(uploadError);
        alert("Upload failed");
        return;
    }

    /* GET PUBLIC URL */
    const { data: publicData } =
        client.storage
            .from("certificates")
            .getPublicUrl(fileName);

    const imageUrl = publicData.publicUrl;

    /* SAVE URL TO DATABASE */
    const { error: dbError } =
        await client
            .from("certificates")
            .insert([
                { image_url: imageUrl }
            ]);

    if (dbError) {
        console.log(dbError);
        alert("Database save failed");
        return;
    }

    createImageCard(imageUrl);

    input.value = "";
}

/* =========================
   CREATE IMAGE CARD
========================= */

function createImageCard(src, id) {

    function createImageCard(src, id) {

    const gallery =
        document.getElementById("gallery");

    if (!gallery) return;
    }

    const card =
        document.createElement("div");

    card.className = "image-card";

    const img =
        document.createElement("img");

    img.src = src;

    img.onclick = () => openModal(src);

    const delBtn =
        document.createElement("button");

    delBtn.innerText = "X";

    delBtn.className = "delete-btn";

    delBtn.onclick = async () => {

        /* DELETE FROM DATABASE */
        const { error } = await client
            .from("certificates")
            .delete()
            .eq("id", id);

        if (error) {
            console.log(error);
            alert("Delete failed");
            return;
        }

        /* REMOVE CARD */
        card.remove();
    };

    card.appendChild(img);
    card.appendChild(delBtn);

    gallery.appendChild(card);
}

/* =========================
   MODAL
========================= */

function openModal(src) {

    const modal =
        document.getElementById("imageModal");

    const modalImg =
        document.getElementById("modalImg");

    modal.style.display = "flex";

    modalImg.src = src;
}

function closeModal() {

    document.getElementById("imageModal")
        .style.display = "none";
}

/* =========================
   PROJECT SECTION (UNCHANGED)
   ========================= */

const addProjectBtn = document.getElementById("addProjectBtn");
const projectModal = document.getElementById("projectModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveProjectBtn = document.getElementById("saveProjectBtn");
const projectsContainer = document.getElementById("projectsContainer");

/* LOAD PROJECTS */
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

    const projectName = document.getElementById("projectName").value;
    const projectDescription = document.getElementById("projectDescription").value;
    const githubLink = document.getElementById("githubLink").value;

    if (!projectName) return;

    const projectData = {
        name: projectName,
        description: projectDescription,
        github: githubLink
    };

    createProjectCard(projectData);
    saveProject(projectData);

    document.getElementById("projectName").value = "";
    document.getElementById("projectDescription").value = "";
    document.getElementById("githubLink").value = "";

    projectModal.classList.remove("active");
});

/* CREATE PROJECT CARD */
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

    const deleteBtn = card.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", () => {
        card.remove();
        deleteProject(project.name);
    });

    projectsContainer.appendChild(card);
}

/* SAVE PROJECT */
function saveProject(project) {

    let projects = JSON.parse(localStorage.getItem("projects")) || [];
    projects.push(project);

    localStorage.setItem("projects", JSON.stringify(projects));
}

/* LOAD PROJECTS */
function loadProjects() {

    let projects = JSON.parse(localStorage.getItem("projects")) || [];
    projects.forEach(project => {
        createProjectCard(project);
    });
}

/* DELETE PROJECT */
function deleteProject(projectName) {

    let projects = JSON.parse(localStorage.getItem("projects")) || [];

    projects = projects.filter(
        project => project.name !== projectName
    );

    localStorage.setItem("projects", JSON.stringify(projects));
}