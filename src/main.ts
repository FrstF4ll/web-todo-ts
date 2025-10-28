import './style.css'

// Element null check
function getRequiredElement<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector)
  if (!el) throw new Error(`Element ${selector} not found`)
  return el
}
// Get elements from HTML

const toDoInput = getRequiredElement<HTMLInputElement>('#todo-input')
const addButton = getRequiredElement<HTMLButtonElement>('#add-todo-button')
const toDoList = getRequiredElement<HTMLUListElement>('ul')

const errorMsg = document.createElement('p')
errorMsg.style.display = 'none'
toDoInput.parentNode?.insertBefore(errorMsg, toDoInput)

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
