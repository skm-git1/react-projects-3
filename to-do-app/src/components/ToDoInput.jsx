import React from 'react'
import { useState } from 'react'
const ToDoInput = (props) => {
  const {handleAddTodo} = props
  const [inputVal, setinputVal] = useState('');
  return (
    <div className='input-container'>
      <input placeholder='Add task' value={inputVal} onChange={(e)=>{
        setinputVal(e.target.value)
      }}/>
      <button onClick={()=>{
        if(!inputVal) return;
        handleAddTodo(inputVal);
        setinputVal('');
      }}>
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  )
}

export default ToDoInput
