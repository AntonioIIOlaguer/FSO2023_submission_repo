import { useState } from 'react'
import loginService from '../services/login'
import blogsService from '../services/blogs'

const LoginForm = ({ user, setUser, notify }) => {
  const [newInput, setNewInput] = useState({ username: '', password: '' })
  const handleInputChange = (event) => {
    const value = event.target.value
    setNewInput({
      ...newInput,
      [event.target.name]: value,
    })
  }
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username: newInput.username,
        password: newInput.password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser',
        JSON.stringify(user)
      )

      blogsService.setToken(user.token)
      setUser(user)
      setNewInput({ username: '', password: '' })
      notify({ type: 'success', text: 'Succesffuly Logged In' })
    } catch (error) {
      notify({ type: 'error', text: 'Wrong username or Password' })
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
                username
        <input
          type="text"
          value={newInput.username}
          name="username"
          onChange={handleInputChange}
          data-testid="username"
        />
      </div>
      <div>
                password
        <input
          type="password"
          value={newInput.password}
          name="password"
          onChange={handleInputChange}
          data-testid="password"
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
