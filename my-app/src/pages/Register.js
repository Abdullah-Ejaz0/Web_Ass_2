import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/store';
import { useNavigate } from 'react-router-dom';

function Register() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage('');

    // 1. Sanitize name and email
    const cleanName = name.trim().replace(/\s+/g, ' ');
    const cleanEmail = email.trim().toLowerCase();

    // 2. Validate name
    const nameRegex =
      /^[\p{L}\p{M}]+(?:[ '\u2019.-][\p{L}\p{M}]+)*\.?$/u;

    if (cleanName.length < 2 || cleanName.length > 60) {
      setMessage('Name must be between 2 and 60 characters.');
      return;
    }

    if (!nameRegex.test(cleanName)) {
      setMessage('Name contains invalid characters.');
      return;
    }

    // 3. Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (cleanEmail.length > 254 || !emailRegex.test(cleanEmail)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    // 4. Validate password
    // At least 8 characters, uppercase, lowercase,
    // number and special character.
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s<>])\S{8,128}$/;

    if (!passwordRegex.test(password)) {
      setMessage(
        'Password must be 8–128 characters and include uppercase, lowercase, a number and a special character. No spaces are allowed.'
      );
      return;
    }

    // 5. Confirm password
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    // 6. Check for an existing account
    const userExists = users.some(
      (user) => user.email.trim().toLowerCase() === cleanEmail
    );

    if (userExists) {
      setMessage('An account with this email already exists.');
      return;
    }

    // 7. Create and register the user
    const newUser = {
      name: cleanName,
      email: cleanEmail,
      password
    };

    dispatch(registerUser({ user: newUser }));
    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    navigate('/login');
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Register to discover and manage events."
      footer={<>Already have an account? <Link to="/login">Login</Link></>}
    >
      <form onSubmit={handleRegister} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>

        {message && (
          <p role="alert" className="error-message">
            {message}
          </p>
        )}

        <button type="submit" className="auth-submit">Create Account</button>
      </form>
    </AuthLayout>
  );
}

export default Register;