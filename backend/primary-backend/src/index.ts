import { Request, Response } from "express"
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})
app.use(bodyParser.json())
app.use('/product')

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})