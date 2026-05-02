const express = require('express');
const app = express();
const tasksData = require('./task.json');
app.use(express.json());
const validateTask = require('./utils/validateTask');

app.get('/', (req, res) => {
  res.send('Task Manager API is running');
});

//  GET /tasks: Retrieve all tasks.
app.get('/tasks', (req, res) => {
    const {completed} = req.query;
const { sort } = req.query; 

    let tasks = [...tasksData.tasks]; 

    // filtering
     if(completed !== undefined){
        if(completed != 'true' && completed != 'false'){
            return res.status(400).json({
                message : "complete mush be boolean"
            })
        }
    
     const isCompleted = completed === "true";
     tasks = tasks.filter(task=>task.completed === isCompleted);
    }
// sorting
      if (sort === 'asc' || sort === 'desc') {
    tasks.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);

      return sort === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  res.json(tasks);
});

// Implement GET /tasks/:id: Retrieve a specific task by its ID.
app.get('/tasks/:id', (req, res) => {
  res.json(tasksData);
});

// priority attribute to tasks
app.get('/tasks/priority/:level', (req, res) => {
  const { level } = req.params;

  const allowed = ['low', 'medium', 'high'];

  if (!allowed.includes(level)) {
    return res.status(400).json({
      message: 'Priority must be low, medium, or high'
    });
  }

  const filtered = tasksData.tasks.filter(
    task => task.priority === level
  );

  res.json(filtered);
});

// Implement POST /tasks: Create a new task with the required fields (title, description, completed).
app.post('/tasks', (req, res) => {

const error = validateTask(req.body);

if (error) {
  return res.status(400).json({ message: error });
}
const { title, description, completed , priority} = req.body;

delete req.body.id;
  delete req.body.createdAt;

 const allowed = ['low', 'medium', 'high'];
  if (priority && !allowed.includes(priority)) {
    return res.status(400).json({
      message: 'priority must be low, medium, or high'
    });
  }


   const newTask = {
    id: tasksData.tasks.length + 1,
    title,
    description,
    completed: completed ?? false,
    priority: priority ?? 'low',
    createdAt: new Date().toISOString() //for sorting
  };

   tasksData.tasks.push(newTask);

  res.status(201).json({
    message: 'Task created successfully',
    task: newTask
  });

})

// Implement PUT /tasks/:id: Update an existing task by its ID.
app.put('/tasks/:id', (req, res) => {
    const error = validateTask(req.body ,true);

if (error) {
  return res.status(400).json({ message: error });
}

    const  taskId = parseInt(req.params.id);
  const { title, description, completed } = req.body;

   const task = tasksData.tasks.find(t => t.id === taskId);
     
   if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  delete req.body.id;
  delete req.body.createdAt;

  Object.assign(task, req.body);

  task.updatedAt = new Date().toISOString();

  res.json({
    message: 'Task updated successfully',
    task
  });
});

//  Implement DELETE /tasks/:id: Delete a task by its ID.
app.delete('/tasks/:id', (req, res) => {
const error = validateTask(req.body);

if (error) {
  return res.status(400).json({ message: error });
}

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