import { useState } from 'react'
import blogsService from '../services/blogs'

const BlogForm = ({ addBlog }) => {
  const [newInput, setNewInput] = useState({
    title: '',
    author: '',
    url: '',
  })
  const handleInputChange = (event) => {
    const value = event.target.value
    setNewInput({
      ...newInput,
      [event.target.name]: value,
    })
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    addBlog( {
      title: newInput.title,
      author: newInput.author,
      url: newInput.url,
    })

    setNewInput({
      title: '',
      author: '',
      url: '',
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create new</h2>
      <div>
                title:
        <input
          type="text"
          value={newInput.title}
          name="title"
          id="title"
          onChange={handleInputChange}
          data-testid="title"
        />
      </div>
      <div>
                author:
        <input
          type="author"
          value={newInput.author}
          name="author"
          id="author"
          onChange={handleInputChange}
          data-testid="author"
        />
      </div>
      <div>
                url:
        <input
          type="url"
          value={newInput.url}
          name="url"
          id="url"
          onChange={handleInputChange}
          data-testid="url"
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm
