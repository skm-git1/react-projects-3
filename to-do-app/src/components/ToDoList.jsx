import React from 'react'
import ToDoCards from './ToDoCards'

const ToDoList = (props) => {
  const {todos, selectedTab} = props

  
  const filteredTodoList = selectedTab === 'All' ? todos : selectedTab === 'Completed' ? todos.filter(val => val.complete) : 
    todos.filter(val => !val.complete);
  return (
    <>
      {filteredTodoList.map((todo, todoIdx)=>{
        return(
          <ToDoCards key ={todoIdx} todo = {todo} todoIdx = {todos.findIndex(val => val.input == todo.input)} {...props}/>
        );
      })}
    </>
  )
}

export default ToDoList
