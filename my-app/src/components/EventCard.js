import { Link } from 'react-router-dom';

export const formatEventDate = (dates) => {
  const start = dates?.start;
  if (!start) return 'Date to be announced';
  if (!start.localDate) return 'Date to be announced';

  const date = new Date(`${start.localDate}T${start.localTime || '00:00:00'}`);
  const day = date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  if (!start.localTime) return day;
  const time = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${day} at ${time}`;
};

// Picks a medium sized 16:9 image if there is one
export const getEventImage = (images = []) => {
  const image =
    images.find((img) => img.ratio === '16_9' && img.width >= 500) ||
    images[0];
  return image ? image.url : '';
};

function EventCard({ event }) {
  const venue = event._embedded?.venues?.[0];
  const classification = event.classifications?.[0];
  const image = getEventImage(event.images);

  return (
    <div className="event-card">
      {image ? (
        <img src={image} alt={event.name} loading="lazy" />
      ) : (
        <div className="event-card-noimage">No image</div>
      )}

      <div className="event-card-body">
        {classification?.segment?.name && (
          <span className="event-tag">{classification.segment.name}</span>
        )}
        <h3>{event.name}</h3>
        <p>{formatEventDate(event.dates)}</p>
        <p>
          {venue?.name || 'Venue to be announced'}
          {venue?.city?.name ? `, ${venue.city.name}` : ''}
        </p>
        <Link to={`/events/${event.id}`} className="event-card-link">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
