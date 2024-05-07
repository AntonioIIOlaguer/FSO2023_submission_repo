const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const api = supertest(app);

describe("when there is initially one user in db", () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash("secretNaMalupet", 10);
        const user = new User({ username: "Malala", passwordHash });

        await user.save();
    });

    test("creation succeeds with a fresh username", async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: "Kikay",
            name: "Kikay Ken",
            password: "MyKikikilikili",
        };

        await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

        const usernames = usersAtEnd.map((u) => u.username);
        assert(usernames.includes(newUser.username));
    });
    test("creation fails with an existing user", async () => {
        const usersAtStart = await helper.usersInDb();
        const newUser = {
            username: usersAtStart[0].username,
            password: "duplicate",
        };

        await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
    test("creation fails with an invalid user", async () => {
        const usersAtStart = await helper.usersInDb();
        const newUser = {
            username: "shyshy",
            password: "sh",
        };

        await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
});

after(async () => {
    await mongoose.connection.close();
});
