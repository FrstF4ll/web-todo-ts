import './style.css'

// Get elements from HTML
const toDoInput = document.querySelector<HTMLInputElement>('#todo-input')!
const addButton = document.querySelector<HTMLButtonElement>('#add-todo-button')!
const toDoList = document.querySelector<HTMLUListElement>('ul')!

const errorMsg = document.createElement('p')
errorMsg.style.display = 'none'
toDoInput.parentNode!.insertBefore(errorMsg, toDoInput)

function addToList(e: KeyboardEvent): void {
  if (e.key === 'Enter') {
    const regex = /^\s*$/ // Match 0 or more whitespace
    if (!toDoInput.value || regex.test(toDoInput.value)) {
      errorMsg.style.display = 'block'
      errorMsg.innerText = 'Error'
    } else {
      errorMsg.style.display = 'none'
      toDoList.innerHTML += `<li id="todo-elements">${toDoInput.value}</li>`
    }
  }
}

function addToListByClick(): void {
  const regex = /^\s*$/ // Match 0 or more whitespace
  if (!toDoInput.value || regex.test(toDoInput.value)) {
errorMsg.style.display = 'block'
    errorMsg.innerText = 'Error'
  } else {
    errorMsg.style.display = 'none'
    toDoList.innerHTML += `<li id="todo-elements">${toDoInput.value}</li>`
  }
}

toDoInput.addEventListener('keydown', addToList)
addButton.addEventListener('click', addToListByClick)
