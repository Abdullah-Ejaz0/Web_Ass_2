import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cancelRegistration } from '../redux/store';
import RegistrationCard from '../components/RegistrationCard';


const isCompleted = (registration) => {
  if (!registration.date) return false;
  const start = new Date(`${registration.date}T${registration.time || '23:59:59'}`);
  return start < new Date();
};

function MyEvents() {
  const dispatch = useDispatch();
  const { currentuser } = useSelector((state) => state.user);
  const registrations = useSelector((state) => state.registrations.list);
  const [message, setMessage] = useState('');

  const mine = registrations.filter((item) => item.userEmail === currentuser.email);
  const upcoming = mine.filter((item) => !isCompleted(item));
  const completed = mine.filter((item) => isCompleted(item));

  const handleCancel = (eventId) => {
    dispatch(cancelRegistration({ userEmail: currentuser.email, eventId }));
    setMessage('Your registration has been cancelled.');
  };

  return (
    <div className="events-container">
      <h1>My Events</h1>
      <p>Events you have registered for.</p>

      {message && <p role="status" className="registration-message">{message}</p>}

      {mine.length === 0 && (
        <p className="status-message">
          You have not registered for any events yet.{' '}
          <Link to="/events">Browse events</Link>
        </p>
      )}

      {upcoming.length > 0 && (
        <>
          <h2>Upcoming ({upcoming.length})</h2>
          <div className="events-grid">
            {upcoming.map((item) => (
              <RegistrationCard
                key={item.eventId}
                registration={item}
                completed={false}
                onCancel={handleCancel}
              />
            ))}
          </div>
        </>
      )}

      {completed.length > 0 && (
        <>
          <h2>Completed ({completed.length})</h2>
          <div className="events-grid">
            {completed.map((item) => (
              <RegistrationCard
                key={item.eventId}
                registration={item}
                completed={true}
                onCancel={handleCancel}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MyEvents;
