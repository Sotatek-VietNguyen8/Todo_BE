import express from 'express'
import {  addSubTodo, addTodo, deleteSubTodo, deleteTodo, updateSubTodo, updateTodo, searchTodo, signupAcc, loginAcc, logoutAcc } from '../Controller/TodoController.js'

const router = express.Router()

router.post('/post', addTodo)
router.delete('/delete/:id', deleteTodo)
router.post('/addSubTodo/:id', addSubTodo)
router.delete('/delete/:id/:subTaskId', deleteSubTodo)

router.put('subtodos/:id',updateSubTodo)
router.post('/search',searchTodo)

router.post('/signup', signupAcc)
router.post('/login', loginAcc)
router.get('/logout',logoutAcc)
export default router;
