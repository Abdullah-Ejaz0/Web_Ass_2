import { useState } from 'react';
import { loginUser } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

function Login() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [message, setMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const user = users.find((user) => user.email === cleanEmail && user.password === password);

    if (user) {
      localStorage.setItem('currentuser', JSON.stringify(user));
      dispatch(loginUser({ currentuser: user }));
      navigate(location.state?.from || '/events', { replace: true });
    } else {
      setMessage('Invalid email or password.');
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to register for events and manage your bookings."
      footer={<>New to EventHub? <Link to="/register">Create an account</Link></>}
    >
      <form onSubmit={handleLogin} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {message && (
          <p role="alert" className="error-message">
            {message}
          </p>
        )}

        <button type="submit" className="auth-submit">Login</button>
      </form>
    </AuthLayout>
  );
}

export default Login;
