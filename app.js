let testData = [
    {
        taskId: 4,
        completed: false,
        description: "Give feedback for A.B regarding product deck",
        timeLeft: "You still have 1 days 1 hour 25 minutes"
    },
    {
        taskId: 3,
        completed: false,
        description: "Book the dinner table for birthday party",
        timeLeft: "You still have 5 days 3 hour 15 minutes"
    },
    {
        taskId: 2,
        completed: false,
        description: "Read Angular documentation",
        timeLeft: "You still have 3 days 6 hour 32 minutes"
    },
    {
        taskId: 1,
        completed: false,
        description: "Implement Visma Home Assignment",
        timeLeft: "You still have 4 days 9 hour 52 minutes"
    }
];

let id;
let initID = JSON.parse(sessionStorage.getItem("autosaveid"));
let taskStorage = JSON.parse(sessionStorage.getItem("autosavetask"));
const deletePopup = document.querySelector(".deletePopup");
const popClose = document.querySelector(".popClose");
const confirmDelete = document.querySelector(".confirmDelete");
const toDoList = document.querySelector(".toDoList");
const form = document.querySelector(".inputForm");
const currTime = document.querySelector(".currTime");
const newDesc = document.querySelector("#newTask");
const deadline = document.querySelector("#ddl");
const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
const itemDescText = document.getElementsByClassName("itemDescription");
const itemNumberText = document.getElementsByClassName("itemNumber");
const timeLeftText = document.getElementsByClassName("timeLeft");
const sortDropDown = document.getElementById("sort");
const deleteBtns = document.getElementsByClassName("deleteBtn");


const sessionLoad = () => {
    initID !== null ? id = parseInt(initID, 10) : id = 5;
    !taskStorage && sessionStorage.setItem("autosavetask", JSON.stringify(testData));
};
sessionLoad();

const createListItem = (input) => {
    const task = document.createElement("li");
    const itemCheck = document.createElement("input");
    const itemNumber = document.createElement("span");
    const itemDesc = document.createElement("span");
    const timeLeft = document.createElement("span");
    const deleteBtn = document.createElement("button");
    itemCheck.setAttribute("type", "checkbox");
    itemCheck.classList.add("checkbox")
    deleteBtn.classList.add("deleteBtn")
    itemNumber.classList.add("itemNumber")
    itemDesc.classList.add("itemDescription")
    timeLeft.classList.add("timeLeft")
    deleteBtn.innerHTML = "Delete";
    itemCheck.checked = input.completed;
    itemNumber.innerHTML = input.taskId;
    itemDesc.innerHTML = input.description;
    timeLeft.innerHTML = `Time left: ${input.timeLeft}`;
    task.appendChild(itemCheck);
    task.appendChild(itemNumber);
    task.appendChild(itemDesc);
    task.appendChild(timeLeft);
    task.appendChild(deleteBtn);
    toDoList.appendChild(task);
};

const displayList = async () => {
    const taskStorage = JSON.parse(sessionStorage.getItem("autosavetask"));
    toDoList.innerHTML = '';
    taskStorage.map(item => createListItem(item));

    const deleteBtnsArray = Array.from(deleteBtns);
    deleteBtnsArray.forEach((deleteBtn, index) => {
        deleteBtn.addEventListener("click", () => {
            deletePopup.style.display = "block";
            const deleteBtnHandler = () => {
                removeItem(taskStorage, index);
                confirmDelete.removeEventListener("click", deleteBtnHandler);
            };
            confirmDelete.addEventListener("click", deleteBtnHandler);
        });
    });

    const checkBoxArray = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    checkBoxArray.forEach((checkBox, index) => {
        if (taskStorage[index].completed === true) {
            itemDescText[index].classList.toggle("striked");
            itemNumberText[index].classList.toggle("striked");
            timeLeftText[index].classList.toggle("striked");
        };
        checkBox.addEventListener("click", () => {
            markItem(index);
        });
    });
};
displayList();

const calculateRemaining = () => {
    const deadlineDate = new Date(deadline.value);
    const currentDate = new Date();
    const timeRemaining = deadlineDate.getTime() - currentDate.getTime();
    const remainingDays = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    return {
        days: remainingDays,
        hours: remainingHours,
        minutes: remainingMinutes
    };
};

