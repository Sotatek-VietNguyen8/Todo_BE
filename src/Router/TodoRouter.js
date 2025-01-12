import express from 'express'
import { addTodo, deleteTodo } from '../Controller/TodoController.js'

const router = express.Router()

router.post('/post', addTodo)
router.delete('/delete/:id', deleteTodo)

export default router