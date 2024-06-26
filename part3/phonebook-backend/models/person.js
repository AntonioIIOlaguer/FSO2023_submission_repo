const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose.set("strictQuery", false);
mongoose
    .connect(url)
    .then((result) => {
        console.log("connected to MongoDb");
    })
    .catch((error) => {
        console.log("errorconnecting to MongoDB:", error.message);
    });

const personSchema = new mongoose.Schema({
    name: {
        type: String,

        required: true,
    },
    number: {
        type: String,
        min: 8,
        required: true,
        validate: {
            validator: function (v) {
                return /\d{3}-\d{3}-\d{4}|\d{8}|\d{2}-\d{6}|\d{3}=\d{8}/.test(
                    v
                );
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);
