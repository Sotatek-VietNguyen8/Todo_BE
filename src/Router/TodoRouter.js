import express from 'express';
import {  addTodo, deleteSubTodo, deleteTodo, updateTodo } from '../Controller/TodoController.js';

const router = express.Router();

router.post('/post', addTodo);
router.delete('/delete/:id', deleteTodo);
router.put('/update/:id', updateTodo);
router.delete('/delete/:id/:subTaskId', deleteSubTodo);
export default router;
