import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createTask, updateTask } from '../../services/tasks.service';
import toast from 'react-hot-toast';

const TaskForm = ({ onTaskCreated, editingTask, onTaskUpdated }) => {
  const { token } = useAuth();
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || '');
  const [completed, setCompleted] = useState(editingTask?.completed || false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    const taskData = { 
      title, 
      description,
      dueDate: dueDate || null,
      completed 
    };

    try {
      setLoading(true);
      if (editingTask) {
        const updatedTask = await updateTask(editingTask.id, taskData, token);
        onTaskUpdated(updatedTask);
        toast.success('Task updated successfully');
      } else {
        const newTask = await createTask(taskData, token);
        onTaskCreated(newTask);
        toast.success('Task created successfully');
      }

      if (!editingTask) {
        setTitle('');
        setDescription('');
        setDueDate('');
        setCompleted(false);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3>{editingTask ? 'Edit Task' : 'Adcionar nova tarefa'}</h3>
      <div className="form-group">
        <label>Título*</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Prazo</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      {editingTask && (
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            Completa
          </label>
        </div>
      )}
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : editingTask ? 'Update Task' : 'Add Task'}
      </button>
      {editingTask && (
        <button 
          type="button" 
          onClick={() => {
            setTitle('');
            setDescription('');
            setDueDate('');
            setCompleted(false);
            onTaskUpdated(null);
          }}
          className="cancel-button"
        >
          Cancelar
        </button>
      )}
    </form>
  );
};

export default TaskForm;