const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

//Register new User
usersRouter
  .route('/')
  .get(async (request, response) => {
    const users = await User.find({}).populate('blogs', {
      url: 1,
      title: 1,
      author: 1,
      id: 1,
    });
    response.status(200).json(users);
  })
  .post(async (request, response, next) => {
    const { username, name, password } = request.body;

    if (password.length < 3) {
      const error = {
        name: 'ValidationError',
        message: 'Password Too short. Minimum of 3 characters',
      };
      return next(error);
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
  });

module.exports = usersRouter;
