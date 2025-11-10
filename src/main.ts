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
const clearAllBtn = getRequiredElement<HTMLButtonElement>('#delete-all')

const TASKS_STORAGE_KEY = 'tasks'

//Interface
interface Task {
  id: string
  name: string
  status: boolean
}

//Check invalid local storage data
function isTask(item: unknown): item is Task {
  if (typeof item !== 'object' || item === null) return false
  const task = item as Record<string, unknown>
  return (
    typeof task.name === 'string' &&
    typeof task.status === 'boolean' &&
    typeof task.id === 'string'
  )
}

//Get local storage data
const taskList: Task[] = (() => {
  try {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
    if (storedTasks) {
      const parsed: unknown = JSON.parse(storedTasks)
      if (Array.isArray(parsed) && parsed.every(isTask)) {
        return parsed as Task[]
      }
      return []
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

  // Status label
  const label = document.createElement('label')
  label.textContent = task.name
  label.htmlFor = task.id

  //Checkbox
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'todo-elements__checkbox'
  checkbox.checked = task.status
  checkbox.id = task.id

  if (task.status) {
    label.classList.add('completed')
  } else {
    label.classList.remove('completed')
  }

  checkbox.addEventListener('change', () => {
    task.status = checkbox.checked
    saveTasksToStorage(taskList)
    label.classList.toggle('completed')
  })

  // Delete button
  const deleteBtn = document.createElement('button')
  deleteBtn.type = 'button'
  deleteBtn.className = 'delete-btn'
  deleteBtn.textContent = 'X'
  deleteBtn.ariaLabel = `Delete task: ${task.name}`

  deleteBtn.addEventListener('click', () => {
    const taskIndex = taskList.findIndex((obj) => obj.id === task.id)
    if (taskIndex > -1) {
      taskList.splice(taskIndex, 1)
    }
    saveTasksToStorage(taskList)
    newTask.remove()
  })

  //Add elements to DOM
  const taskContent = document.createElement('div')
  taskContent.append(checkbox, label)
  newTask.append(taskContent, deleteBtn)
  toDoList.appendChild(newTask)
}

// Add new task
function addToList(userInput: string): void {
  const uniqueId = crypto.randomUUID()
  const trimmedInput = userInput.trim()
  if (!trimmedInput) {
    errorMsg.classList.remove('hidden')
    return
  }
  errorMsg.classList.add('hidden')

  const newTask: Task = { name: trimmedInput, status: false, id: uniqueId }
  taskList.push(newTask)
  saveTasksToStorage(taskList)
  renderTask(newTask)
  toDoInput.value = ''
}
// Delete all
function deleteAllTasks(): void {
  if (taskList.length === 0) {
    return
  }
  if (!window.confirm('Are you sure you want to delete all tasks?')) {
    return
  }
  taskList.length = 0
  saveTasksToStorage(taskList)
  toDoList.replaceChildren()
}
clearAllBtn.addEventListener('click', deleteAllTasks)
//Event Listeners
const addTaskHandler = () => addToList(toDoInput.value)
toDoInput.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') addTaskHandler()
})

addButton.addEventListener('click', addTaskHandler)