const handleTimeLeft = () => {
    const remaining = calculateRemaining();
    if (isNaN(remaining.days)) {
        return "Deadline has not been set"
    } else {
        return `You still have ${remaining.days} ${remaining.days > 1 ? "days" : "day"} ${remaining.hours} ${remaining.hours > 1 ? "hours" : "hour"} ${remaining.minutes} ${remaining.minutes > 1 ? "minutes" : "minute"}`
    };
};

const newTaskObject = () => {
    let newTask = {
        taskId: id,
        completed: false,
        description: newDesc.value,
        timeLeft: handleTimeLeft()
    };
    return newTask;
};

const addItem = () => {
    const taskStorage = JSON.parse(sessionStorage.getItem("autosavetask"));
    const newTaskCreated = newTaskObject();
    id++;
    taskStorage.unshift(newTaskCreated);
    sessionStorage.setItem("autosavetask", JSON.stringify(taskStorage));
    sessionStorage.setItem("autosaveid", JSON.stringify(id));
    createListItem(newTaskCreated);
    newDesc.value = "";
    deadline.value = "";
    displayList();
};

const removeItem = (input, index) => {
    const itemToDelete = input[index];
    const newList = input.filter(item => item.taskId !== itemToDelete.taskId)
    sessionStorage.setItem("autosavetask", JSON.stringify(newList));
    deletePopup.style.display = "none";
    displayList();
};

const markItem = (index) => {
    const taskStorage = JSON.parse(sessionStorage.getItem("autosavetask"));
    const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
    itemDescText[index].classList.toggle("striked");
    itemNumberText[index].classList.toggle("striked");
    timeLeftText[index].classList.toggle("striked");
    itemDescText[index].classList.contains("striked") ? taskStorage[index].completed = true : taskStorage[index].completed = false;
    if (itemDescText[index].classList.contains("striked")) {
        const taskToMove = taskStorage[index];
        const indexToMove = taskStorage.indexOf(taskToMove);
        taskStorage.splice(indexToMove, 1);
        taskStorage.push(taskToMove);
    };
    sessionStorage.setItem("autosavetask", JSON.stringify(taskStorage));
    checkBoxes[index].checked = false
    displayList();
};

const minDeadlineTime = () => {
    const date = new Date()
    date.setMinutes(date.getMinutes() + 10)
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;
    const formattedDate = date.toISOString().slice(0, 10) + `T${formattedTime}`;
    deadline.min = formattedDate;
};
minDeadlineTime();

const sortRecentlyAdded = () => {
    const taskStorage = JSON.parse(sessionStorage.getItem("autosavetask"));
    taskStorage.sort((a, b) => b.taskId - a.taskId);
    sessionStorage.setItem("autosavetask", JSON.stringify(taskStorage));
    displayList();
};

const sortDeadline = () => {
    const taskStorage = JSON.parse(sessionStorage.getItem("autosavetask"));
    const compareTimeLeft = (a, b) => {
        const getTimeInMinutes = (str) => {
            const match = str.match(/\b(\d+)\s+days?\b/i);
            if (match) {
                const days = match ? parseInt(match[1]) : 0;
                const matchHours = str.match(/\b(\d+)\s+hours?\b/i);
                const hours = matchHours ? parseInt(matchHours[1]) : 0;
                const matchMinutes = str.match(/\b(\d+)\s+minutes?\b/i);
                const minutes = matchMinutes ? parseInt(matchMinutes[1]) : 0;
                return days * 24 * 60 + hours * 60 + minutes;
            } else {
                return Number.MAX_SAFE_INTEGER;
            }
        };
        const timeA = getTimeInMinutes(a.timeLeft);
        const timeB = getTimeInMinutes(b.timeLeft);
        return timeA - timeB;
    };
    taskStorage.sort(compareTimeLeft);
    sessionStorage.setItem("autosavetask", JSON.stringify(taskStorage));
    displayList();
};

const sortRecentlyCompleted = () => {
    const taskStorage = JSON.parse(sessionStorage.getItem("autosavetask"));
    taskStorage.sort((a, b) => b.completed - a.completed);
    sessionStorage.setItem("autosavetask", JSON.stringify(taskStorage));
    displayList();
};

handleSort = (e) => {
    const sortPick = e.target.value;
    if (sortPick === "recently-added") {
        sortRecentlyAdded();
    } else if (sortPick === "deadline") {
        sortDeadline();
    } else {
        sortRecentlyCompleted();
    }
};

sortDropDown.addEventListener("change", (e) => {
    handleSort(e);
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    addItem();
});

popClose.addEventListener("click", () => {
    deletePopup.style.display = "none";
});









