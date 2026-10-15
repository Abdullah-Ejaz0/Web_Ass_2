import { createSlice, configureStore } from '@reduxjs/toolkit';
const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: JSON.parse(localStorage.getItem('users') || '[]'),
    currentuser: JSON.parse(localStorage.getItem('currentuser') || 'null')
  },
  reducers: {
    registerUser: (state, action) => {
        state.users.push(action.payload.user);
    },
    loginUser: (state, action) => {
        const { currentuser } = action.payload;
        state.currentuser = currentuser;
    },
    logoutUser: (state) => {
        state.currentuser = null;
    }
  }
});

export const { registerUser, loginUser, logoutUser } = userSlice.actions;

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    list: [],
    page: { number: 0, totalPages: 0, totalElements: 0 },
    categories: [],
    selectedEvent: null,
    loading: false,
    detailsLoading: false,
    error: null,
    detailsError: null
  },
  reducers: {
    eventsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    eventsLoaded: (state, action) => {
      state.loading = false;
      state.list = action.payload.list;
      state.page = action.payload.page;
    },
    eventsFailed: (state, action) => {
      state.loading = false;
      state.list = [];
      state.error = action.payload;
    },
    categoriesLoaded: (state, action) => {
      state.categories = action.payload;
    },
    eventDetailsLoading: (state) => {
      state.detailsLoading = true;
      state.detailsError = null;
      state.selectedEvent = null;
    },
    eventDetailsLoaded: (state, action) => {
      state.detailsLoading = false;
      state.selectedEvent = action.payload;
    },
    eventDetailsFailed: (state, action) => {
      state.detailsLoading = false;
      state.detailsError = action.payload;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
      state.detailsError = null;
    }
  }
});

export const {
  eventsLoading,
  eventsLoaded,
  eventsFailed,
  categoriesLoaded,
  eventDetailsLoading,
  eventDetailsLoaded,
  eventDetailsFailed,
  clearSelectedEvent
} = eventsSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    events: eventsSlice.reducer
  }
});

export default store;