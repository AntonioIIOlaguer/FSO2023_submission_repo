import { createSlice } from '@reduxjs/toolkit';
import usersService from '../services/users';

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload;
    },
    updateUser(state, action) {
      return state.map((user) =>
        user.id !== action.payload.id ? user : action.payload,
      );
    },
  },
});

// ---- Redux Thunks --- //

export const initializeUsers = () => {
  return async (dispatch) => {
    const returnedUsers = await usersService.getUsers();
    dispatch(setUsers(returnedUsers));
  };
};

export const { setUsers, updateUser } = usersSlice.actions;
export default usersSlice.reducer;
