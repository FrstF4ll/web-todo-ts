import './style.css'

// Element null check
function getRequiredElement<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector)
  if (!el) throw new Error(`Element ${selector} not found`)
  return el
}

// DOM
const toDoInput = getRequiredElement<HTMLInputElement>('#todo-input')
const addButton = getRequiredElement<HTMLButtonElement>('#add-todo-button')
const toDoList = getRequiredElement<HTMLUListElement>('ul')
const errorMsg = getRequiredElement<HTMLParagraphElement>('#error-msg')
const TASKS_STORAGE_KEY = 'tasks'

//Interface
interface Task {
  name: string
  status: boolean
}

//Local storage loading with error check
const taskList: Task[] = (() => {
  try {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
    if (storedTasks) {
      const parsed: unknown = JSON.parse(storedTasks)
      if (
        Array.isArray(parsed) &&
        parsed.every(
          (item) =>
            typeof item === 'object' &&
            item !== null &&
            'name' in item &&
            'status' in item,
        )
      ) {
        return parsed as Task[]
      }
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error)
  }
  return []
})()

//Task saving to localStorage
function saveTasksToStorage(tasks: Task[]): void {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
}

//Task rendering
taskList.forEach(renderTask)

// Rendering function
function renderTask(task: Task): void {
  const newTask = document.createElement('li')
  newTask.className = 'todo-elements'
  newTask.textContent = task.name

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'checkbox'
  checkbox.checked = task.status
  checkbox.addEventListener('change', () => {
    task.status = checkbox.checked
    saveTasksToStorage(taskList)
  })

  newTask.appendChild(checkbox)
  toDoList.appendChild(newTask)
}

// Check if input is empty
function isEmpty(text: string): boolean {
  if (!text.trim()) {
    errorMsg.classList.remove('hidden')
    return true
  }
  errorMsg.classList.add('hidden')
  return false
}

// Add new task
function addToList(userInput: string): void {
  if (isEmpty(userInput)) return

  const newTask: Task = { name: userInput, status: false }
  taskList.push(newTask)
  saveTasksToStorage(taskList)
  renderTask(newTask)
  toDoInput.value = ''
}

// Event listeners
toDoInput.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') addToList(toDoInput.value)
})

addButton.addEventListener('click', () => addToList(toDoInput.value))
