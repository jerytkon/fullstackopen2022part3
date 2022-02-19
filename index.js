
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-1234556"
  },
  {
    id: 2,
    name: "Artsi Hellas",
    number: "040-1234556"
  },
  {
    id: 3,
    name: "Antero Hellas",
    number: "040-1234556"
  }
]

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    console.log(getNumberofPersons())
    res.send(`<div>Phonebook has info for ${getNumberofPersons()} people</div> 
    <div>${Date()}</div>`)
  })

const generateId = () => {
    min = Number(1)
    max = Number(10000)
    return Math.floor(Math.random() * (max - min) + min)
}

function getNumberofPersons() {
    const lengthPeople = persons.length
    return lengthPeople
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  const name = request.body.name
  const personExists = persons.find(person => person.name === name)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  if (personExists) {
    return response.status(400).json({ 
      error: 'name already exists' 
    })
  }
  
  const person = {
    name: body.name,
    number: body.number || "112",
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})