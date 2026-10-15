import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/store';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentuser } = useSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.removeItem('currentuser');
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/events" className="navbar-brand">
        EventHub
      </Link>

      <div className="navbar-links">
        <Link to="/events">Events</Link>
        {currentuser ? (
          <>
            <Link to="/my-events">My Events</Link>
            <span>Hi, {currentuser.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
