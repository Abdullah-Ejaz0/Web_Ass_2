import { useState } from 'react';
import { loginUser } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Login() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
      dispatch(loginUser({ currentuser: user }));
      setMessage('Login successful!');
      setSuccess(true);
      //navigate('/dashboard');
    } else {
      setMessage('Invalid email or password');
      setSuccess(false);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>

      {message && (
        <p style={{ color: success ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </form>
  );
}

export default Login;