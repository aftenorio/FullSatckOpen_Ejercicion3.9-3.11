const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.static('dist')) // Sirve el frontend desde la carpeta dist

// 1. Middlewares principales.........
app.use(cors())
app.use(express.json())

// 2. Configuración de Morgan
morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
//app.use(morgan('tiny'))

const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" },
  { id: 5, name: "Andres Tenorio", number: "39-23-6423199" }
]

// Cambia esto: para que funciones en Render
//const PORT = 3001


//app.listen(PORT, () => {
//  console.log(`Server running on port ${PORT}`)
//})

// 3. Rutas de la API
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const numberOfPersons = persons.length
  const date = new Date()
  response.send(
    `<p>Phonebook has info for ${numberOfPersons} people</p>
     <p>${date}</p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

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


app.post('/api/persons', (request, response) => {
const body = request.body

// Validación: nombre o número faltante
if (!body.name || !body.number) {
  return response.status(400).json({
    error: 'name or number missing'
  })
}
// Validación: nombre duplicado
  const nameExists = persons.find(
    person => person.name === body.name
  )

  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})