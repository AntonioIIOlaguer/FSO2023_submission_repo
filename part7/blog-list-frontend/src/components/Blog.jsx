import { useDispatch, useSelector } from 'react-redux';
import { removeBlog, likeBlog, addComment } from '../reducers/blogReducer';
import { notify } from '../reducers/notificationReducer';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

const Blog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const blogId = useParams().id;
  const user = useSelector((state) => state.user);
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === blogId),
  );
  const [comment, setComment] = useState('');

  const handleCommentChange = (event) => {
    const value = event.target.value;
    setComment(value);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(addComment(comment, blog));
      setComment('');
      dispatch(
        notify({ type: 'success', text: 'Succesffuly added comment' }, 5000),
      );
    } catch {
      setComment('');
      dispatch(notify({ type: 'error', text: 'Unable to add Comment' }, 5000));
    }
  };

  const handleLike = async () => {
    try {
      dispatch(likeBlog(blog));
    } catch (error) {
      const message = { type: 'error', text: 'Oops something went wrong.' };
      dispatch(notify(message, 5000));
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      `Do you really want to delete ${blog.title}`,
    );

    if (!confirm) return;
    try {
      dispatch(removeBlog(blog));
      const message = {
        type: 'success',
        text: `Successfully deleted the ${blog.title}`,
      };
      navigate('/blogs');
      dispatch(notify(message, 5000));
    } catch (error) {
      const message = { type: 'error', text: 'Oops something went wrong.' };
      dispatch(notify(message, 5000));
    }
  };

  //Styling objects
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 5,
    paddingRight: 5,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        <h2 data-testid="blogTitle">
          {blog.title} by <span className="author">{blog.author}</span>
        </h2>
        {user?.id === blog?.user.id && (
          <button onClick={handleDelete}>Remove</button>
        )}
        <br />
        <a className="url" href={blog.url}>
          {blog.url}
        </a>
        <br />
        <span className="likes">
          Likes: <span data-testid="likes">{blog.likes}</span>
        </span>
        <button onClick={handleLike} className="likeButton">
          like
        </button>
        <br />
        <span>added by {blog.user.name}</span>
      </div>
      <h3> Comments </h3>
      {user && (
        <form onSubmit={handleCommentSubmit}>
          <input
            name="comment"
            value={comment}
            onChange={handleCommentChange}
          />
          <button type="submit">add comment</button>
        </form>
      )}
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment.id}>{comment.comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
