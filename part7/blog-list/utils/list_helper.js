const _ = require("lodash");
const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes;
    };
    return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
    return _.maxBy(blogs, "likes");
};

const mostBlogs = (blogs) => {
    const counts = _.countBy(blogs, "author");
    const maxBlogs = _.maxBy(_.keys(counts), (author) => counts[author]);
    return { author: maxBlogs, blogs: counts[maxBlogs] };
};

const mostLikes = (blogs) => {
    const likesByAuthor = _.mapValues(_.groupBy(blogs, "author"), (blogs) =>
        _.sumBy(blogs, "likes")
    );
    const mostLiked = _.maxBy(
        _.keys(likesByAuthor),
        (author) => likesByAuthor[author]
    );
    return { author: mostLiked, likes: likesByAuthor[mostLiked] };
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
};
