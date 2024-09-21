const express = require('express');
const path = require('path'); // For serving static files
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

let tasks = []; // In-memory task store
let currentId = 1; // Task ID counter

// Simple endpoint for testing
app.get('/', (req, res) => {
    res.send('To-Do List API is running!');
});

// Create a task with validation
app.post('/tasks', (req, res) => {
    if (!req.body.title || req.body.title.trim() === "") {
        return res.status(400).send('Task title is required');
    }
    const task = {
        id: currentId++,
        title: req.body.title,
        completed: false
    };
    tasks.push(task);
    res.status(201).json(task);
});

// Get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Complete/Uncomplete a task
app.patch('/tasks/:id/complete', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed; // Toggle completion status
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

// Update a task with validation
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        if (!req.body.title || req.body.title.trim() === "") {
            return res.status(400).send('Task title is required');
        }
        task.title = req.body.title || task.title;
        task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    tasks = tasks.filter(t => t.id !== taskId);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
