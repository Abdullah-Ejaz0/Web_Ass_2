import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
  const { currentuser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentuser) {
      navigate('/login', { replace: true, state: { from: location.pathname } });
    }
  }, [currentuser, navigate, location.pathname]);

  return currentuser ? children : null;
}

export default ProtectedRoute;
