const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
app.use(express.json())

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
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
const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
)
