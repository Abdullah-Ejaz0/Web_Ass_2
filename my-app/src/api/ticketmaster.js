const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const API_KEY = process.env.REACT_APP_TM_API_KEY;

export const toApiDate = (date) => date.toISOString().replace(/\.\d{3}Z$/, 'Z');

async function request(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error('Missing API key. Add REACT_APP_TM_API_KEY to your .env file.');
  }

  const query = new URLSearchParams({ apikey: API_KEY });

  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== undefined && value !== null) {
      query.append(key, value);
    }
  });

  const response = await fetch(`${BASE_URL}/${endpoint}?${query.toString()}`);

  if (response.status === 429) {
    throw new Error('Too many requests. Please wait a moment and try again.');
  }
  if (!response.ok) {
    throw new Error(`Ticketmaster request failed (${response.status}).`);
  }

  return response.json();
}

export const fetchEventsFromApi = (params) => request('events.json', params);

export const fetchEventByIdFromApi = (id) =>
  request(`events/${encodeURIComponent(id)}.json`);

export const fetchClassificationsFromApi = () =>
  request('classifications.json', { size: 50 });
