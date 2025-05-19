import { API_BASE_URL } from '../config';

const fetchWithAuth = async (url, options = {}, token) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Request failed');
  }

  return response.json();
};

export const getTasks = async (token) => {
  return fetchWithAuth(`${API_BASE_URL}/tasks/`, {}, token);
};

export const createTask = async (taskData, token) => {
  return fetchWithAuth(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    body: JSON.stringify({
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate || null,
      completed: taskData.completed || false
    }),
  }, token);
};

export const getTaskById = async (id, token) => {
  return fetchWithAuth(`${API_BASE_URL}/tasks/task.id`, {}, token);
};

export const updateTask = async (id, taskData, token) => {
  return fetchWithAuth(`${API_BASE_URL}/tasks/task.id`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  }, token);
};

export const deleteTask = async (taskId, token) => {
  const numericId = taskId;
  return fetchWithAuth(`${API_BASE_URL}/tasks/${numericId}`, {
    method: 'DELETE',
  }, token);
};