import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './notificationReducer';
import blogsReducer from './blogReducer';
import userReducer from './userReducer';
import usersReducer from './usersReducer';

const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    notification: notificationReducer,
    user: userReducer,
    users: usersReducer,
  },
});

export default store;
