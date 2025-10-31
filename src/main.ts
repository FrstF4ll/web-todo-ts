import './style.css'
//Types
type GlobalBtnEvent = KeyboardEvent | MouseEvent
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
const errorMsg = getRequiredElement<HTMLParagraphElement>('#error-msg')

function addToList(e: GlobalBtnEvent): void {
  if (
    (e instanceof KeyboardEvent && e.key === 'Enter') ||
    e instanceof MouseEvent
  ) {
    if (!toDoInput.value.trim()) {
      errorMsg.classList.remove('hidden')
    } else {
      errorMsg.classList.add('hidden')
      const newTask = document.createElement('li')
      newTask.className = 'todo-elements'
      newTask.textContent = toDoInput.value.trim()
      toDoList.appendChild(newTask)
      toDoInput.value = ''
    }
  }
}

toDoInput.addEventListener('keydown', addToList)
addButton.addEventListener('click', addToList)
