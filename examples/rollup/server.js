const express = require('express')
const path = require('path')
const reload = require('reload')

const app = express()
const port = 3001

// Serve static files
app.use(express.static('public'))
app.use(express.static('dist'))

app.get(['/', '/form'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'))
})

app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'payment.html'))
})

app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'success.html'))
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
reload(app)
