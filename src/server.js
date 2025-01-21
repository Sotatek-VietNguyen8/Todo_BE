import express from 'express'
import TodoRouter from './Router/TodoRouter.js'
import cors from 'cors'


const app = express()
app.use(express.json())
app.use(cors())

const hostname = 'localhost'
const port = 5189

app.get('/', (req, res) => {
  res.send("TODO")
})

app.use('/', TodoRouter)

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`)
})
 