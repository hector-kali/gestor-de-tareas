// Obtener referencias a los elementos del DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const tasksList = document.getElementById('tasksList');
const filterButtons = document.querySelectorAll('.filter-btn');
const tasksCount = document.getElementById('tasksCount');
const clearCompletedBtn = document.getElementById('clearCompleted');

// Estado inicial de las tareas
let tasks = [];

// Función para guardar tareas en localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTasksCount();
}

// Función para cargar tareas desde localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

// Función para renderizar las tareas
function renderTasks(filter = 'all') {
    tasksList.innerHTML = '';
    
    const filteredTasks = filter === 'all' 
        ? tasks 
        : tasks.filter(task => task.status === filter);

    filteredTasks.forEach(task => {
        const realIndex = tasks.indexOf(task);

        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.status === 'completed' ? 'completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.status === 'completed';

        const textSpan = document.createElement('span');
        textSpan.textContent = task.text;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Eliminar';

        // Eventos de la tarea
        checkbox.addEventListener('change', function() {
            tasks[realIndex].status = this.checked ? 'completed' : 'active';
            saveTasks();
            renderTasks(filter);
        });

        deleteButton.addEventListener('click', () => {
            tasks.splice(realIndex, 1);
            saveTasks();
            renderTasks(filter);
        });

        taskElement.appendChild(checkbox);
        taskElement.appendChild(textSpan);
        taskElement.appendChild(deleteButton);

        tasksList.appendChild(taskElement);
    });
}

// Función para actualizar el contador de tareas
function updateTasksCount() {
    const activeTasks = tasks.filter(task => task.status === 'active').length;
    tasksCount.textContent = `Tareas totales: ${tasks.length} (${activeTasks} pendientes)`;
}

// Evento para agregar nueva tarea
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({
            text: taskText,
            status: 'active'
        });
        taskInput.value = '';
        saveTasks();
        renderTasks();
    }
});

// Evento para filtrar tareas
document.querySelector('.filters').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        // Remover clase active de todos los botones
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Agregar clase active al botón clickeado
        e.target.classList.add('active');
        // Renderizar tareas con el nuevo filtro
        renderTasks(e.target.dataset.filter);
    }
});

// Evento para borrar tareas completadas
clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => task.status !== 'completed');
    saveTasks();
    renderTasks();
});

// Evento para agregar tarea al presionar Enter
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTaskBtn.click();
    }
});

// Cargar tareas al inicio
loadTasks();
