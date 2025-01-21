
import { Todo, SubTodo } from '../Models/TodoModels.js'
// Thêm Todo

export const addTodo = async (req, res) => {
    try {
        const { textTask, estimate } = req.body;

        if (!textTask || typeof textTask !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing textTask' });
        }
        if (!estimate || typeof estimate !== 'number' || estimate <= 0) {
            return res.status(400).json({ error: 'Invalid or missing estimate' });
        }
        
        const newTodo = await Todo.create({textTask, estimate});
        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error adding todo:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Xóa Todo (soft-delete)
export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Todo.destroy({ where: { id } });
        if (result === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.status(200).json({ message: 'Todo soft-deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const updateTodo = async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        console.log("taskId: ",taskId)
        const { textTask, estimate, completed, subTasks } = req.body; 
        console.log(req.body)
        const todo = await Todo.findByPk(taskId)
        if(!todo){
            return res.status(404).send(`Task with ID: ${taskId} not found`)
        }

        todo.textTask = textTask
        todo.estimate = estimate
        todo.completed = completed
        await todo.save()

        if(subTasks && subTasks.length > 0){
           await SubTodo.destroy({ where: { todoId: taskId }});
           await SubTodo.bulkCreate(
            subTasks.map((sub) => ({
              textSubTask: sub.text,
              estimateSubTask: sub.estimate,
              completed: sub.completed,
              todoId: taskId, 
            }))
          )
          
        }else{
           await SubTodo.destroy({where: {todoId: taskId}})
        }
        const updatedTask = await Todo.findByPk(taskId, {
            include: [{ model: SubTodo, as: 'subTasks' }]
        });
        res.status(200).json(updatedTask)
    } catch (error) {
        console.error("Error updating task:", error)
        res.status(500).json({ error: "Failed to update task" })
    }
}
  
export const deleteSubTodo = async (req, res) => {
    try {
      const { id, subTaskId } = req.params;
      console.log("taskId: ", id)
      console.log("SubTaskId: ", subTaskId)
  
      const parentTask = await Todo.findByPk(id)
      if (!parentTask) {
        return res.status(404).json({ message: 'Parent Task Not Found' })
      }
  
      const result = await SubTodo.destroy({ where: { id: subTaskId, todoId: id } })
      if (result === 0) {
        return res.status(404).json({ error: 'Sub Todo not found' });
      }
  
      res.status(200).json({ message: 'SubTodo Todo soft-deleted successfully' })
    } catch (error) {
      console.error('Error deleting subTask todo:', error.message)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }