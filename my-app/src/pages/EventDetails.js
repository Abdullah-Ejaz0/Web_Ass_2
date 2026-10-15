import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  eventDetailsLoading,
  eventDetailsLoaded,
  eventDetailsFailed,
  clearSelectedEvent
} from '../redux/store';
import { fetchEventByIdFromApi } from '../api/ticketmaster';
import { formatEventDate, getEventImage } from '../components/EventCard';

function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedEvent: event, detailsLoading, detailsError } = useSelector(
    (state) => state.events
  );

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

      {event.url && (
        <a href={event.url} target="_blank" rel="noreferrer" className="event-card-link">
          Buy tickets on Ticketmaster
        </a>
      )}
    </div>
  );
}

export default EventDetails;
