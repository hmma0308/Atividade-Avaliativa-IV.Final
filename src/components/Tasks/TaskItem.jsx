import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateTask } from '../../services/tasks.service';
import toast from 'react-hot-toast';

const TaskItem = ({ task, onDelete, onEdit }) => {
  const { token } = useAuth();
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const [isUpdating, setIsUpdating] = useState(false);

const toggleCompleted = async () => {
  try {
    setIsUpdating(true);
    const taskId = Number(task.id);
    const updatedTask = await updateTask(taskId, { 
      completed: !isCompleted 
    }, token);
    setIsCompleted(updatedTask.completed);
    toast.success('Task updated');
  } catch (error) {
    toast.error(error.message);
    setIsCompleted(task.completed);
  } finally {
    setIsUpdating(false);
  }
};

  const formatDate = (dateString) => {
    if (!dateString) return 'Sem prazo';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <li className={`task-item ${isCompleted ? 'completed' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <h4>{task.title}</h4>
          <label className="completed-toggle">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={toggleCompleted}
              disabled={isUpdating}
            />
            <span>{isCompleted ? ' Completa' : ' Marcar completa'}</span>
          </label>
        </div>
        {task.description && <p>{task.description}</p>}
        <div className="task-meta">
          <span className="due-date">
            Prazo: {formatDate(task.dueDate)}
          </span>
          <span className={`status ${isCompleted ? 'completa' : 'pendente'}`}>
            {isCompleted ? ' ✓  Completa' : '⏳ Pendente'}
          </span>
        </div>
      </div>
      <div className="task-actions">
        <button onClick={() => onEdit(task)} className="edit-button">
          Editar
        </button>
        <button onClick={() => onDelete(task.id)} className="delete-button">
          Deletar
        </button>
      </div>
    </li>
  );
};

export default TaskItem;