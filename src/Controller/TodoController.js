import { Todo, SubTodo, User} from '../Models/TodoModels.js'
import { Op } from 'sequelize'
import bcryptjs from 'bcryptjs'
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
export const addSubTodo = async (req, res) => {
    try {
      const { id } = req.params;
      const { textSubTask, estimateSubTask, completed } = req.body;

      console.log("addSubTodo: id =", id);  
      console.log("addSubTodo: textSubTask =", textSubTask); 
      console.log("addSubTodo: estimateSubTask =", estimateSubTask); 
  
      if (!textSubTask || typeof textSubTask !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing textSubTask' });
      }
      if (!estimateSubTask || typeof estimateSubTask !== 'number' || estimateSubTask <= 0) {
        return res.status(400).json({ error: 'Invalid or missing estimateSubTask' });
      }
      const newSubTodo = await SubTodo.create({
        textSubTask,
        estimateSubTask,
        completed,
        todoId: id,
      });
      const updatedTask = await Todo.findByPk(id, {
        include: [{ model: SubTodo, as: "subTasks" }],
      });
      res.status(201).json(updatedTask);
    } catch (error) {
      console.error("Error adding sub todo:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
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
  
      res.status(200).json({ message: 'SubTodo Todo deleted successfully' })
    } catch (error) {
      console.error('Error deleting subTask todo:', error.message)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
  export const updateSubTodo = async (req, res)=>{
    try{
        const {id} = req.params
        const {completed} = req.body

        const subtodo = await SubTodo.findByPk(id)

        if(!subtodo)
        {
            res.status(404).json({message: 'SubTodo not found'})
        }
        subtodo.completed = completed

        await subtodo.save()
        res.status(200).json({message: 'update Subtodo succesfully', todo})
    }
    catch{
        console.log('Error updating Subtodo', error)
        res.status(500).json({message: 'Internal Server Error'})
    }
  }
 export const updateTodo = async (req, res)=>{
    try{
        const {id} = req.params
        const {completed} = req.body

        const todo = await Todo.findByPk(id)

        if(!todo)
        {
            res.status(404).json({message: 'Todo not found'})
        }
        todo.completed = completed

        await todo.save()
        res.status(200).json({message: 'update todo succesfully', todo})
    }
    catch{
        console.log('Error updating todo', error)
        res.status(500).json({message: 'Internal Server Error'})
    }
  }
  
  export const searchTodo = async (req, res) => {
      try {
          const { textTask } = req.body; 
  
          const todos = await Todo.findAll({ 
            attributes: ['id', 'textTask'],
              where: {
                  textTask: {
                      //[Op.like]: `%${textTask}%` 
                      [Op.eq] : textTask
                  }
              }
          });
  
          if (!todos || todos.length === 0) {
              return res.status(404).json({ message: 'Todo not found' });
          }

          res.status(200).json({ todos: todos, message: 'Successfully found Todos' });
      } catch (error) {
          console.error('Error searching todo:', error);
          res.status(500).json({ message: 'Internal Server Error' });
      }
}
export const signupAcc = async (req, res) => {
    try {
        console.log("Entering signupAcc function");
        const {email,userName,password,} = req.body;
        console.log("req.body", req.body)
  
        if (!email || !userName || !password) {
            console.log("email:", email, "userName:", userName, "password:", password);
            return res.status(400).json({success: false,message: "All fields are required"});
        }
        const userAlreadyExists = await User.findOne({
            where: {
                email: String(email)
            },
        });
        if (userAlreadyExists) {
            return res.status(400).json({success: false, message: "User already exists"});
        }
  
        const usernameAlreadyExists = await User.findOne({
            where: {
                userName: String(userName)
            },
        });
        if (usernameAlreadyExists) {
            return res.status(400).json({success: false,message: "Username already exists"});
        }
  
        const hashedPassword = await bcryptjs.hash(String(password), 10);
  
        const user = await User.create({
            email: String(email),
            userName: String(userName),
            password: hashedPassword,
        });
  
        return res.status(201)
            .json({
                success: true,
                message: "User created successfully",
                user: {
                    userId: user.userId,
                    email: user.email,
                    userName: user.userName,
                },
            });
    } catch (error) {
        console.error("Error signing user:", error);
        return res.status(500).json({success: false,message: "Internal Server Error"});
    }
  };
  export const loginAcc = async (req, res) =>{
    try {
        const {email,password,} = req.body;
        if (!email || !password) {
            return res.status(400).json({success: false,message: "Email or password incorect"});
        }
        //check email:
        const user = await User.findOne({where: {
            email: String(email)
        }})
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' }); // thong tin dang nhap khong hop le
        }

        //check pwd
        const checkPassword = bcryptjs.compare(String(password) , user.password)
        if(!checkPassword)
        {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        user.lastlogin = new Date()
        await user.save()

        return res.status(200).json({
            success: true,
            message: "Login successfully",
            user: {
                userId: user.userId,
                userName: user.userName,
                email: user.email,
                lastlogin: user.lastlogin
            }
        })

    } catch (error) {
        console.error('Error loginning Account', error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
  }
  export const logoutAcc = async (req, res) =>{
    return res.status(200).json({ success: true, message: 'Logout successfully' });
  }