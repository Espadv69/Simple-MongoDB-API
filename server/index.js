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
  }),
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

// Ruta para actualizar usuario
app.put('/update-user/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, password } = req.body

    const updateUser = await User.findByIdAndUpdate(
      id,
      { name, email, password },
      { new: true },
    )

    if (!updateUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ message: 'User updated successfully', user: updateUser })
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err })
  }
})

// Ruta para borrar usuario
app.delete('/delete-user/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleteUser = await User.findByIdAndDelete(id)

    if (!deleteUser) {
      res.status(404).json({ message: 'User not found' })
    }

    res.json({ message: 'User delete successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err })
  }
})

// Iniciar servidor
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`),
)

// Manejo de cierre del servidor
const cleanUp = async () => {
  console.log('\n🔻 Closing server...')

  try {
    await mongoose.connection.close() // Cierra MongoDB sin callback
    console.log('🗑️ MongoDB connection closed.')
  } catch (err) {
    console.error('Error closing MongoDB:', err)
  }

  server.close(() => {
    console.log('✅ Server shut down.')
    process.exit(0)
  })
}

// Capturar señales para apagar el servidor limpiamente
process.on('SIGINT', cleanUp) // Ctrl + C en el terminal
process.on('SIGTERM', cleanUp) // Signal de sistemas tipo Linux
