import { useState, useEffect } from 'react'
import x from '../public/xmark-solid.svg'

const App = () => {

  // Declare state hooks for task arrays
  const [toDo, setToDo] = useState([])
  const [inProgress, setInProgress] = useState([])
  const [done, setDone] = useState([])

  // Declare state hook for modal toggling
  const [modal, setModal] = useState(false)

  // Declare state hooks for input variables
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTask, setSelectedTask] = useState({})

  // Declare cache identifiers
  const toDoCache = localStorage.getItem('to-do')
  const inProgressCache = localStorage.getItem('in-progress')
  const doneCache = localStorage.getItem('done')

  // If cache exists, retrieve cached arrays
  useEffect(() => {
    if (toDoCache) {
      setToDo(JSON.parse(toDoCache))
    } 
    if (inProgressCache) {
      setInProgress(JSON.parse(inProgressCache))
    }
    if (doneCache) {
      setDone(JSON.parse(doneCache))
    }
  }, [])

  // Send arrays to cache whenever arrays are altered
  useEffect(() => {
    localStorage.setItem('to-do', JSON.stringify(toDo))
  }, [toDo])
  useEffect(() => {
    localStorage.setItem('in-progress', JSON.stringify(inProgress))
  }, [inProgress])
  useEffect(() => {
    localStorage.setItem('done', JSON.stringify(done))
  }, [done])


  // Add user input to toDo array
  const submit = (e) => {
    e.preventDefault()
    const id = Math.random().toString(16).slice(2)
    const task = {
      title, 
      dueDate, 
      description, 
      id
    }
    const newToDo = [...toDo, task];
    setToDo(newToDo);
    setModal(false)
  }

  // Display list of boxes with task data
  const list = (tasks, setTasks) => {
    return tasks.map((task) => {
      const date = new Date()
      const dueDate = new Date(task.dueDate)
      const differenceInHours = (dueDate - date)/3600000
      const day = dueDate.getDate() + 1
      const month = dueDate.getMonth() + 1
      const year = dueDate.getFullYear()
      const formattedDueDate = `${month}/${day}/${year}`
  
      let status
      if (date > dueDate) {
        status = 'past-due'
      } else {
        if (differenceInHours <= 24) {
          status = 'due-today'
        } else {
          status = 'due-in-future'
        }
      }
      
      // Select task ID when you begin dragging box
      const selectTask = () => {
        setSelectedTask(task)
      }

      const id = task.id

      // Delete task from parent array
      const deleteTask = () => {
        setTasks(tasks.filter(task => task.id !== id))
      }
  
      return (
        <li className={`task ${status}`} key={id} draggable onDragStart={selectTask}>
          <h1>{task.title}</h1>
          <h2>{status.replace('-', ' ')}</h2>
          <h2>{formattedDueDate}</h2>
          <button onClick={deleteTask}>Delete</button>
        </li>
      )
    })
  }

  // Delete task with selected task ID
  const deleteTask = () => {
    setToDo(toDo.filter(task => task.id !== selectedTask.id))
    setInProgress(inProgress.filter(task => task.id !== selectedTask.id))
    setDone(done.filter(task => task.id !== selectedTask.id))
  }

  // Allow drop functionality
  const dragOver = (e) => {
    e.preventDefault()
  }

  // Move task to corresponding array by dragging and dropping
  const toDoDrop = () => {
    deleteTask()
    const newToDo = [...toDo, selectedTask];
    setToDo(newToDo);
  }
  const inProgressDrop = () => {
    deleteTask()
    const newInProgress = [...inProgress, selectedTask];
    setInProgress(newInProgress);
  }
  const doneDrop = () => {
    deleteTask()
    const newDone = [...done, selectedTask]
    setDone(newDone)
  }

  return (
    <div className="task-board">
      <header>
        <h1>React Task Board</h1>
      </header>
      {modal == true && 
        <div className='modal-container'>
          <form onSubmit={submit} className="modal">
            <header>
              <h1>Add Task</h1>
              <div onClick={() => setModal(false)}>
                <img src={x}/>
              </div>
            </header>
            <div className='title-due-date'>
              <div>
                <h2>Title</h2>
                <input onChange={(e) => {setTitle(e.target.value)}} required/>
              </div>
              <div>
                <h2>Due Date</h2>
                <input type='date' onChange={(e) => {setDueDate(e.target.value)}} required/>
              </div>
            </div>
            <div className='description'>
              <h2>Description</h2>
              <textarea onChange={(e) => {setDescription(e.target.value)}} required/>
            </div>
            <button onSubmit={submit}>Add Task</button>
          </form>
        </div>
      }
      <div className="content">
        <button onClick={() => setModal(true)}>Add Task</button>
        <div className='columns'>
          <div className='column'>
            <header>
              <h1>To Do</h1>
            </header>
            <div>
              <ul onDrop={toDoDrop} onDragOver={dragOver}>{list(toDo, setToDo)}</ul>
            </div>
          </div>
          <div className='column'>
            <header>
              <h1>In Progress</h1>
            </header>
            <div>
              <ul onDrop={inProgressDrop} onDragOver={dragOver}>{list(inProgress, setInProgress)}</ul>
            </div>
          </div>
          <div className='column'>
            <header>
              <h1>Done</h1>
            </header>
            <div>
              <ul onDrop={doneDrop} onDragOver={dragOver}>{list(done, setDone)}</ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
