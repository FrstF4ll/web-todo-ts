import './style.css'

// Get elements from HTML
const toDoInput = document.querySelector<HTMLInputElement>('#todo-input')!
const addButton = document.querySelector<HTMLButtonElement>('#add-todo-button')!
const toDoList = document.querySelector<HTMLUListElement>('ul')!

const errorMsg = document.createElement('p')
errorMsg.innerText = 'Error'
toDoInput.parentNode!.insertBefore(errorMsg, toDoInput)

function addToList(e: KeyboardEvent): void {
  if (e.key === 'Enter' || e.button === 'click') { 
    const regex = /^\s*$/ // Match 0 or more whitespace
    if (!toDoInput.value || regex.test(toDoInput.value)) {
    } else {
      toDoList.innerHTML += `<li id="todo-elements">${toDoInput.value}</li>`
    }
  }
}

toDoInput.addEventListener('click', addToList)
addButton.addEventListener('keydown', addToList)
