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
const errorMsg = getRequiredElement<HTMLParagraphElement>('#error-msg')
const taskList: string[] = JSON.parse(localStorage.getItem('tasks') || '[]')
taskList.forEach(renderTask)
const TASKS_STORAGE_KEY = 'tasks'

//Rendering
function renderTask(taskText: string): void {
  const newTask = document.createElement('li')
  newTask.className = 'todo-elements'
  newTask.textContent = taskText
  toDoList.appendChild(newTask)
}

//Validation
function addToList(): void {
  const taskText = toDoInput.value.trim()
  if (!taskText) {
    errorMsg.classList.remove('hidden')
    return
  }
  errorMsg.classList.add('hidden')

  // Storage update
  taskList.push(taskText)
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(taskList))

  renderTask(taskText)
  toDoInput.value = ''
  return
}

toDoInput.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    addToList()
  }
})
addButton.addEventListener('click', addToList)
