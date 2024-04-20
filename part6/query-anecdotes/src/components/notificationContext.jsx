import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
    switch (action.type) {
        case "notify":
            return action.text
        case "clearNotification":
            return ''
        default:
            return state
    }
}

const notifcationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, '')

    return (
        <notifcationContext.Provider value={[notification, notificationDispatch]}>
            {props.children}
        </notifcationContext.Provider>
    )
}

export const useNotificationValue = () => {
    const notificationAndDispatch = useContext(notifcationContext)
    return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
    const notificationAndDispatch = useContext(notifcationContext)
    return notificationAndDispatch[1]
}


export default notifcationContext 