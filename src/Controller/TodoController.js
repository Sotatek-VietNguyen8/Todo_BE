import TodoModels from '../Models/TodoModels.js'
import Todo from '../Models/TodoModels.js'

export const addTodo = async (req, res) => {
    try {
        const { text } = req.body
        //console.log("Received task:", text)
        const newTodo = await TodoModels.create({ text, completed: false, is_deleted: false })
        res.status(201).json({ id: newTodo.id, text, completed: false, is_deleted: false })
    } catch (error) {
        console.error("Error in addTodo:", error.message)
        res.status(500).json({ error: error.message })
    }
}
export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params
        //console.log("ID to delete: ", id)
        const result = await Todo.update({ is_deleted: true }, { where: { id } })
        //console.log("update result: ", result)
        if(result[0] === 0){
            return res.status(404).json({error: "Todo not found!"})
        }
        res.status(200).json({ message: 'Todo soft-deleted successfully' })
    } catch (error) {
        console.log("Error deleting todo: ", error.message)
        res.status(500).json({ error: error.message })
    }
}
