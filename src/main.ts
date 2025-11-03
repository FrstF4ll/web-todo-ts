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
const TASKS_STORAGE_KEY = 'tasks'
let taskList: string[] = []

// Error handling, prevent app from crashing if invalid JSON data
try {
  const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
  if (storedTasks) {
    const parsed: unknown = JSON.parse(storedTasks)
    if (
      Array.isArray(parsed) &&
      parsed.every((item) => typeof item === 'string')
    )
      taskList = parsed
  } else {
    throw new Error('Tasks data is not an array')
  }
} catch (error) {
  console.error('Failed to load tasks from localStorage:', error)
  taskList = []
}

taskList.forEach(renderTask)

//Rendering
function renderTask(taskText: string): void {
  const newTask = document.createElement('li')
  newTask.className = 'todo-elements'
  newTask.textContent = taskText
  toDoList.appendChild(newTask)
}

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
}

toDoInput.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    addToList()
  }
})
addButton.addEventListener('click', addToList)
