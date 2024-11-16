import React, { useState, useEffect } from 'react';

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editingText, setEditingText] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5500/todos')
            .then(response => response.json())
            .then(todosArray => setTodos(todosArray))
            .catch(error => console.error('error fetching data', error));
    }, []); 

    const addTask = () => {
        fetch('http://localhost:5500/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: newTodo })
        })
            .then(response => response.json())
            .then(newTodoFull => {setTodos([...todos, newTodoFull]); setNewTodo('');})
            .catch(error => console.error('Failed to fetch resource', error));
    }

    const deleteTask = (id) => {
        fetch(`http://localhost:5500/todos/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not OK');
                }
                setTodos([...todos.filter(todo => todo.id !== id)]);
                console.log('deleted!');
            })
            .catch(error => console.error('Error: ', error));
    }

    const updateTask = (id) => {
        fetch(`http://localhost:5500/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: editingText })
        })
            .then(response => response.json())
            .then(updatedTodo => setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo)))
            .catch(error => console.error('Error: ', error));
    }

    const enterEditMode = (id, text) => {
        setEditingId(id);
        setEditingText(text);
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='mb-4 font-serif text-4xl'>ToDo App</h1>
            <div>
                <input 
                type="text" 
                value={newTodo}
                onChange={e => setNewTodo(e.target.value)}
                className="border border-gray-800 w-[25rem] px-2 py-2 mb-2 focus:outline-none focus:ring-2"
                placeholder='Add task here'
                />
                <button className='border bg-gray-800 text-white px-4 py-1 ml-2 h-[2.7rem] hover:bg-gray-500 hover:text-black'
                    onClick={addTask}
                >Add</button>
            </div>
            <div>
                <ul className='overflow-y-auto max-h-[10rem]'>
                    {
                        todos.map(todoItem => 
                        <li key={todoItem.id} 
                        className='flex items-center border border-gray-800 w-[29.3rem] px-2 mt-2'
                        >
                            {editingId === todoItem.id ? (<>
                                <span className='mr-auto'>
                                    <input type="text" 
                                    className='border border-gray-800 w-[17rem] focus:outline-none focus:ring-2'
                                    value={editingText}
                                    onChange={e => setEditingText(e.target.value)}
                                    />
                                </span>    
                                <button className='border bg-gray-800 text-white px-2 py-1 ml-2 h-[2.7rem] hover:bg-gray-500 hover:text-black'
                                onClick={() => {updateTask(todoItem.id); setEditingId(null);}}
                                >Save</button>
                                <button className='border bg-gray-800 text-white px-4 py-1 ml-2 h-[2.7rem] hover:bg-gray-500 hover:text-black'
                                onClick={() => setEditingId(null)}
                                >Cancel</button>
                            </>) : (<>
                                <span className='mr-auto'>{todoItem.text}</span>    
                                <button className='border bg-gray-800 text-white px-2 py-1 ml-2 h-[2.7rem] hover:bg-gray-500 hover:text-black'
                                onClick={() => deleteTask(todoItem.id)}
                                >Delete</button>
                                <button className='border bg-gray-800 text-white px-4 py-1 ml-2 h-[2.7rem] hover:bg-gray-500 hover:text-black'
                                onClick={() => enterEditMode(todoItem.id, todoItem.text)}
                                >Edit</button>
                            </>)}
                        </li>
                        )
                    }
                </ul>
            </div>
        </div>
    )
}

export default App;