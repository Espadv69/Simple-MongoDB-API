const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

// Conectar a MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/users')
  .then(() => console.log('MongoDB connected ✅'))
  .catch((err) => console.error('MongoDB connection failed ❌', err))

// Modelo de usuario
const User = mongoose.model(
  'User',
  new mongoose.Schema({
    name: String,
    email: String,
    password: String,
  })
)

app.get('/', async (req, res) => {
  res.send('This is the body page')
})

app.get('/get-users', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err })
  }
})

// Ruta para añadir usuario
app.post('/add-user', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All field required' })
  }

  const user = new User({ name, email, password })
  await user.save()

  res.json({ message: 'User added', user })
})

// Iniciar servidor
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
)
