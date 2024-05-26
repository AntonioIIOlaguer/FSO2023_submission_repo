const { checkUser } = require("./helper");
const Author = require("./models/Author");
const { GraphQLError } = require("graphql");
const Book = require("./models/Book");
const { User } = require("./models/User");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Book.collection.countDocuments(),
    allAuthors: async () => Author.find({}),
    allBooks: async (root, args) => {
      console.log("Refecthed allBooks, args: ", args);
      let query = {};
      console.log(args);
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        query.author = author._id;
      }

      if (args.genre) {
        query.genres = { $in: [args.genre] };
      }

      return await Book.find(query).populate("author");
    },
    me: (root, args, context) => {
      console.log(context);
      return context.currentUser;
    },
  },

  Author: {
    name: (root) => root.name,
    bookCount: async (root) =>
      await Book.collection.countDocuments({ author: root._id }),
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      checkUser(currentUser);
      let existingAuthor = await Author.findOne({ name: args.author });

      if (!existingAuthor) {
        existingAuthor = new Author({ name: args.author });
      }

      const book = new Book({ ...args, author: existingAuthor._id });

      try {
        await existingAuthor.save();
        await book.save();
      } catch (error) {
        throw new GraphQLError("Saving Book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book.populate("author") });

      return book.populate("author");
    },

    editAuthor: async (root, args) => {
      checkUser(currentUser);
      const authorToEdit = await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.born },
        { new: true },
      );
      try {
        await authorToEdit.save();
      } catch (error) {
        throw new GraphQLError("Saving Book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
      return authorToEdit;
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      try {
        await user.save();
      } catch (error) {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      }
      return user;
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.SECRET) };
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
