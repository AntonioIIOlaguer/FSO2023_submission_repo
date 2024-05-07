const morgan = require("morgan");
const logger = require("./logger");
const jwt = require("jsonwebtoken");

// Define a body object for logger
morgan.token("body", function getBody(req) {
    return JSON.stringify(req.body);
});

const requestLogger = morgan(
    ":method :url :status :response-time ms - :res[content-length] :body",
    { skip: (req, res) => process.env.NODE_ENV == "test" }
);

//Gets token and assigns it to request.token
const tokenExtractor = (request, response, next) => {
    const authorization = request.get("authorization");
    if (authorization && authorization.startsWith("Bearer ")) {
        request.token = authorization.replace("Bearer ", "");
    }
    next();
};

//Decodes the Token and sets User to request.user
const userExtractor = async (request, response, next) => {
    // Verifying token returns object which token was based on
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    //If the token is missing or it is invalid, the exception _JsonWebTokenError_ is raised.

    //if decodedToken is undefined
    if (!decodedToken.id) {
        return response.status(401).json({ error: "token invalid" });
    }
    request.user = decodedToken;
    next();
};

//Handles unknown Endpoints
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);
    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    } else if (
        error.name === "MongoServerError" &&
        error.message.includes("E11000 duplicate key error")
    ) {
        return response
            .status(400)
            .json({ error: "expected `username` to be unique" });
    } else if (error.name === "JsonWebTokenError") {
        return response.status(401).json({ error: "token missing or invalid" });
    } else if (error.name === "VersionError") {
        return response.status(400).json({ error: error.message });
    } else if (error.name === "TypeError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor,
};
