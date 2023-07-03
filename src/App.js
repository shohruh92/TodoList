
import './todo.css';
import React, { useEffect, useState } from 'react';
import { push, ref, getDatabase, remove, onValue, update } from 'firebase/database';
import './firebase';

function Todolist() {
  const [data,setData] = useState([]);
  const [item,setItem] = useState('');
  const [editingItem,setEditingItem] = useState(null)

  
  // let localDOmain = 'http://localhost:5505'

  // domain = localDOmain
  
  
  function addItem(e){
    e.preventDefault()
    setItem('')
    if (editingItem) {
      update(ref(getDatabase(),`todos/${editingItem.key}`),{
        name:item,
        date: new Date().toString()
      })
      setEditingItem(null)
    }else{
      push(ref(getDatabase(),`todos`),{
        name:item,
        date:new Date().toString()
      })
    }
  }
    
  function showButtons(it){
    document.getElementById(it.key).style.display = 'block'
  }

  function hideButtons(it){
    document.getElementById(it.key).style.display = 'none'
  }


  function deleteThis(it){
   remove(ref(getDatabase(),`todos/${it.key}`))
  }

  function editThis(it){
    setItem(it.val().name)
    setEditingItem(it)
  }

  useEffect(() => {
    onValue(ref(getDatabase(),`todos`),(todos) => {
      let todosArray = [];
      todos.forEach((todo) => {
        todosArray.push(todo)
      })
      let sorted = todosArray.sort((a,b) => {
        if (a.val().name > b.val().name) {
          return 1
        }
        if (a.val().name < b.val().name) {
          return -1
        }
        return 0
      })
      setData(sorted)
    })
  },[])


  return (
    <div className="App">
      <header className="App-header">


    <div className="parent" >
    <h1>To Do List</h1>
    <form className='form'
    onSubmit={addItem}>
     
    <input value={item}
    onChange={(event) => setItem(event.target.value) }
    placeholder='Add Info...'
    className="search-input" type="text"  required />
      <button type='submit'
      className="buttonadd button" >Add</button>
    </form>
    </div>

      <div className='items' >
        {
          data.map((item,index) => {
              return <div 
              onMouseOver={() => showButtons(item,index)}
              onMouseLeave={() => hideButtons(item,index)}
              className='item'
              key={index}>
                <div>
                  {index+1}. 
                  {item.val().name}
                </div>
             <div id={item.key} style={{display:'none'}} >
             <button className="button" onClick={() => deleteThis(item)} >delete</button>
              <button className="button" onClick={() => editThis(item)} >edit</button>
             </div>
              </div>
          })
        }
      </div>

      </header>
    </div>
  );
}

export default Todolist;