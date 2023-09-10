const express = require('express')
const morgan = require('morgan')
morgan.token('body', (req, res) => JSON.stringify(req.body))
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :body'))
app.use(cors())
app.use(express.static('build'))

let persons = [
      {
        id: 1,
        name: "Teemu Harinen",
        number: "040-11111"
      },
      {
        id: 2,
        name: "Ada Lovelace",
        number: "020-20000"
      },
      {
        id: 3,
        name: "Dan Abramov",
        number: "0400-22344"
      }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const currentTime = new Date().toString()
  const text = `Phonebook has info for ${persons.length} people <br/>` + currentTime
  res.send(text)
  
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


app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const max = 1000000
  const id = Math.floor(Math.random() * max)
  return id
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name and number are required' 
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})