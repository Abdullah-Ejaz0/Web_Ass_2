import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar';
import GuestRoute from './components/GuestRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import MyEvents from './pages/MyEvents';

function App() {
  const registrations = useSelector((state) => state.registrations.list);

  // Keep the registrations saved so they survive a page refresh
  useEffect(() => {
    localStorage.setItem('registrations', JSON.stringify(registrations));
  }, [registrations]);

  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Events />} />
        <Route path='/login' element={<GuestRoute><Login /></GuestRoute>} />
        <Route path='/register' element={<GuestRoute><Register /></GuestRoute>} />
        <Route path='/events' element={<Events />} />
        <Route path='/events/:id' element={<EventDetails />} />
        <Route path='/my-events' element={<MyEvents />} />
      </Routes>
  </BrowserRouter>
  );
}

export default App;
