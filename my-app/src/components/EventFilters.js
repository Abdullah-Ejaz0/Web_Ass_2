function EventFilters({ filters, categories, onChange, onSubmit, onReset }) {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <form className="event-filters" onSubmit={onSubmit}>
      <div>
        <label htmlFor="keyword">Search</label>
        <input
          id="keyword"
          name="keyword"
          type="text"
          placeholder="Event, artist or team"
          value={filters.keyword}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="city">City</label>
        <input
          id="city"
          name="city"
          type="text"
          placeholder="e.g. Chicago"
          value={filters.city}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="startDate">From</label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          value={filters.startDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="endDate">To</label>
        <input
          id="endDate"
          name="endDate"
          type="date"
          min={filters.startDate}
          value={filters.endDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="sort">Sort by</label>
        <select
          id="sort"
          name="sort"
          value={filters.sort}
          onChange={handleChange}
        >
          <option value="date,asc">Soonest first</option>
          <option value="date,desc">Latest first</option>
          <option value="name,asc">Name (A-Z)</option>
          <option value="relevance,desc">Most relevant</option>
        </select>
      </div>

      <div className="event-filters-buttons">
        <button type="submit">Search</button>
        <button type="button" className="secondary-btn" onClick={onReset}>
          Reset
        </button>
      </div>
    </form>
  );
}

export default EventFilters;
