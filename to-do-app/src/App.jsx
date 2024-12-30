import Header from "./components/Header"
import Tabs from "./components/Tabs"
import ToDoInput from "./components/ToDoInput"
import ToDoList from "./components/ToDoList"
import { useEffect, useState } from "react"
function App() {

  const [todos, setTodos] = useState([
    { input: 'Hello! Add your first todo!', complete: true }
  ])

  const [selectedTab, setSelectedTab] = useState('Open');
  // const todos = [
  //   { input: 'Hello! Add your first todo!', complete: true },
  //   { input: 'Get the groceries!', complete: false },
  //   { input: 'Learn how to web design', complete: false },
  //   { input: 'Say hi to gran gran', complete: true },
  // ]

  function handleAddTodo(newTodo){
    const newTodoList = [...todos, {input: newTodo, complete: false}];
    setTodos(newTodoList);
    handleSaveData(newTodoList)
  }

  function handleEditTodo(index){
    // update/ edit/ modify
    let newTodoList = [...todos]
    let completedTodo = newTodoList[index]
    completedTodo.complete = true;
    newTodoList[index] = completedTodo;
    setTodos(newTodoList);
    handleSaveData(newTodoList)
  }
  function handleDeleteTodo(index){
    let newTodoList = todos.filter((val, valIdx)=>{
      return valIdx !== index;
    })
    setTodos(newTodoList)
    handleSaveData(newTodoList)
  }

  function handleSaveData(currTodos){
    localStorage.setItem('todo-app', JSON.stringify({todos: currTodos}))
  }

  useEffect(()=>{
    if(!localStorage || !localStorage.getItem('todo-app')) return;
    let db = JSON.parse(localStorage.getItem('todo-app'));
    setTodos(db.todos);
  }, [])

  return (
    <>
      <Header todos = {todos}/>
      <Tabs todos = {todos} selectedTab = {selectedTab} setSelectedTab = {setSelectedTab} />
      <ToDoList todos = {todos} handleEditTodo = {handleEditTodo} selectedTab={selectedTab} handleDeleteTodo = {handleDeleteTodo}/>
      <ToDoInput handleAddTodo = {handleAddTodo}/>
    </>
  )
}

export default App
