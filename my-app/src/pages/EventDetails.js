import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  eventDetailsLoading,
  eventDetailsLoaded,
  eventDetailsFailed,
  clearSelectedEvent,
  registerForEvent,
  cancelRegistration
} from '../redux/store';
import { fetchEventByIdFromApi } from '../api/ticketmaster';
import { formatEventDate, getEventImage } from '../components/EventCard';

function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedEvent: event, detailsLoading, detailsError } = useSelector(
    (state) => state.events
  );

  const { currentuser } = useSelector((state) => state.user);
  const registrations = useSelector((state) => state.registrations.list);
  const [message, setMessage] = useState('');

  // Registrations belong to the logged in user, so check by email and event id
  const isRegistered = registrations.some(
    (item) => item.userEmail === currentuser?.email && item.eventId === id
  );

  const handleRegister = () => {
    // Block duplicates even if the button is clicked twice quickly
    if (isRegistered) {
      setMessage('You are already registered for this event.');
      return;
    }

    dispatch(
      registerForEvent({
        userEmail: currentuser.email,
        eventId: event.id,
        name: event.name,
        date: event.dates?.start?.localDate || '',
        time: event.dates?.start?.localTime || '',
        venue: event._embedded?.venues?.[0]?.name || '',
        city: event._embedded?.venues?.[0]?.city?.name || '',
        image: getEventImage(event.images)
      })
    );
    setMessage('You are registered for this event!');
  };

  const handleCancel = () => {
    dispatch(cancelRegistration({ userEmail: currentuser.email, eventId: id }));
    setMessage('Your registration has been cancelled.');
  };

  useEffect(() => {
    let ignore = false;
    dispatch(eventDetailsLoading());

    fetchEventByIdFromApi(id)
      .then((data) => {
        if (!ignore) dispatch(eventDetailsLoaded(data));
      })
      .catch((error) => {
        if (!ignore) {
          dispatch(eventDetailsFailed(error.message || 'Could not load this event.'));
        }
      });

    return () => {
      ignore = true;
      dispatch(clearSelectedEvent());
    };
  }, [dispatch, id]);

  if (detailsLoading) {
    return <p className="status-message">Loading event...</p>;
  }

  if (detailsError) {
    return (
      <div className="event-details">
        <p role="alert" className="error-message">
          {detailsError}
        </p>
        <Link to="/events">Back to events</Link>
      </div>
    );
  }

  if (!event) return null;

  const venue = event._embedded?.venues?.[0];
  const attractions = event._embedded?.attractions || [];
  const classification = event.classifications?.[0];
  const image = getEventImage(event.images);
  const priceRange = event.priceRanges?.[0];
  const status = event.dates?.status?.code;

  const categories = [
    classification?.segment?.name,
    classification?.genre?.name,
    classification?.subGenre?.name
  ].filter((name) => name && name !== 'Undefined');

  const address = [
    venue?.address?.line1,
    venue?.city?.name,
    venue?.state?.stateCode,
    venue?.country?.name
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="event-details">
      <Link to="/events">&larr; Back to events</Link>

      {image && <img className="event-details-image" src={image} alt={event.name} />}

      <h1>{event.name}</h1>
      <div className="event-details-tags">
        {categories.map((name) => (
          <span key={name} className="event-tag">
            {name}
          </span>
        ))}
        {status && <span className="event-tag status">{status}</span>}
      </div>

      <div className="event-details-info">
        <p>
          <strong>Date &amp; time:</strong> {formatEventDate(event.dates)}
        </p>
        <p>
          <strong>Venue:</strong> {venue?.name || 'To be announced'}
        </p>
        <p>
          <strong>Location:</strong> {address || 'To be announced'}
        </p>
        {attractions.length > 0 && (
          <p>
            <strong>Performers:</strong>{' '}
            {attractions.map((a) => a.name).join(', ')}
          </p>
        )}
        {priceRange && (
          <p>
            <strong>Price:</strong> {priceRange.min} - {priceRange.max}{' '}
            {priceRange.currency}
          </p>
        )}
        {event.ageRestrictions?.legalAgeEnforced && (
          <p>
            <strong>Age restriction:</strong> Legal age enforced
          </p>
        )}
      </div>

      {(event.info || event.pleaseNote) && (
        <div className="event-details-text">
          <h2>Good to know</h2>
          {event.info && <p>{event.info}</p>}
          {event.pleaseNote && <p>{event.pleaseNote}</p>}
        </div>
      )}

      <div className="registration-box">
        {currentuser ? (
          isRegistered ? (
            <button className="secondary-btn" onClick={handleCancel}>
              Cancel Registration
            </button>
          ) : (
            <button onClick={handleRegister}>Register for this Event</button>
          )
        ) : (
          <p>
            <Link to="/login">Log in</Link> to register for this event.
          </p>
        )}
        {message && <p role="status" className="registration-message">{message}</p>}
      </div>

      {event.url && (
        <a href={event.url} target="_blank" rel="noreferrer" className="event-card-link">
          Buy tickets on Ticketmaster
        </a>
      )}
    </div>
  );
}

export default EventDetails;
