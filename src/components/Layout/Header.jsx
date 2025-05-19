import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <h1 onClick={() => navigate('/tasks')}>Organizador de Tarefas</h1>
      <div className="user-section">
        {user && (
          <>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;