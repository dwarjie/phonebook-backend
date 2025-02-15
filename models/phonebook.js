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
  name: String,
  number: Number,
});
phonebookSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("tbl_phonebook", phonebookSchema);
