const express = require("express");
const morgan = require("morgan");
const app = express();

morgan.token("req-body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body",
  ),
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  if (!persons.length) {
    return res.json({ message: "Person data is empty" });
  }

  res.json(persons);
});

app.get("/info/", (req, res) => {
  if (!persons.length) {
    return res.send(`<p>Person data is empty</p>`);
  }

  const template = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>
  `;
  res.send(template);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  if (!person)
    return res.status(400).json({ message: "Person ID is does not exist." });

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  if (!person)
    return res.status(400).json({ message: "Person ID is does not exist." });

  const updatedData = persons.filter((person) => person.id !== id);
  persons = updatedData;
  res.json({ message: "Person successfully deleted." });
});

app.post("/api/persons/", (req, res) => {
  const data = req.body;

  if (
    persons.find(
      (person) => person.name.toLowerCase() === data.name.toLowerCase(),
    )
  )
    return res.status(400).json({ message: "Name already exist." });

  if (data.name == "" || data.number == "")
    return res.status(400).json({ message: "Missing required informations." });

  const newPerson = {
    id: Math.floor(Math.random() * 100),
    name: data.name,
    number: data.number,
  };

  persons = persons.concat(newPerson);
  res.json({ message: `Person ${data.name} successfully created.` });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Listening in PORT: ${PORT}`);
});
