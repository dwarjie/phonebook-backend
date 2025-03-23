const mongoose = require("mongoose");

console.log(`Connecting to database . . .`);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`Connected to database`);
  })
  .catch((err) => {
    console.log(`Cannot connect to database. ${err.message}`);
  });

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "Required name is atleast 3 characters."],
    required: [true, "Name field is required."],
  },
  number: {
    type: Number,
    min: [8, "Required number is atleast 8 digits"],
    validate: {
      validator: function (val) {
        return /\d{3}-\d{3}-\d{4}/.test(val);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});
phonebookSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("tbl_phonebook", phonebookSchema);
