import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector((state) => state.notification);
  const style = {
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    border: 'solid',
  };

  return notification ? (
    <div style={style} className={notification.type}>
      {notification.text}
    </div>
  ) : (
    <div></div>
  );
};

export default Notification;
