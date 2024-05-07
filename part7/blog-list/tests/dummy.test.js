const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const exp = require("node:constants");

test("dummy returns one", () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    assert.strictEqual(result, 1);
});

describe("total likes", () => {
    const listWithOneBlog = [
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
            likes: 5,
            __v: 0,
        },
    ];

    test("when list has only one blog, equals the likes of that", () => {
        const result = listHelper.totalLikes(listWithOneBlog);
        assert.strictEqual(result, 5);
    });

    const listWithAlotOfBlogs = [
        {
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0,
        },
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5,
            __v: 0,
        },
        {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0,
        },
        {
            _id: "5a422b891b54a676234d17fa",
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: 10,
            __v: 0,
        },
        {
            _id: "5a422ba71b54a676234d17fb",
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            likes: 0,
            __v: 0,
        },
        {
            _id: "5a422bc61b54a676234d17fc",
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 2,
            __v: 0,
        },
    ];

    test("when list has multiple blogs, equals the likes of that", () => {
        const result = listHelper.totalLikes(listWithAlotOfBlogs);
        assert.strictEqual(result, 36);
    });
});
describe("Most liked blog", () => {
    test("Multiple blogs, no same likes", () => {
        const listOfUniqueBlogs = [
            {
                _id: "5a422a851b54a676234d17f7",
                title: "React patterns",
                author: "Michael Chan",
                url: "https://reactpatterns.com/",
                likes: 7,
                __v: 0,
            },
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 5,
                __v: 0,
            },
            {
                _id: "5a422b3a1b54a676234d17f9",
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                likes: 12,
                __v: 0,
            },
            {
                _id: "5a422b891b54a676234d17fa",
                title: "First class tests",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
                likes: 10,
                __v: 0,
            },
            {
                _id: "5a422ba71b54a676234d17fb",
                title: "TDD harms architecture",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
                likes: 0,
                __v: 0,
            },
            {
                _id: "5a422bc61b54a676234d17fc",
                title: "Type wars",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                likes: 2,
                __v: 0,
            },
        ];
        const expectedOutput = {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0,
        };
        assert.deepStrictEqual(
            listHelper.favoriteBlog(listOfUniqueBlogs),
            expectedOutput
        );
    });
    test("Multiple blogs with the same likes", () => {
        const listOfBlogsWithSameLike = [
            {
                _id: "5a422a851b54a676234d17f7",
                title: "React patterns",
                author: "Michael Chan",
                url: "https://reactpatterns.com/",
                likes: 12,
                __v: 0,
            },
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 5,
                __v: 0,
            },
            {
                _id: "5a422b3a1b54a676234d17f9",
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                likes: 12,
                __v: 0,
            },
            {
                _id: "5a422b891b54a676234d17fa",
                title: "First class tests",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
                likes: 10,
                __v: 0,
            },
            {
                _id: "5a422ba71b54a676234d17fb",
                title: "TDD harms architecture",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
                likes: 12,
                __v: 0,
            },
            {
                _id: "5a422bc61b54a676234d17fc",
                title: "Type wars",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                likes: 2,
                __v: 0,
            },
        ];
        const expectedOutput = {
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 12,
            __v: 0,
        };
        assert.deepStrictEqual(
            listHelper.favoriteBlog(listOfBlogsWithSameLike),
            expectedOutput
        );
    });
});
describe("Author with the most blogs", () => {
    test("Unique blogs", () => {
        const listOfUniqueBlogs = [
            {
                _id: "5a422a851b54a676234d17f7",
                title: "React patterns",
                author: "Michael Chan",
                url: "https://reactpatterns.com/",
                likes: 7,
                __v: 0,
            },
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 5,
                __v: 0,
            },
            {
                _id: "5a422b3a1b54a676234d17f9",
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                likes: 12,
                __v: 0,
            },
            {
                _id: "5a422b891b54a676234d17fa",
                title: "First class tests",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
                likes: 10,
                __v: 0,
            },
            {
                _id: "5a422ba71b54a676234d17fb",
                title: "TDD harms architecture",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
                likes: 0,
                __v: 0,
            },
            {
                _id: "5a422bc61b54a676234d17fc",
                title: "Type wars",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                likes: 2,
                __v: 0,
            },
        ];
        const expectedOutput = {
            author: "Robert C. Martin",
            blogs: 3,
        };
        assert.deepStrictEqual(
            listHelper.mostBlogs(listOfUniqueBlogs),
            expectedOutput
        );
    });
    test("Another Set of Unique blogs", () => {
        const anotherListOfUniqueBlogs = [
            { title: "JavaScript Basics", author: "John Doe", likes: 10 },
            { title: "React Tutorial", author: "Jane Smith", likes: 20 },
            { title: "Node.js Essentials", author: "John Doe", likes: 15 },
            { title: "CSS Styling Tricks", author: "Alice Johnson", likes: 8 },
            {
                title: "Advanced JavaScript Techniques",
                author: "John Doe",
                likes: 25,
            },
            { title: "Vue.js Crash Course", author: "Jane Smith", likes: 12 },
            {
                title: "Express.js Fundamentals",
                author: "Alice Johnson",
                likes: 18,
            },
            { title: "React Native Guide", author: "John Doe", likes: 22 },
            {
                title: "Frontend Performance Optimization",
                author: "Alice Johnson",
                likes: 14,
            },
            { title: "GraphQL Introduction", author: "Jane Smith", likes: 16 },
        ];
        const expectedOutput = {
            author: "John Doe",
            blogs: 4,
        };
        assert.deepStrictEqual(
            listHelper.mostBlogs(anotherListOfUniqueBlogs),
            expectedOutput
        );
    });
});
describe("Author with most likes", () => {
    test("Unique blogs", () => {
        const listOfUniqueBlogs = [
            {
                _id: "5a422a851b54a676234d17f7",
                title: "React patterns",
                author: "Michael Chan",
                url: "https://reactpatterns.com/",
                likes: 7,
                __v: 0,
            },
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 5,
                __v: 0,
            },
            {
                _id: "5a422b3a1b54a676234d17f9",
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                likes: 12,
                __v: 0,
            },
            {
                _id: "5a422b891b54a676234d17fa",
                title: "First class tests",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
                likes: 10,
                __v: 0,
            },
            {
                _id: "5a422ba71b54a676234d17fb",
                title: "TDD harms architecture",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
                likes: 0,
                __v: 0,
            },
            {
                _id: "5a422bc61b54a676234d17fc",
                title: "Type wars",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                likes: 2,
                __v: 0,
            },
        ];
        const expectedOutput = {
            author: "Edsger W. Dijkstra",
            likes: 17,
        };
        assert.deepStrictEqual(
            listHelper.mostLikes(listOfUniqueBlogs),
            expectedOutput
        );
    });
    test("Another Set of Unique blogs", () => {
        const anotherListOfUniqueBlogs = [
            { title: "JavaScript Basics", author: "John Doe", likes: 10 },
            { title: "React Tutorial", author: "Jane Smith", likes: 20 },
            { title: "Node.js Essentials", author: "John Doe", likes: 15 },
            {
                title: "CSS Styling Tricks",
                author: "Alice Johnson",
                likes: 8,
            },
            {
                title: "Advanced JavaScript Techniques",
                author: "John Doe",
                likes: 25,
            },
            {
                title: "Vue.js Crash Course",
                author: "Jane Smith",
                likes: 12,
            },
            {
                title: "Express.js Fundamentals",
                author: "Alice Johnson",
                likes: 18,
            },
            { title: "React Native Guide", author: "John Doe", likes: 22 },
            {
                title: "Frontend Performance Optimization",
                author: "Alice Johnson",
                likes: 14,
            },
            {
                title: "GraphQL Introduction",
                author: "Jane Smith",
                likes: 16,
            },
        ];
        const expectedOutput = {
            author: "John Doe",
            likes: 72,
        };
        assert.deepStrictEqual(
            listHelper.mostLikes(anotherListOfUniqueBlogs),
            expectedOutput
        );
    });
});
