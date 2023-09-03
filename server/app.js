const path = require('path')
const express = require('express')
const serveIndex = require('serve-index')
const cors = require('cors');
const app = express()
const port = 3000

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const dataDir = path.join(__dirname, '..', 'data');

app.use('/data', express.static(dataDir), serveIndex(dataDir, { 'icons': true }))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
