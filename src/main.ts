import './style.css'

// Get elements from HTML
const toDoInput = document.querySelector<HTMLInputElement>('#todo-input')!
const addButton = document.querySelector<HTMLButtonElement>('#add-todo-button')!
const toDoList = document.querySelector<HTMLUListElement>('ul')!

function addToList(e: KeyboardEvent): any {
  if (e.key === 'Enter') {
    const regex = /^\s*$/ 
    !toDoInput.value || regex.test(toDoInput.value)  
    ? console.log("Invalid input")
    :    toDoList.innerHTML += `<li id="todo-elements">${toDoInput.value}</li>`
    }
  }

toDoInput.addEventListener('keydown', addToList)
addButton.addEventListener('keydown', addToList)
