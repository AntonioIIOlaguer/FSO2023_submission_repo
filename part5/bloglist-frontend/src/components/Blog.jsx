import blogsService from '../services/blogs'
import { useState } from 'react'
import { handleLike } from './helpers'

const Blog = ({ user, blog, notify, reloadBlogs }) => {
  const [expand, setExpand] = useState(false)

  const handleDelete = async () => {
    const confirm = window.confirm(
      `Do you really want to delete ${blog.title}`
    )

    if (!confirm) return
    try {
      await blogsService.remove(blog.id)
      reloadBlogs(blog, 'del')
      notify({
        type: 'success',
        text: `Successfully deleted the ${blog.title}`,
      })
    } catch (error) {
      notify({ type: 'error', text: 'Oops something happened' })
    }
  }

  const toggleDetails = () => {
    setExpand(!expand)
  }


  //Styling objects
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 5,
    paddingRight: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const displayText = {
    display: 'block',
    width: '80%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }

  const deleteStyle = { float: 'right' }

  return (
    <div style={blogStyle}>
      {!expand && (
        <div>
          <span style={displayText}>
            <span className='title' data-testid='blogTitle'>{blog.title}</span> by
            <span className='author'> {blog.author}</span>
          </span>

          <button onClick={toggleDetails}>View</button>
          {user?.name === blog.user.name && (
            <button onClick={handleDelete} style={deleteStyle}>
                            Remove
            </button>
          )}
        </div>
      )}

      {expand && (
        <div>
          <span className='title' data-testid='blogTitle'>{blog.title}</span>
          {user?.id === blog?.user.id && (
            <button onClick={handleDelete} style={deleteStyle}>
                            Remove
            </button>
          )}
          <br />
          <span className='url'>{blog.url}</span>
          <br />
          <span className='likes'>Likes: <span data-testid='likes'>{blog.likes}</span></span>
          <button onClick={() => handleLike({
            object: blog,
            service: blogsService,
            notify: notify,
            render: reloadBlogs,
          })} className='likeButton'>like</button>
          <br />
          <span className='author'>{blog.author}</span>
          <br />
          <button onClick={toggleDetails}>Hide</button>
        </div>
      )}
    </div>
  )
}

export default Blog
