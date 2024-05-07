import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../reducers/userReducer';
import { notify } from '../reducers/notificationReducer';

const Navigation = ({ setShowLogin }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const handleLogout = async (event) => {
    dispatch(logoutUser());
    dispatch(notify({ type: 'success', text: 'User Logged out' }, 5000));
  };

  return (
    <div
      className="fixed items-center gap-2 top-0 left-0 px-16 w-screen h-16 flex
      flex-row bg-gray-800 shadow-lg *:
      font-mono"
    >
      <h1 className="text-slate-100 font-mono font-bold text-2xl">Blog App</h1>
      <div className="ml-auto gap-2 flex">
        <Link className="navbar-icon" to={'/users'}>
          Users
        </Link>
        <Link className="navbar-icon" to={'/blogs'}>
          blogs
        </Link>
        {user ? (
          <>
            <span className="h-auto flex items-center text-white text-xs">
              {user.name} logged in{' '}
            </span>

            <button
              onClick={handleLogout}
              className="text-white bg-gray-700 hover:bg-gray-800
                        font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center sm:w-auto !m-0"
            >
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => setShowLogin(true)} className="navbar-icon">
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navigation;
