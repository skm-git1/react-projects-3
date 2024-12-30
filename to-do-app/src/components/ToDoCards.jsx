import React from 'react'

const ToDoCards = (props) => {
  const {todo, todoIdx, handleDeleteTodo, handleEditTodo} = props;
  // const todo = todos[todoIdx];
  // console.log(todo)
  return (
    <div className='card todo-item'>
      <p>{todo.input}</p>
      <div className='todo-buttons'>
        <button onClick={()=>{
          handleEditTodo(todoIdx);
        }} disabled={todo.complete} >
          <h6>Done</h6>
        </button>
        <button onClick={()=>{
          handleDeleteTodo(todoIdx);
        }}>
          <h6>Delete</h6>
        </button>
      </div>
    </div>
  )
}

export default ToDoCards
