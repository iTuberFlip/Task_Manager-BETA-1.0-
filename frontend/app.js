document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn")
    const registerBtn = document.getElementById("registerBtn")
    const addBtn = document.getElementById("addBtn")
    const logoutBtn = document.getElementById("logoutBtn")

    if(loginBtn) loginBtn.addEventListener("click", login)
    if(registerBtn) registerBtn.addEventListener("click", register)
    if(addBtn) addBtn.addEventListener("click", () => {
        const input = document.getElementById("taskInput")
        if(input.value.trim() !== "") {
            addTask(input.value.trim())
            input.value = ""
        }
    })
    if(logoutBtn) logoutBtn.addEventListener("click", logout)

    initSocket()
    checkLogin()
})

let socket

// ---------------- LOGIN / REGISTER ----------------
async function login() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })

    const data = await res.json()
    if(data.token){
        localStorage.setItem("token", data.token)
        localStorage.setItem("userId", data.user.id)
        console.log("Login correcto")
        showTaskSection()
        loadTasks()
    } else {
        console.error("Login fallido", data)
    }
}

async function register() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })

    const data = await res.json()
    if(data.id){
        console.log("Registro correcto")
        login()
    } else {
        console.error("Registro fallido", data)
    }
}

function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    document.getElementById("taskSection").style.display = "none"
    document.getElementById("authSection").style.display = "block"
}

function checkLogin(){
    const token = localStorage.getItem("token")
    if(token){
        showTaskSection()
        loadTasks()
    }
}

function showTaskSection(){
    document.getElementById("authSection").style.display = "none"
    document.getElementById("taskSection").style.display = "block"
}

// ---------------- TASKS ----------------
async function loadTasks(){
    const token = localStorage.getItem("token")
    if(!token) return console.log("No hay token, haz login")

    const res = await fetch("http://localhost:3000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` }
    })
    const tasks = await res.json()
    if(!Array.isArray(tasks)){
        console.error("Tasks no es un array", tasks)
        return
    }

    const list = document.getElementById("taskList")
    list.innerHTML = ""
    tasks.forEach(renderTask)
}

async function addTask(title){
    const token = localStorage.getItem("token")
    if(!token) return console.log("No hay token, haz login")

    const res = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title })
    })

    const task = await res.json()
    if(res.ok){
        renderTask(task)
        socket.emit("newTask", task)
    } else {
        console.error("Error al crear task", task)
    }
}

// ---------------- RENDER ----------------
function renderTask(task){
    const list = document.getElementById("taskList")
    const li = document.createElement("li")
    li.classList.add("task")
    if(task.completed) li.classList.add("completed")
    li.dataset.id = task.id

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.checked = task.completed
    checkbox.addEventListener("change", () => toggleTask(task.id, checkbox.checked, li))

    const span = document.createElement("span")
    span.textContent = task.title

    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "❌"
    deleteBtn.addEventListener("click", () => deleteTask(task.id, li))

    li.appendChild(checkbox)
    li.appendChild(span)
    li.appendChild(deleteBtn)
    list.appendChild(li)
}

// ---------------- TOGGLE / DELETE ----------------
async function toggleTask(id, completed, li){
    const token = localStorage.getItem("token")
    const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ completed })
    })

    const updatedTask = await res.json()

    if(res.ok){
        // Aplica o quita la clase según completed
        if(updatedTask.completed) li.classList.add("completed")
        else li.classList.remove("completed")

        // Notifica a otros clientes vía Socket.IO
        socket.emit("updateTask", { id, completed: updatedTask.completed })
    } else {
        console.error("Error al actualizar task")
    }
}

async function deleteTask(id, li){
    const token = localStorage.getItem("token")
    const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    })
    if(res.ok){
        li.remove()
        socket.emit("deleteTask", id)
    } else {
        console.error("Error al eliminar task")
    }
}

// ---------------- SOCKET.IO ----------------
function initSocket(){
    socket = io("http://localhost:3000")

    socket.on("connect", () => console.log("Socket conectado"))

    socket.on("newTask", task => {
        if(!document.querySelector(`[data-id='${task.id}']`)){
            renderTask(task)
        }
    })

    socket.on("updateTask", ({ id, completed }) => {
        const li = document.querySelector(`[data-id='${id}']`)
        if(li){
            if(completed) li.classList.add("completed")
            else li.classList.remove("completed")
        }
    })

    socket.on("deleteTask", id => {
        const li = document.querySelector(`[data-id='${id}']`)
        if(li) li.remove()
    })
}