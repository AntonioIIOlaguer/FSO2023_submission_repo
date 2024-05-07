const blogsRouter = require('express').Router();
const middleware = require('../utils/middleware');
const Blog = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');
const logger = require('../utils/logger');

blogsRouter
  .route('/')
  .get(async (request, response) => {
    const blogs = await Blog.find({})
      .populate('user', {
        username: 1,
        name: 1,
        id: 1,
      })
      .populate('comments', {
        comment: 1,
      });
    response.json(blogs);
  })

  .post(middleware.userExtractor, async (request, response) => {
    const newBlog = request.body;
    const user = await User.findById(request.user.id);
    const blog = new Blog({
      ...newBlog,
      user: user.id,
    });

    const savedBlog = await blog.save();
    await savedBlog.populate('user', {
      username: 1,
      name: 1,
      id: 1,
    });
    user.blogs = user.blogs.concat(savedBlog.id);
    await user.save();

    response.status(201).json(savedBlog);
  });

blogsRouter
  .route('/:id')
  .get(async (request, response) => {
    const returnedBlog = await Blog.findById(request.params.id).populate(
      'comments',
      {
        comment: 1,
      }.populate('user', {
        username: 1,
        name: 1,
        id: 1,
      }),
    );
    response.status(200).json(returnedBlog);
  })
  .post(async (request, response) => {
    const returnedBlog = await Blog.findById(request.params.id)
      .populate('comments', {
        comment: 1,
      })
      .populate('user', {
        username: 1,
        name: 1,
        id: 1,
      });
    returnedBlog.likes++;
    await returnedBlog.save();

    response.status(200).json(returnedBlog);
  })
  .delete(middleware.userExtractor, async (request, response) => {
    const returnedBlog = await Blog.findById(request.params.id);
    if (returnedBlog.user.toString() !== request.user.id) {
      return response
        .status(401)
        .json({ error: 'User has no access to delete resource' });
    }
    //delete the blog reference in user
    await User.findByIdAndUpdate(request.user.id, {
      $pull: { blogs: request.params.id },
    });

    //delete the blog
    await returnedBlog.deleteOne();
    response.status(204).end();
  })
  .put(async (request, response) => {
    const blog = {
      ...request.body,
    };
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    }).populate('user', {
      username: 1,
      name: 1,
      id: 1,
    });
    response.status(200).json(updatedBlog);
  });

blogsRouter
  .route('/:id/comments')
  .post(middleware.userExtractor, async (request, response) => {
    const newComment = request.body;
    const user = await User.findById(request.user.id);
    const blog = await Blog.findById(request.params.id);
    const comment = new Comment({
      ...newComment,
      user: user.id,
      blog: blog.id,
    });

    const savedComment = await comment.save();
    blog.comments = blog.comments.concat(savedComment.id);
    user.comments = user.comments.concat(savedComment.id);
    await blog.save();
    await user.save();
    console.log(savedComment);
    response.status(201).json(savedComment);
  });

module.exports = blogsRouter;
