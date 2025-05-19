import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTasks, deleteTask } from '../../services/tasks.service';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import toast from 'react-hot-toast';

const TaskList = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await getTasks(token);
        setTasks(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTasks();
    }
  }, [token]);

const handleDelete = async (taskId) => {
  try {
    await deleteTask(number(taskId), token);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast.success('Task deleted successfully');
  } catch (error) {
    toast.error(error.message);
    const data = await getTasks(token);
    setTasks(data);
  }
};

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null);
  };

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="task-container">
      <h2>Minhas Tarefas</h2>
      
      <TaskForm 
        onTaskCreated={handleTaskCreated} 
        editingTask={editingTask} 
        onTaskUpdated={handleTaskUpdated} 
      />
      
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found. Create your first task!</p>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onDelete={handleDelete} 
              onEdit={() => setEditingTask(task)} 
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;