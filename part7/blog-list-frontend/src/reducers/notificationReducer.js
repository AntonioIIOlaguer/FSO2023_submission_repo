import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  /*
    Takes in thiss kind of obect
    {message: string, type: string}
  */
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    clearNotification(state, action) {
      return '';
    },
  },
});

export const notify = (message, delay) => {
  // message is {text: String, type: string}
  return (dispatch) => {
    dispatch(setNotification(message));
    setTimeout(() => dispatch(clearNotification()), delay);
  };
};

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
