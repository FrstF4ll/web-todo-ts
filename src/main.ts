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

// Error handling, prevent app from crashing if invalid JSON data
const taskList: string[] = (() => {
  try {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
    if (storedTasks) {
      const parsed: unknown = JSON.parse(storedTasks)
      if (
        Array.isArray(parsed) &&
        parsed.every((item) => typeof item === 'string')
      ) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error)
  }
  return []
})()

function saveTasksToStorage(tasks: string[]): void {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
}

taskList.forEach(renderTask)

//Rendering
function renderTask(userInput: string): void {
  //List element
  const newTask = document.createElement('li')
  newTask.className = 'todo-elements'
  newTask.textContent = userInput
  toDoList.appendChild(newTask)
  renderCheckbox(newTask)
}

function renderCheckbox(userTask: any): void{
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'checkbox'
  userTask.appendChild(checkbox)
}

//Add to list
function addToList(userInput: string): void {
  taskList.push(userInput)
  saveTasksToStorage(taskList)
  renderTask(userInput)
  toDoInput.value = ''
}

//Check if empty
function isEmpty(): void {
  const taskText = toDoInput.value.trim()

  if (!taskText) {
    errorMsg.classList.remove('hidden')
  } else {
    errorMsg.classList.add('hidden') // optional: hide the message again
    addToList(taskText)
  }
}

toDoInput.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    isEmpty()
  }
})
addButton.addEventListener('click', isEmpty)
