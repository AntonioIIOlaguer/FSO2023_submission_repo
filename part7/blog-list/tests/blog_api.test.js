const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

describe("Bloglist contains blogs already", () => {
    beforeEach(async () => {
        //Reinitialize DB
        await Blog.deleteMany({});
        await Blog.insertMany(helper.initialBlogs);
    });
    test(`Blog posts are returned as JSON`, async () => {
        await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    });

    test(`Returns the correct amount of blog posts in JSON`, async () => {
        const response = await api.get("/api/blogs");

        assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    test("Blog unique identifier property as id instead of _id object", async () => {
        const response = await api.get("/api/blogs");
        hasPropertyId = response.body[0].hasOwnProperty("id");
        assert.ok(hasPropertyId);
        if (hasPropertyId) {
            assert.strictEqual(typeof response.body[0].id, "string");
        }
    });

    test("Fetching a blog by id", async () => {
        const blogs = await api.get("/api/blogs");
        const expectedBlog = blogs.body[0];
        const fetchedBlog = await api.get(`/api/blogs/${expectedBlog.id}`);
        assert.deepStrictEqual(fetchedBlog.body, expectedBlog);
    });

    test("Fetching a blog with nonexistent id", async () => {
        const wrongId = await helper.nonExistingId();
        const response = await api
            .get(`/api/blogs/${wrongId}`)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        assert.equal(response.body, null);
    });

    test("Fetching a blog with malformatted id", async () => {
        await api
            .get(`/api/blogs/123456jk`)
            .expect(400)
            .expect("Content-Type", /application\/json/);
    });
});
describe("Adding a new blog", async () => {
    let token = "";
    beforeEach(async () => {
        //Reinitialize DB
        await Blog.deleteMany({});
        await Blog.insertMany(helper.initialBlogs);
        token = (await helper.loggedInUser()).token;
    });

    test("Add blog entry and verify integrity", async () => {
        let newBlog = {
            title: "Protein shake",
            author: "Juji",
            url: "https://example.com/protein_shakes",
            likes: 45,
        };

        await api
            .post("/api/blogs")
            .send(newBlog)
            .set({ Authorization: token })
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

        const contents = blogsAtEnd.map((n) => n.title);
        assert(contents.includes("Protein shake"));
    });

    test("Missing like property defaults to 0", async () => {
        let newBlog = {
            title: "New lofi hits of 2024",
            author: "Marshyello",
            url: "https://example.com/new_lofi_hits_2024",
        };

        const returnedBlog = await api
            .post("/api/blogs")
            .send(newBlog)
            .set({ Authorization: token })
            .expect(201)
            .expect("Content-Type", /application\/json/);

        assert.strictEqual(returnedBlog.body.likes, 0);
    });
    test("Missing Title property", async () => {
        const newBlog = {
            author: "Papaya",
            url: "https://example.com/farming",
            likes: 12,
        };

        const response = await api
            .post("/api/blogs")
            .send(newBlog)
            .set({ Authorization: token })
            .expect(400)
            .expect("Content-Type", /application\/json/);
        const expectedError =
            "Blog validation failed: title: Path `title` is required.";
        assert.strictEqual(response.body.error, expectedError);
    });
    test("Missing Url property", async () => {
        const newBlog = {
            title: "farming",
            author: "Papaya",
            likes: 12,
        };

        const response = await api
            .post("/api/blogs")
            .send(newBlog)
            .set({ Authorization: token })
            .expect(400)
            .expect("Content-Type", /application\/json/);
        const expectedError =
            "Blog validation failed: url: Path `url` is required.";
        assert.strictEqual(response.body.error, expectedError);
    });
});

describe("Deleting a blog", () => {
    let token = "";
    beforeEach(async () => {
        //Reinitialize DB
        await Blog.deleteMany({});
        const tester = await helper.loggedInUser();

        // add user ID to initialized blog
        const modifiedInitialBlogs = helper.initialBlogs.map((blog) => {
            return { ...blog, user: tester.id };
        });
        await Blog.insertMany(modifiedInitialBlogs);
        token = tester.token;
    });

    test("Succeeds with status code 204 if id is valid", async () => {
        const blogsAtStart = await helper.blogsInDb();

        const blogToDelete = blogsAtStart[0];

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set({ Authorization: token })
            .expect(204);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

        const contents = blogsAtEnd.map((r) => r.title);
        assert(!contents.includes(blogToDelete.title));
    });
});

describe("Updating a blog", () => {
    let token = "";
    beforeEach(async () => {
        //Reinitialize DB
        await Blog.deleteMany({});
        const tester = await helper.loggedInUser();

        // add user ID to initialized blog
        const modifiedInitialBlogs = helper.initialBlogs.map((blog) => {
            return { ...blog, user: tester.id };
        });
        await Blog.insertMany(modifiedInitialBlogs);
        token = tester.token;
    });

    test("Updating number of likes", async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToUpdate = blogsAtStart[0];
        const updatedBlog = {
            ...blogToUpdate,
            likes: blogToUpdate.likes + 1,
        };

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .set({ Authorization: token })
            .expect(200)
            .expect("Content-Type", /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();
        const checkUpdatedBlog = blogsAtEnd.find(
            (blog) => blog.id == blogToUpdate.id
        );

        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
        assert.strictEqual(checkUpdatedBlog.likes, updatedBlog.likes);
    });
});

after(async () => {
    await mongoose.connection.close();
});
