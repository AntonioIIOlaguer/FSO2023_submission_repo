import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../reducers/userReducer';
import { notify } from '../reducers/notificationReducer';

const LoginForm = ({ setShowLogin }) => {
  const dispatch = useDispatch();
  const [newInput, setNewInput] = useState({ username: '', password: '' });
  const handleInputChange = (event) => {
    const value = event.target.value;
    setNewInput({
      ...newInput,
      [event.target.name]: value,
    });
  };
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const credentials = {
        username: newInput.username,
        password: newInput.password,
      };
      dispatch(loginUser(credentials));
      setNewInput({ username: '', password: '' });
      setShowLogin(false);
      dispatch(
        notify({ type: 'success', text: 'Succesffuly Logged In' }, 5000),
      );
    } catch (error) {
      setNewInput({ username: '', password: '' });
      dispatch(
        notify({ type: 'error', text: 'Wrong username or Password' }, 5000),
      );
    }
  };

  return (
    <div
      className="fixed grid place-items-center left-0 top-0 h-screen w-screen
      overflow-auto bg-gray-50 y-85"
    >
      <div
        className="container grid place-items-center bg-gray-600
        rounded-md shadow-2xl w-auto h-auto py-14 px-6
        "
      >
        <form onSubmit={handleLogin} className="max-w-sm mx-auto">
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Username
            </label>
            <input
              type="text"
              value={newInput.username}
              name="username"
              onChange={handleInputChange}
              data-testid="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
              focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="username"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your password
            </label>

            <input
              type="password"
              value={newInput.password}
              name="password"
              onChange={handleInputChange}
              data-testid="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
              focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="password"
            />
          </div>
          <button
            type="submit"
            className="text-white bg-green-700 hover:bg-green-800
            font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center sm:w-auto mx-1"
          >
            login
          </button>
          <button
            type="cancel"
            className="text-white bg-gray-700 hover:bg-gray-800
            font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center sm:w-auto"
            onClick={() => setShowLogin(false)}
          >
            cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
