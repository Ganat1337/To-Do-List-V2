let form = document.querySelector("#form");
let input = document.querySelector("#task-input");
let submit = document.querySelector(".add-btn");
let clear = document.querySelector(".clear-btn");
let counter = document.querySelector("#counter");
let list = document.querySelector("#tasks-list");
let colorBtns = document.querySelectorAll(".color-btn");

// Array
let arrayOfTasks = [];

// 1-Theme Color Switcher Logic
let savedColor = localStorage.getItem("theme_color") || "#8a2be2";
setThemeColor(savedColor);

colorBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let selectedColor = e.target.dataset.color;
    setThemeColor(selectedColor);
    localStorage.setItem("theme_color", selectedColor);
  });
});

function setThemeColor(color) {
  document.documentElement.style.setProperty("--primary-color", color);
  colorBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.color === color);
  });
}


//2- check if there any trash
function getDataFromLocalStorage() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    arrayOfTasks = JSON.parse(data);
    addElementsToPageFrom(arrayOfTasks);
  }
}
getDataFromLocalStorage()

// 3-update counter
function updateCounter() {
  counter.textContent = `Tasks: ${arrayOfTasks.length}`;
}

// 4-save and restore
function addDataToLocalStorageFrom(arrayOfTasks) {
  window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

// 5-submit
form.addEventListener("submit", function (e) {
  // prevent refresh
  e.preventDefault();

  // check if it's empty
  if (input.value.trim() === "") {
    return;
  }

  // create obj
  const task = {
    id: Date.now(),
    title: input.value,
    completed: false,
  };

  arrayOfTasks.push(task);
  console.log(arrayOfTasks);
  input.value = "";
  
  addElementsToPageFrom(arrayOfTasks);
  addDataToLocalStorageFrom(arrayOfTasks)
});

// 6-Render
function addElementsToPageFrom(arrayOfTasks) {
  // clear list 
  list.innerHTML = "";

  arrayOfTasks.forEach((task) => {
    let li = document.createElement("li");
    li.setAttribute("data-id", task.id);

    if (task.completed) {
      li.className = "completed";
    }

    // Task Content Container (Circle Checkbox + Title)
    let contentDiv = document.createElement("div");
    contentDiv.className = "task-content";

    let checkbox = document.createElement("div");
    checkbox.className = "checkbox";

    let taskText = document.createElement("span");
    taskText.className = "text";
    taskText.textContent = task.title;

    contentDiv.appendChild(checkbox);
    contentDiv.appendChild(taskText);
    li.appendChild(contentDiv);

    li.onclick = function(e){
        if (e.target.classList.contains("del")) return;
        task.completed = !task.completed;
        addElementsToPageFrom(arrayOfTasks);
        addDataToLocalStorageFrom(arrayOfTasks);
    }

    // delete btn
    let deleteBtn = document.createElement("button");
    deleteBtn.className = "del";
    deleteBtn.textContent = "Delete";

    deleteBtn.onclick = function () {
      for (let i = 0; i < arrayOfTasks.length; i++) {
        if (arrayOfTasks[i].id === task.id) {
          arrayOfTasks.splice(i, 1); // مسحنا الأوبجيكت من الـ Array
          break; // نخرج من الـ loop
        }
      }
      addElementsToPageFrom(arrayOfTasks);
      addDataToLocalStorageFrom(arrayOfTasks)
    };

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });

  updateCounter();
}

// 7-clear all btn
clear.onclick = function () {
  if (list.children.length === 0) return;
    if (confirm("Are you sure you want to delete all tasks?")) {
  list.innerHTML = "";
  arrayOfTasks = [];
  window.localStorage.removeItem("tasks");
  updateCounter();
}

};
