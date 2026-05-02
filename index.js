const express = require('express');
const app = express();
const tasksData = require('./task.json');
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Task Manager API is running');
});

//  GET /tasks: Retrieve all tasks.
app.get('/tasks', (req, res) => {
  res.json(tasksData);
});

// Implement GET /tasks/:id: Retrieve a specific task by its ID.
app.get('/tasks/:id', (req, res) => {
  res.json(tasksData);
});

// Implement POST /tasks: Create a new task with the required fields (title, description, completed).
app.post('/tasks', (req, res) => {
  const { title, description, completed } = req.body;

   const newTask = {
    id: tasksData.tasks.length + 1,
    title,
    description,
    completed: completed ?? false
  };

   tasksData.tasks.push(newTask);

  res.status(201).json({
    message: 'Task created successfully',
    task: newTask
  });

})

// Implement PUT /tasks/:id: Update an existing task by its ID.
app.put('/tasks/:id', (req, res) => {
    const  taskId = parseInt(req.params.id);
  const { title, description, completed } = req.body;

   const task = tasksData.tasks.find(t => t.id === taskId);
     
   if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
 if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (completed !== undefined) task.completed = completed;

  res.json({
    message: 'Task updated successfully',
    task
  });
});

//  Implement DELETE /tasks/:id: Delete a task by its ID.
app.delete('/tasks/:id', (req, res) => {
    const  taskId = parseInt(req.params.id);


   const index = tasksData.tasks.findIndex(t => t.id === taskId);

  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
 
    const deletedTask = tasksData.tasks.splice(index, 1);
  res.json({
    message: 'Task deleted successfully',
    task : deletedTask[0]
  });
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});