import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  eventsLoading,
  eventsLoaded,
  eventsFailed,
  categoriesLoaded
} from '../redux/store';
import {
  toApiDate,
  fetchEventsFromApi,
  fetchClassificationsFromApi
} from '../api/ticketmaster';
import EventCard from '../components/EventCard';
import EventFilters from '../components/EventFilters';

const PAGE_SIZE = 12;

const emptyFilters = {
  keyword: '',
  category: '',
  city: '',
  startDate: '',
  endDate: '',
  sort: 'date,asc'
};

function Events() {
  const dispatch = useDispatch();
  const { list, page, categories, loading, error } = useSelector(
    (state) => state.events
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const applied = {
    ...emptyFilters,
    ...Object.fromEntries(searchParams.entries())
  };
  const currentPage = Number(searchParams.get('page')) || 0;

  const [filters, setFilters] = useState(applied);

  useEffect(() => {
    fetchClassificationsFromApi()
      .then((data) => {
        const classifications = data._embedded?.classifications || [];
        const segments = classifications
          .map((item) => item.segment)
          .filter((segment) => segment && segment.name !== 'Undefined');
        dispatch(
          categoriesLoaded(
            segments.filter(
              (segment, index) =>
                segments.findIndex((s) => s.id === segment.id) === index
            )
          )
        );
      })
      .catch(() => {
      });
  }, [dispatch]);

  const queryString = searchParams.toString();

  useEffect(() => {
    const params = {
      ...emptyFilters,
      ...Object.fromEntries(new URLSearchParams(queryString).entries())
    };

    // Only show upcoming events: never start before right now
    const now = new Date();
    let start = now;
    if (params.startDate) {
      const chosen = new Date(`${params.startDate}T00:00:00`);
      if (chosen > now) start = chosen;
    }

    let ignore = false;
    dispatch(eventsLoading());

    fetchEventsFromApi({
      keyword: params.keyword.trim(),
      segmentId: params.category,
      city: params.city.trim(),
      startDateTime: toApiDate(start),
      endDateTime: params.endDate
        ? toApiDate(new Date(`${params.endDate}T23:59:59`))
        : '',
      sort: params.sort,
      size: PAGE_SIZE,
      page: Number(params.page) || 0
    })
      .then((data) => {
        if (ignore) return;
        dispatch(
          eventsLoaded({
            list: data._embedded?.events || [],
            page: data.page
          })
        );
      })
      .catch((error) => {
        if (ignore) return;
        dispatch(eventsFailed(error.message || 'Could not load events.'));
      });

    return () => {
      ignore = true;
    };
  }, [dispatch, queryString]);

  const updateUrl = (values, pageNumber) => {
    const next = {};
    Object.entries(values).forEach(([key, value]) => {
      if (value && value !== emptyFilters[key]) next[key] = value;
    });
    if (pageNumber > 0) next.page = pageNumber;
    setSearchParams(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      filters.startDate &&
      filters.endDate &&
      filters.endDate < filters.startDate
    ) {
      alert('The end date cannot be before the start date.');
      return;
    }

    updateUrl(filters, 0);
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    setSearchParams({});
  };

  const goToPage = (pageNumber) => {
    updateUrl(applied, pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // The API only allows paging up to the 1000th result
  const maxPage = Math.min(page.totalPages, Math.floor(1000 / PAGE_SIZE)) - 1;

  return (
    <div className="events-container">
      <h1>Explore Events</h1>
      <p>Search upcoming events or filter them by category, city and date.</p>

      <EventFilters
        filters={filters}
        categories={categories}
        onChange={setFilters}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />

      <div className="category-chips">
        <button
          className={!applied.category ? 'chip active' : 'chip'}
          onClick={() => updateUrl({ ...applied, category: '' }, 0)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={applied.category === category.id ? 'chip active' : 'chip'}
            onClick={() => {
              setFilters({ ...applied, category: category.id });
              updateUrl({ ...applied, category: category.id }, 0);
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {loading && <p className="status-message">Loading events...</p>}

      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}

      {!loading && !error && list.length === 0 && (
        <p className="status-message">
          No events found. Try changing your search or filters.
        </p>
      )}

      {!loading && list.length > 0 && (
        <>
          <p className="results-count">
            {page.totalElements} events found
          </p>
          <div className="events-grid">
            {list.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 0}
            >
              Previous
            </button>
            <span>
              Page {currentPage + 1} of {maxPage + 1}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= maxPage}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Events;
