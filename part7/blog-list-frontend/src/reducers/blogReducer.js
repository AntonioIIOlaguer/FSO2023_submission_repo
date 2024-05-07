import blogService from '../services/blogs';
import { createSelector, createSlice } from '@reduxjs/toolkit';

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
    },

    updateBlog(state, action) {
      return state.map((blog) =>
        blog.id !== action.payload.id ? blog : action.payload,
      );
    },

    setBlogs(state, action) {
      return action.payload;
    },

    deleteBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload.id);
    },
  },
});

// ---- Redux Thunks --- //

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content);
    dispatch(appendBlog(newBlog));
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const returnedBlog = await blogService.voteBlog(blog.id);
    dispatch(updateBlog(returnedBlog));
  };
};

export const initilizeblogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const addComment = (comment, blog) => {
  return async (dispatch) => {
    const response = await blogService.createComment({ comment }, blog.id);
    const updatedBlog = { ...blog, comments: blog.comments.concat(response) };
    dispatch(updateBlog(updatedBlog));
  };
};

export const removeBlog = (blog) => {
  return async (dispatch) => {
    await blogService.remove(blog.id);
    dispatch(deleteBlog(blog));
  };
};

export const filteredBlogSelector = createSelector(
  (state) => state.blogs,
  (state) => state.filter,
  (blogs, filter) => {
    const sortedblogs = [...blogs].sort((a, b) => {
      return b.votes - a.votes;
    });

    return filter
      ? sortedblogs.filter((blog) => {
          blog.content.toLowerCase().includes(filter.toLowerCase());
        })
      : sortedblogs;
  },
);

export const { appendBlog, setBlogs, updateBlog, deleteBlog } =
  blogsSlice.actions;
export default blogsSlice.reducer;
