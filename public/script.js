document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const taskTitle = document.getElementById('task-title').value;
    
    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: taskTitle })
    })
    .then(response => response.json())
    .then(task => {
        addTaskToList(task);
        document.getElementById('task-title').value = '';
    });
});

function addTaskToList(task) {
    const taskList = document.getElementById('task-list');
    const listItem = document.createElement('li');

    // Create checkbox for task completion
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', function() {
        updateTask(task.id, checkbox.checked);
    });

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        deleteTask(task.id);
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(document.createTextNode(task.title));
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
}

function updateTask(taskId, completed) {
    fetch(`/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: completed })
    });
}

function deleteTask(taskId) {
    fetch(`/tasks/${taskId}`, {
        method: 'DELETE'
    }).then(() => {
        // Refresh the task list
        document.getElementById('task-list').innerHTML = '';
        loadTasks();
    });
}

// Load existing tasks when the page loads
function loadTasks() {
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => {
                addTaskToList(task);
            });
        });
}

window.onload = loadTasks;
