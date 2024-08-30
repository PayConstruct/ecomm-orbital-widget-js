const express = require('express')
const reload = require('reload')

const app = express()
const port = 3001

app.use(express.static('public'))
app.use(express.static('dist'))

app.listen(port, () => console.log(`Listening on port ${port}!`))
reload(app)
