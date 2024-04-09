import { useState } from 'react'

const Notification = ({ message }) => {
  /*
    Receive message object with properties of:
    type: "success/error"
    text: "notification message"
    */

  if (message === null) {
    return null
  }
  switch (message.type) {
  case 'success':
    return <div className="notification success">{message.text}</div>

  case 'error':
    return <div className="notification error">{message.text}</div>
  default:
    break
  }
}

export default Notification
