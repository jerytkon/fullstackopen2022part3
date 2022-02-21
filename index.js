
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

//app.use(morgan('tiny'))


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())

app.use(requestLogger)

app.use(cors())

app.use(express.static('build'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

/*
app.get('/info', (req, res) => {
    console.log(getNumberofPersons())
    res.send(`<div>Phonebook has info for ${getNumberofPersons()} people</div>
    <div>${Date()}</div>`)
  })


function getNumberofPersons() {
    const lengthPeople = persons.length
    return lengthPeople
}
*/

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  // const name = request.body.name
  // const personExists = persons.find(person => person.name === name)

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  /*
  if (personExists) {
    return response.status(400).json({
      error: 'name already exists'
    })
  }
*/
  const person = new Person({
    name: body.name,
    number: body.number || '112'
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error('Käyttääkö tätä', error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})