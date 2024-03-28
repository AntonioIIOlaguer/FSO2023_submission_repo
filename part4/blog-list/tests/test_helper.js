const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const initialBlogs = [
    {
        title: "JavaScript Basics",
        author: "John Doe",
        likes: 10,
        url: "https://example.com/javascript-basics",
    },
    {
        title: "React Tutorial",
        author: "Jane Smith",
        likes: 20,
        url: "https://example.com/react-tutorial",
    },
    {
        title: "Node.js Essentials",
        author: "John Doe",
        likes: 15,
        url: "https://example.com/nodejs-essentials",
    },
    {
        title: "CSS Styling Tricks",
        author: "Alice Johnson",
        likes: 8,
        url: "https://example.com/css-styling-tricks",
    },
    {
        title: "Advanced JavaScript Techniques",
        author: "John Doe",
        likes: 25,
        url: "https://example.com/advanced-javascript-techniques",
    },
    {
        title: "Vue.js Crash Course",
        author: "Jane Smith",
        likes: 12,
        url: "https://example.com/vuejs-crash-course",
    },
    {
        title: "Express.js Fundamentals",
        author: "Alice Johnson",
        likes: 18,
        url: "https://example.com/expressjs-fundamentals",
    },
    {
        title: "React Native Guide",
        author: "John Doe",
        likes: 22,
        url: "https://example.com/react-native-guide",
    },
    {
        title: "Frontend Performance Optimization",
        author: "Alice Johnson",
        likes: 14,
        url: "https://example.com/frontend-performance-optimization",
    },
    {
        title: "GraphQL Introduction",
        author: "Jane Smith",
        likes: 16,
        url: "https://example.com/graphql-introduction",
    },
];

const initialUser = {
    username: "testUser",
    name: "tester",
    password: "test",
};

//Generate nonExistingId from the databse used for testing
const nonExistingId = async () => {
    const blog = new Blog({
        url: "https://willremove.com",
        title: "willremovethissoon",
    });
    await blog.save();
    await blog.deleteOne();

    return blog.id;
};

const blogsInDb = async () => {
    const blog = await Blog.find({});
    return blog.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
    const user = await User.find({});
    return user.map((user) => user.toJSON());
};

const loggedInUser = async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("secretNaMalupet", 10);
    const user = new User({ username: "Malala", passwordHash });
    await user.save();

    const userForToken = {
        username: user.username,
        id: user.id,
    };

    const returnedToken = jwt.sign(userForToken, process.env.SECRET, {
        expiresIn: 60 * 60,
    });
    return {
        token: `Bearer ${returnedToken}`,
        id: user.id,
        username: user.username,
    };
};
module.exports = {
    initialBlogs,
    loggedInUser,
    nonExistingId,
    blogsInDb,
    usersInDb,
};
