require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

//Logger for requests
app.use(
    morgan("dev", {
        skip: function (req, res) {
            return req.method == "POST" || req.method == "PUT";
        },
    })
);
// Define a body object for logger
morgan.token("body", function getBody(req) {
    return JSON.stringify(req.body);
});
//Logger for Post Request
app.use(
    morgan(
        ":method :url :status :response-time ms - :res[content-length] :body",
        {
            // Option property to skip if not a POST req
            skip: function (req, res) {
                return req.method == "GET" || req.method == "DELETE";
            },
        }
    )
);

app.route("/api/persons")
    .get((req, res) => {
        Person.find({}).then((persons) => {
            res.json(persons);
        });
    })
    .post((req, res, next) => {
        const body = req.body;
        const newPerson = new Person({
            name: body.name,
            number: body.number,
        });

        newPerson
            .save()
            .then((savedNewPerson) => {
                res.json(savedNewPerson);
            })
            .catch((err) => next(err));
    });

app.route("/api/persons/:id")
    .get((req, res, next) => {
        Person.findById(req.params.id)
            .then((person) => {
                if (person) {
                    res.json(person);
                } else {
                    //catches nonexistent id
                    res.status(404).end();
                }
            })
            // catches malformatted id and passes it to errorHandler Middleware
            .catch((err) => next(err));
    })
    .delete((req, res) => {
        Person.findByIdAndDelete(req.params.id)
            .then((result) => {
                res.status(204).end();
            })
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        const person = {
            name: req.body.name,
            number: req.body.number,
        };
        Person.findByIdAndUpdate(req.params.id, person, {
            new: true,
            runValidators: true,
        })
            .then((updatedPerson) => {
                res.json(updatedPerson);
            })
            .catch((err) => next(err));
    });

app.get("/info", (req, res) => {
    Person.countDocuments({}).then((result) => {
        const date = new Date();
        res.send(`The phonebook has info for ${result} persons <br/> ${date}`);
    });
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
    console.error(err.message);

    if (err.name === "CastError") {
        return res.status(400).send({ error: "malformatted id" });
    } else if (err.name === "ValidationError") {
        return res.status(400).send({ error: err.message });
    }
    next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
