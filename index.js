const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path') // 1. IMPORTANTE: Requerir path para rutas absolutas

const app = express()

// Middlewares principales
app.use(cors())
app.use(express.json())

// Configuración de Morgan
morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// 2. CORRECCIÓN: Servir frontend usando una ruta absoluta segura para Render
app.use(express.static(path.join(__dirname, 'dist')))

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" },
  { id: 5, name: "Andres Tenorio", number: "39-23-6423199" }
]

const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}

// Rutas de la API
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

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

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

// 3. CORRECCIÓN: Manejar cualquier otra ruta devolviendo el index.html
// Esto evita el 404 si recargas la página o usas React Router
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
