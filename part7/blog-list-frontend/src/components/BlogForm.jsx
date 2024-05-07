import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBlog } from '../reducers/blogReducer';
import { notify } from '../reducers/notificationReducer';

const BlogForm = ({ blogFormRef }) => {
  const dispatch = useDispatch();
  const [newInput, setNewInput] = useState({
    title: '',
    author: '',
    url: '',
  });

  const addBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility();
      dispatch(createBlog(newBlog));
      const message = {
        type: 'success',
        text: `Successfully added ${newBlog.title} to blog list.`,
      };
      dispatch(notify(message, 5000));
    } catch (error) {
      const message = {
        type: 'error',
        text: 'unable to add blog',
      };
      dispatch(notify(message, 5000));
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setNewInput({
      ...newInput,
      [event.target.name]: value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    addBlog({
      title: newInput.title,
      author: newInput.author,
      url: newInput.url,
    });

    setNewInput({
      title: '',
      author: '',
      url: '',
    });
  };

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
  );
};

export default BlogForm;
