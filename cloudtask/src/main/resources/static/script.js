const API_URL = "/api/tasks";

const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");

const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");

const loading = document.getElementById("loading");
const emptyState = document.getElementById("empty-state");

const formMessage = document.getElementById("form-message");

const editModal = document.getElementById("edit-modal");
const editTaskForm = document.getElementById("edit-task-form");

const editTaskId = document.getElementById("edit-task-id");
const editTitle = document.getElementById("edit-title");
const editDescription = document.getElementById("edit-description");
const editCompleted = document.getElementById("edit-completed");

const editMessage = document.getElementById("edit-message");

const closeModalButton = document.getElementById("close-modal-btn");
const cancelModalButton = document.getElementById("cancel-modal-btn");

let tasks = [];


/* =========================
   Load Tasks
   ========================= */

async function loadTasks() {
    loading.classList.remove("hidden");
    emptyState.classList.add("hidden");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load tasks.");
        }

        tasks = await response.json();

        renderTasks();

    } catch (error) {
        showFormMessage(error.message, "error");
    } finally {
        loading.classList.add("hidden");
    }
}


/* =========================
   Render Tasks
   ========================= */

function renderTasks() {
    taskList.innerHTML = "";

    taskCount.textContent = tasks.length;

    if (tasks.length === 0) {
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");

    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        taskList.appendChild(taskCard);
    });
}


/* =========================
   Create Task Card
   ========================= */

function createTaskCard(task) {
    const card = document.createElement("div");

    card.className = `task-card ${task.completed ? "completed" : ""}`;

    const formattedDate = task.createdAt
        ? formatDate(task.createdAt)
        : "Date unavailable";

    const statusClass = task.completed
        ? "completed"
        : "pending";

    const statusText = task.completed
        ? "Completed"
        : "Pending";

    card.innerHTML = `
        <div class="task-top">

            <div>
                <h3 class="task-title">
                    ${escapeHtml(task.title)}
                </h3>

                <p class="task-description">
                    ${escapeHtml(task.description || "No description provided.")}
                </p>

                <div class="task-meta">

                    <span class="task-status ${statusClass}">
                        ${statusText}
                    </span>

                    <span>
                        Created: ${formattedDate}
                    </span>

                </div>
            </div>

        </div>

        <div class="task-actions">

            ${
                !task.completed
                    ? `
                        <button
                            class="complete-btn"
                            onclick="completeTask(${task.id})"
                        >
                            Complete
                        </button>
                    `
                    : ""
            }

            <button
                class="edit-btn"
                onclick="openEditModal(${task.id})"
            >
                Edit
            </button>

            <button
                class="danger-btn"
                onclick="deleteTask(${task.id})"
            >
                Delete
            </button>

        </div>
    `;

    return card;
}


/* =========================
   Create Task
   ========================= */

taskForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title) {
        showFormMessage("Title is required.", "error");
        return;
    }

    const task = {
        title: title,
        description: description
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(task)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to create task."
            );
        }

        titleInput.value = "";
        descriptionInput.value = "";

        showFormMessage(
            "Task created successfully.",
            "success"
        );

        await loadTasks();

    } catch (error) {
        showFormMessage(error.message, "error");
    }
});


/* =========================
   Complete Task
   ========================= */

async function completeTask(id) {
    try {
        const response = await fetch(
            `${API_URL}/${id}/complete`,
            {
                method: "PATCH"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to complete task."
            );
        }

        await loadTasks();

    } catch (error) {
        showFormMessage(error.message, "error");
    }
}


/* =========================
   Delete Task
   ========================= */

async function deleteTask(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {

            let message = "Unable to delete task.";

            try {
                const data = await response.json();

                if (data.message) {
                    message = data.message;
                }

            } catch {
                // Response may have no body.
            }

            throw new Error(message);
        }

        await loadTasks();

    } catch (error) {
        showFormMessage(error.message, "error");
    }
}


/* =========================
   Open Edit Modal
   ========================= */

function openEditModal(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) {
        showFormMessage("Task not found.", "error");
        return;
    }

    editTaskId.value = task.id;
    editTitle.value = task.title;
    editDescription.value = task.description || "";
    editCompleted.checked = task.completed;

    editMessage.className = "message hidden";
    editMessage.textContent = "";

    editModal.classList.remove("hidden");
}


/* =========================
   Close Edit Modal
   ========================= */

function closeEditModal() {
    editModal.classList.add("hidden");

    editTaskForm.reset();

    editMessage.className = "message hidden";
    editMessage.textContent = "";
}

closeModalButton.addEventListener(
    "click",
    closeEditModal
);

cancelModalButton.addEventListener(
    "click",
    closeEditModal
);


/* =========================
   Update Task
   ========================= */

editTaskForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = editTaskId.value;

    const updatedTask = {
        title: editTitle.value.trim(),
        description: editDescription.value.trim(),
        completed: editCompleted.checked
    };

    if (!updatedTask.title) {
        showEditMessage(
            "Title is required.",
            "error"
        );

        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedTask)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to update task."
            );
        }

        closeEditModal();

        await loadTasks();

    } catch (error) {
        showEditMessage(
            error.message,
            "error"
        );
    }
});


/* =========================
   Form Messages
   ========================= */

function showFormMessage(message, type) {
    formMessage.textContent = message;

    formMessage.className =
        `message ${type}`;

    setTimeout(() => {
        formMessage.classList.add("hidden");
    }, 3000);
}


function showEditMessage(message, type) {
    editMessage.textContent = message;

    editMessage.className =
        `message ${type}`;
}


/* =========================
   Format Date
   ========================= */

function formatDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleString();
}


/* =========================
   Prevent HTML Injection
   ========================= */

function escapeHtml(value) {
    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


/* =========================
   Close Modal on Background
   ========================= */

editModal.addEventListener("click", function (event) {
    if (event.target === editModal) {
        closeEditModal();
    }
});


/* =========================
   Initial Load
   ========================= */

loadTasks();