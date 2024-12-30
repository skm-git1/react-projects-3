import React from 'react'

const Header = (props) => {
  const {todos} = props;
  var todosLength = todos.length;
  const taskOrTasks = todos.length === 1 ? 'task' : 'tasks';
  return (
    <header>
      <h1 className='text-gradient'>You have {todosLength} {taskOrTasks}.</h1>
    </header>
  )
}

export default Header
