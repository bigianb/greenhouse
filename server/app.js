const path = require('path')
const express = require('express')
var cors = require('cors');
const app = express()
const port = 3000

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/data', express.static(path.join(__dirname, '..', 'data')))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
