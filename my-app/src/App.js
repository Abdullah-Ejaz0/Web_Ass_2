import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/Navbar';
import GuestRoute from './components/GuestRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';

function App() {
  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Navigate to='/events' replace />} />
        <Route path='/login' element={<GuestRoute><Login /></GuestRoute>} />
        <Route path='/register' element={<GuestRoute><Register /></GuestRoute>} />
        <Route path='/events' element={<Events />} />
        <Route path='/events/:id' element={<EventDetails />} />
        <Route path='*' element={<Navigate to='/events' replace />} />
      </Routes>
  </BrowserRouter>
  );
}

export default App;
