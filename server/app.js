const path = require('path')
const express = require('express')
const serveIndex = require('serve-index')
const cors = require('cors');
const app = express()
const port = 3000

app.use(cors())

const dataDir = path.join(__dirname, '..', 'data');
const clientDir = path.join(__dirname, '..', 'client', 'dist');

app.use('/data', express.static(dataDir), serveIndex(dataDir, { 'icons': true }))

app.use('/', express.static(clientDir))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
