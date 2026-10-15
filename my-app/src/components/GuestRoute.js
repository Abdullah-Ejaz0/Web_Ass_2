import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Login and register are only for logged out users
function GuestRoute({ children }) {
  const { currentuser } = useSelector((state) => state.user);
  return currentuser ? <Navigate to="/events" replace /> : children;
}

export default GuestRoute;
