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

//Check invalid local storage data
function isTask(item: unknown): item is Task {
  if (typeof item !== 'object' || item === null) return false
  const task = item as Record<string, unknown>
  return typeof task.name === 'string' && typeof task.status === 'boolean'
}

//Get local storage data
const taskList: Task[] = (() => {
  try {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
    if (storedTasks) {
      const parsed: unknown = JSON.parse(storedTasks)
      if (Array.isArray(parsed) && parsed.every(isTask)) {
        return parsed
      }
      return parsed as Task[]
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
  // Unique id for each task
  const uniqueId = crypto.randomUUID()

  // Status label
  const label = document.createElement('label')
  label.textContent = task.name
  label.htmlFor = uniqueId

  //Checkbox
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.id = uniqueId
  checkbox.className = 'todo-elements__checkbox'
  checkbox.checked = task.status
  checkbox.addEventListener('change', () => {
    task.status = checkbox.checked
    saveTasksToStorage(taskList)
    if (task.status) {
      label.classList.add('completed')
    } else {
      label.classList.remove('completed')
    }
  })

  //Add elements to DOM
  newTask.appendChild(label)
  newTask.appendChild(checkbox)
  toDoList.appendChild(newTask)
}

// Add new task
function addToList(userInput: string): void {
  const trimmedInput = userInput.trim()
  if (!trimmedInput) {
    errorMsg.classList.remove('hidden')
    return
  }
  errorMsg.classList.add('hidden')

  const newTask: Task = { name: trimmedInput, status: false }
  taskList.push(newTask)
  saveTasksToStorage(taskList)
  renderTask(newTask)
  toDoInput.value = ''
}

//Event Listeners
const addTaskHandler = () => addToList(toDoInput.value)

toDoInput.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') addTaskHandler()
})

addButton.addEventListener('click', addTaskHandler)
