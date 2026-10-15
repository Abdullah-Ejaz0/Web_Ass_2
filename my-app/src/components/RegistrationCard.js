import { Link } from 'react-router-dom';
import { formatEventDate } from './EventCard';

function RegistrationCard({ registration, completed, onCancel }) {
  return (
    <div className="event-card">
      {registration.image ? (
        <img src={registration.image} alt={registration.name} loading="lazy" />
      ) : (
        <div className="event-card-noimage">No image</div>
      )}

      <div className="event-card-body">
        <span className={completed ? 'event-tag' : 'event-tag status'}>
          {completed ? 'Completed' : 'Upcoming'}
        </span>
        <h3>{registration.name}</h3>
        <p>
          {formatEventDate({
            start: { localDate: registration.date, localTime: registration.time }
          })}
        </p>
        <p>
          {registration.venue || 'Venue to be announced'}
          {registration.city ? `, ${registration.city}` : ''}
        </p>
        <Link to={`/events/${registration.eventId}`} className="event-card-link">
          View Details
        </Link>
        {!completed && (
          <button className="secondary-btn" onClick={() => onCancel(registration.eventId)}>
            Cancel Registration
          </button>
        )}
      </div>
    </div>
  );
}

export default RegistrationCard;
