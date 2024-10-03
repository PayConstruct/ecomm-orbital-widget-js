require('dotenv').config()
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
// Enable CORS for all origins
app.use(cors())
app.use(express.json())

app.post('/orbital-invoice-widget', async (req, res) => {
  try {
    const response = await axios.post(
      process.env.API_URL || 'https://hpp.getorbital.io/invoice/widgets', // Use API URL from .env
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_KEY, // Use API key from .env
        },
      }
    )

    res.status(200).json(response.data)
  } catch (error) {
    res.status(500).json({
      message: 'Error sending request',
      error: error.response ? error.response.data : error.message,
    })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
