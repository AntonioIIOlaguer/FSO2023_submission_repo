import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import './App.css'
import { handleLike }from './components/helpers'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()
  const notify = (type, text) => {
    // Set notification message with delay
    setNotification(type, text)
    setTimeout(() => setNotification(null), 5000)
  }

  const handleLogout = async (event) => {
    window.localStorage.clear()
    setUser(null)
    blogService.setToken('')
    notify({ type: 'success', text: 'User Logged out' })
  }

  const addBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(newBlog)
      setBlogs([...blogs, returnedBlog])
      notify({
        type: 'success',
        text: `Successfully added ${newBlog.title} to blog list.`,
      })

    } catch (error) {
      notify({
        type: 'error',
        text: 'Unable to add blog',
      })
    }
  }

  const reloadBlogs = (newBlog, mode) => {
    //Takes object and mode: del = on delete, add = on create new blog.
    if (mode === 'del')
      setBlogs(blogs.filter((blog) => blog.id !== newBlog.id))
    else if (mode === 'add') setBlogs([...blogs, newBlog])
    else if (mode === 'update')
      setBlogs(
        blogs
          .map((blog) => (blog.id === newBlog.id ? newBlog : blog))
          .sort((a, b) => b.likes - a.likes)
      )
  }

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      setUser(user)
      blogService.setToken(user.token)
    }
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
  }, [])

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />

      {user ? (
        <div>
          <p>
            {user.name} logged in{' '}
            <button onClick={handleLogout}>Logout</button>
          </p>
          <Togglable buttonLabel="New Blog" ref={blogFormRef}>
            <BlogForm addBlog={addBlog}/>
          </Togglable>
        </div>
      ) : (
        <Togglable buttonLabel="login">
          <LoginForm user={user} setUser={setUser} notify={notify} />
        </Togglable>
      )}

      {blogs.map((blog) => (
        <Blog
          user={user}
          key={blog.id}
          blog={blog}
          notify={notify}
          reloadBlogs={reloadBlogs}
          handleLike={handleLike}
        />
      ))}
    </div>
  )
}

export default App
