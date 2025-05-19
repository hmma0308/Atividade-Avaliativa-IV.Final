import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Layout/PrivateRoute';
import Header from './components/Layout/Header';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TaskList from './components/Tasks/TaskList';
import './styles/main.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/tasks" element={<TaskList />} />
            </Route>
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;