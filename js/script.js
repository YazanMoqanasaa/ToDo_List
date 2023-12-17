/* -> Start */

// Create tasksArray And Initialize To Values Of LocalStorage If Exists
// To Prevent Initialize Empty Array If There Tasks At LocalStorge
// To Save Tasks
let tasksArray = JSON.parse(localStorage.getItem("tasks")) ?
    JSON.parse(localStorage.getItem("tasks")) : [];

// Get The Input Field
let inputText = document.querySelector(".addNewTask");

// Add Event Listener On Input Field
inputText.addEventListener("keypress", (e) => {
    // If Enter Pressed Then ->
    if (e.key == "Enter") {
        if (inputText.value != "") {
            // Create Task Contains inputText.value And Add It To tasksArray
            addTasksToArray(inputText.value);
            // Add tasksArray Element To the Page
            addElementsToPage(tasksArray);
        }
        // Empty Input Field
        inputText.value = "";
    }
});

// Recall The Function To Show Elements In The Page After Reloading
if (tasksArray.length > 0) {
    addElementsToPage(tasksArray);
    document.querySelector('.showAll').classList.add('active-btn');
}

function addElementsToPage(tasksArray) {
    let tasks = document.querySelector(".tasks");
    // To Prevent Repeated Tasks When Reloading Page
    tasks.innerHTML = "";
    // Loop Through tasksArray And Create Element For Each Task
    tasksArray.forEach((ts) => {
        let task = document.createElement("div");
        task.classList.add("task");
        if (ts.isCompleted) {
            task.classList.add("completed");
        } else {
            task.classList.add("active-task");
        }
        task.classList.add("flex-row");
        task.setAttribute("data-id", `${ts.id}`);
        task.setAttribute("draggable", true);
        let checkBoxDiv = document.createElement("div");
        checkBoxDiv.classList.add("checkbox");
        let circleDiv = document.createElement("div");
        circleDiv.classList.add("circle");
        let iElement = document.createElement("i");
        iElement.classList.add("fa");
        iElement.classList.add("fa-check");
        let taskContent = document.createElement("div");
        taskContent.classList.add("task-content");
        let pElement = document.createElement("p");
        let textNode = document.createTextNode(ts.title);
        pElement.appendChild(textNode);
        let iElementCon = document.createElement("i");
        iElementCon.classList.add("fa");
        iElementCon.classList.add("fa-times");
        iElementCon.classList.add("deleteBtn");
        circleDiv.appendChild(iElement);
        checkBoxDiv.appendChild(circleDiv);
        task.appendChild(checkBoxDiv);
        taskContent.appendChild(pElement);
        taskContent.appendChild(iElementCon);
        task.appendChild(taskContent);
        iElementCon.onclick = deleteTask;
        tasks.appendChild(task);
        checkBoxDiv.onclick = clickToComplete;

    });
    counterActive();

}


// Add Tasks To tasksArray
function addTasksToArray(taskText) {
    // Create Task Object
    let task = {
        id: Date.now(),
        title: taskText,
        isCompleted: false,
    };
    // Push Task To tasksArray
    tasksArray.push(task);
    // Add tasksArray To LocalStorage
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

function clickToComplete(e) {
    e.currentTarget.parentElement.classList.toggle("completed");
    e.currentTarget.parentElement.classList.toggle("active-task");
    changeIsCompleted(e.currentTarget.parentElement.getAttribute("data-id"));

    counterActive();
}

function changeIsCompleted(taskid) {
    for (let i = 0; i < tasksArray.length; i++) {
        if (tasksArray[i].id == taskid) {
            tasksArray[i].isCompleted == false ?
                (tasksArray[i].isCompleted = true) :
                (tasksArray[i].isCompleted = false);
            localStorage.setItem("tasks", JSON.stringify(tasksArray));
        }
    }
}



/* CLEAR COMPLETED  ..  */

const clearCompleted = document.querySelectorAll(".btn-clear-all");
for (let i = 0; i < clearCompleted.length; i++) {
    clearCompleted[i].addEventListener("click", clean)
}

function clean() {
    tasksArray = tasksArray.filter((task) => task.isCompleted != true)
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
    const completeTask = document.querySelectorAll(".completed")
    for (let i = 0; i < completeTask.length; i++) {
        completeTask[i].remove();
    }
}

/* DRAG AND DROP ..  */
const dragArea = document.querySelector(".tasks");
new Sortable(dragArea, {
    Animation: 350
});

/* show active */

let activ_s = document.querySelector('.showActive');
activ_s.addEventListener('click', active_function);

function active_function(event) {
    document.querySelectorAll('.task').forEach(function(e) {
        if (e.classList.contains("completed")) {
            e.style.display = "none";
        } else {
            e.style.display = "flex";

        }
    });

    document.querySelector('.showAll').classList.remove('active-btn');
    document.querySelector('.showCompleted').classList.remove('active-btn');
    event.target.classList.add('active-btn');
}
/* DONE show ALL */
/*change theme */

let element = document.querySelector('.fas');
element.addEventListener('click', change);
if (JSON.parse(localStorage.getItem('theme')) == "light-theme") {
    document.body.classList.toggle('light-theme');
    element.classList.toggle('fa-moon');
    element.classList.toggle('fa-sun');
}

function change() {
    document.body.classList.toggle('light-theme');
    element.classList.toggle('fa-sun');
    element.classList.toggle('fa-moon');
    if (document.body.classList.contains('light-theme')) {
        localStorage.setItem('theme', JSON.stringify('light-theme'));
    } else {
        localStorage.removeItem('theme');
    }
}


/*Counts Active Tasks ..*/

function counterActive() {

    let counter = document.querySelectorAll('.counter');
    let CounterTasks = 0;

    for (let i = 0; i < tasksArray.length; i++) {
        if (!tasksArray[i].isCompleted) {
            CounterTasks += 1;
        }
    }
    for (let z = 0; z < counter.length; z++) {
        counter[z].innerHTML = CounterTasks;
    }

}

/* delete tasks & show completed & show all */

function deleteTask(e) {
    const taskId = e.currentTarget.parentElement.parentElement.getAttribute('data-id')

    let todos = JSON.parse(localStorage.getItem("tasks"));
    todos = todos.filter(task => task.id != taskId);
    localStorage.setItem("tasks", JSON.stringify(todos));

    e.currentTarget.parentElement.parentElement.remove();

    tasksArray = todos;

    counterActive();
}



let sh = document.querySelector(".showCompleted");
sh.addEventListener("click", showCompletedTasks);

function showCompletedTasks(event) {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(function(todo) {
        if (todo.classList.contains("completed")) {
            todo.style.display = "flex";
        } else {
            todo.style.display = "none";
        }
    });

    document.querySelector('.showActive').classList.remove('active-btn');
    document.querySelector('.showAll').classList.remove('active-btn');
    event.target.classList.add('active-btn');
}
let show = document.querySelector(".showAll");
show.addEventListener("click", showAllTasks);

function showAllTasks(event) {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(function(todo) {
        todo.style.display = "flex";
    });

    document.querySelector('.showActive').classList.remove('active-btn');
    document.querySelector('.showCompleted').classList.remove('active-btn');
    event.target.classList.add('active-btn');

}
