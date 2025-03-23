require("dotenv").config();
const express = require("express");
const Phonebook = require("./models/phonebook");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

morgan.token("req-body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(cors());
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

app.get("/api/persons", (req, res, next) => {
  Phonebook.find({})
    .then((persons) => {
      if (!persons || !persons.length)
        return res.json({ message: "Person data is empty" });

      res.json(persons);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/info/", (req, res, next) => {
  Phonebook.find({})
    .then((persons) => {
      if (!persons || !persons.length)
        return res.send(`<p>Person data is empty</p>`);

      const template = `
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${Date()}</p>
    `;
      res.send(template);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Phonebook.findById(id)
    .then((person) => {
      if (!person)
        return res
          .status(400)
          .json({ message: "Person ID is does not exist." });

      res.json(person);
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Phonebook.findByIdAndDelete(id)
    .then((result) => {
      if (!result || result === null)
        return res
          .status(400)
          .json({ message: "Person ID is does not exist." });

      res.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/persons/", (req, res, next) => {
  const data = req.body;

  if (data.name === undefined || data.number === undefined)
    return res.status(400).json({ message: "Missing required informations." });

  const newPerson = new Phonebook({
    name: data.name,
    number: data.number,
  });

  newPerson
    .save()
    .then((person) => {
      res.json({ message: `Person ${person.name} successfully created.` });
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/persons/:id", (req, res, next) => {
  const data = req.body;

  Phonebook.findByIdAndUpdate(
    req.params.id,
    { number: data.number },
    {
      new: true,
    },
  )
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      next(error);
    });
});

const unknownRouteMiddleware = (req, res) => {
  res.status(404).send({ error: "Unknown Endpoint" });
};

const errorHandlerMiddleware = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return res
      .status(400)
      .send({ error: "Malformatted ID. Please fix your request ID format." });
  } else if (error.name === "ParallelSaveError") {
    return res.status(400).send({
      error: "Save is called too many times. Please try again later.",
    });
  } else if (error.name === "ValidationError") {
    return res
      .status(400)
      .send({ error: "Validation Failed. Please try again later." });
  }

  next(error);
};

app.use(unknownRouteMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening in PORT: ${PORT}`);
});
