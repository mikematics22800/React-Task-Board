import { useState, useEffect } from 'react'
import x from '../public/xmark-solid.svg'

const App = () => {

  const [tasks, setTasks] = useState([])
  const [modal, setModal] = useState(false)
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const cache = localStorage.getItem('tasks')
    if (cache) {
      setTasks(JSON.parse(cache))
    }
  }, [])

  const submit = (e) => {
    e.preventDefault()
    const id = Math.random().toString(16).slice(2)
    const task = {
      title, 
      dueDate, 
      description, 
      id
    }
    tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(task))
  }

  return (
    <div className="task-board">
      <header>
        <h1>React Task Board</h1>
      </header>
      {modal == true && 
        <div className='modal-container'>
          <form className="modal">
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
        <div className="columns">
          <button onClick={() => setModal(true)}>Add Task</button>
        </div>
    </div>
  )
}

export default App
