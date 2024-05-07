import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';
import blogsService from '../services/blogs';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },

    removeUser(state, action) {
      return null;
    },
  },
});

// ---- Redux Thunks --- //

export const loginUser = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials);
    window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
    blogsService.setToken(user.token);
    dispatch(setUser(user));
  };
};

export const checkCachedUser = () => {
  //checks if client has token
  return async (dispatch) => {
    const loggedUserJson = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson);
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogsService.setToken(user.token);
      dispatch(setUser(user));
    } else {
      dispatch(removeUser());
    }
  };
};

export const logoutUser = (credentials) => {
  return async (dispatch) => {
    window.localStorage.clear();
    blogsService.setToken('');
    dispatch(removeUser());
  };
};

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
