import { useEffect, useRef, useState } from 'react';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import Users from './components/Users';
import User from './components/User';
import Blogs from './components/Blogs';
import Blog from './components/Blog';
import Navigation from './components/Navigation';
import LoginForm from './components/LoginForm';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { checkCachedUser } from './reducers/userReducer';
import { Routes, Route } from 'react-router-dom';
import { initilizeblogs } from './reducers/blogReducer';
import { initializeUsers } from './reducers/usersReducer';

const App = () => {
  const dispatch = useDispatch();
  const blogFormRef = useRef();
  const user = useSelector((state) => state.user);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    dispatch(checkCachedUser());
    dispatch(initilizeblogs());
    dispatch(initializeUsers());
  }, []);

  return (
    <div className="flex flex-col pt-20 px-16">
      <Navigation setShowLogin={setShowLogin} />
      <Notification />
      {user ? (
        <div>
          <Togglable
            buttonLabel="Create New"
            ref={blogFormRef}
            style="body-button"
          >
            <BlogForm blogFormRef={blogFormRef} />
          </Togglable>
        </div>
      ) : null}
      {showLogin ? <LoginForm setShowLogin={setShowLogin} /> : null}
      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </div>
  );
};

export default App;
