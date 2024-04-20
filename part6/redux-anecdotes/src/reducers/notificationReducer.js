import { createSlice } from "@reduxjs/toolkit";

const notificationSllice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        clearNotification(state, action) {
            return ''
        }
    }
})

export const notify = (message, delay) => {
    return dispatch => {
        dispatch(setNotification(message))
        setTimeout(() => dispatch(clearNotification()), delay)
    }
}

export const { setNotification, clearNotification } = notificationSllice.actions
export default notificationSllice.reducer