// Load tasks on start
document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const category = document.getElementById("category").value;
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const task = { text: taskText, category, completed: false };
  saveTask(task);
  displayTask(task);

  taskInput.value = "";
}

// Display a task
function displayTask(task) {
  const taskList = document.getElementById("taskList");

  const li = document.createElement("li");
  if (task.completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.innerText = task.text;

  const categoryTag = document.createElement("span");
  categoryTag.classList.add("category", task.category);
  categoryTag.innerText = task.category;

  const actions = document.createElement("div");
  actions.classList.add("actions");

  const completeBtn = document.createElement("button");
  completeBtn.innerText = "✔";
  completeBtn.onclick = () => toggleComplete(task, li);

  const editBtn = document.createElement("button");
  editBtn.innerText = "✎";
  editBtn.onclick = () => editTask(task, span);

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "🗑";
  deleteBtn.onclick = () => deleteTask(task, li);

  actions.append(completeBtn, editBtn, deleteBtn);
  li.append(span, categoryTag, actions);
  taskList.appendChild(li);
}

// Toggle complete
function toggleComplete(task, li) {
  task.completed = !task.completed;
  li.classList.toggle("completed");
  updateStorage();
}

// Edit task
function editTask(task, span) {
  const newTask = prompt("Edit your task:", task.text);
  if (newTask !== null && newTask.trim() !== "") {
    task.text = newTask.trim();
    span.innerText = task.text;
    updateStorage();
  }
}

// Delete task
function deleteTask(task, li) {
  li.remove();
  removeTask(task);
}

// LocalStorage helpers
function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(displayTask);
}

function updateStorage() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    const text = li.querySelector("span").innerText;
    const category = li.querySelector(".category").innerText;
    const completed = li.classList.contains("completed");
    tasks.push({ text, category, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTask(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(t => !(t.text === task.text && t.category === task.category));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 🔍 Filter & Search
function filterTasks() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  const filterCategory = document.getElementById("filterCategory").value;
  
  document.querySelectorAll("#taskList li").forEach(li => {
    const text = li.querySelector("span").innerText.toLowerCase();
    const category = li.querySelector(".category").innerText;
    const matchesSearch = text.includes(searchInput);
    const matchesCategory = (filterCategory === "All" || category === filterCategory);
    
    li.style.display = (matchesSearch && matchesCategory) ? "flex" : "none";
  });
}
