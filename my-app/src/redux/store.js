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
        localStorage.setItem('currentuser', JSON.stringify(currentuser));
    },
    logoutUser: (state) => {
        state.currentuser = null;
        localStorage.removeItem('currentuser');
    }
  }
});

export const { registerUser, loginUser, logoutUser } = userSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer
  }
});

export default store;