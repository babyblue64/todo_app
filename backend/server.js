const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
const PORT = 5500;
const DATA_FILE = path.join(__dirname, 'todos.json');

app.use(express.json());
app.use(cors());

async function initializeDataFile() {
    try{
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify([])); //JSON Array
    }
}

async function readTodos() {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

async function writeTodos(todos) {
    await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2));
}

app.get('/todos', async (req, res) => {
    try {
        const todos = await readTodos();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read todos' });
    }
});

app.post('/todos', async (req, res) => {
    try {
        const todos = await readTodos();
        const newTodo = {
            id: Date.now().toString(),
            text: req.body.text,
            completed: false,
            createdAt: new Date().toISOString()
        }
        todos.push(newTodo);
        await writeTodos(todos);
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'failed to create todo' });
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const todos = await readTodos();
        const index = todos.findIndex(todo => todo.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'todo not found' });
        }
        todos[index] = { ...todos[index], ...req.body }
        await writeTodos(todos);
        res.json(todos[index]);
    } catch (error) {
        res.status(500).json({ error: 'failed to update todo' });
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        const todos = await readTodos();
        const filteredTodos = todos.filter(todo => todo.id !== req.params.id);
        await writeTodos(filteredTodos);
        res.status(201).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

(async () => {
    await initializeDataFile();
    app.listen(process.env.PORT || PORT, () => {
        console.log(`server running at port ${process.env.PORT || PORT}`);
    });
})();