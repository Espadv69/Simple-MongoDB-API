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
