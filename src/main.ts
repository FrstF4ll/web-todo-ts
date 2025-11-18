import './style.css'
// Time calculation
const dueSoonDaysThreshold = 4
const msInDay = 1000 * 60 * 60 * 24
const dueDateStatus = {
  PastDue: 'due-date--past-due',
  DueToday: 'due-date--due-today',
  DueSoon: 'due-date--due-soon',
  DueLater: 'due-date--due-later',
}

// Element null check
function getRequiredElement<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector)
  if (!el) throw new Error(`Element ${selector} not found`)
  return el
}
//Interface
interface Task {
  id: string
  title: string
  content: string
  due_date: string
  done: boolean
}

// Type
type TaskCreation = Omit<Task, 'id'>

// API endpoints
const TODOS_API_ENDPOINT = 'todos'
const CATEGORIES_API_ENDPOINT = 'categories'
const CATEGORIES_TODO_API_ENDPOINT = 'categories_todos'

// DOM
const toDoInput = getRequiredElement<HTMLInputElement>('#todo-input')
const addButton = getRequiredElement<HTMLButtonElement>('#add-todo-button')
const toDoList = getRequiredElement<HTMLUListElement>('ul')
const errorMsg = getRequiredElement<HTMLParagraphElement>('#error-msg')
const clearAllBtn = getRequiredElement<HTMLButtonElement>('#delete-all')
const dateInput = getRequiredElement<HTMLInputElement>('#todo-date-input')
const overdueMsg = getRequiredElement<HTMLHeadingElement>('#overdue-message')
// Show or hide error message
const showError = (message: string) => {
  errorMsg.classList.remove('hidden')
  errorMsg.textContent = message
}
const hideError = () => {
  errorMsg.classList.add('hidden')
  errorMsg.textContent = ''
}

//Check type of data, prevent invalid types
function isTask(item: unknown): item is Task {
  if (typeof item !== 'object' || item === null) return false
  const task = item as Record<string, unknown>
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.content === 'string' &&
    typeof task.due_date === 'string' &&
    typeof task.done === 'boolean'
  )
}

//Get API data
async function getTasks(getData: string) {
  const todoUrl = `https://api.todos.in.jt-lab.ch/${getData}`
  try {
    const response = await fetch(todoUrl)
    if (!response.ok) {
      throw new Error(`HTTP error, status :${response.status}`)
    }
    const fetchedData = await response.json()
    if (Array.isArray(fetchedData) && fetchedData.every(isTask)) {
      return fetchedData as Task[]
    }
    return []
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
  return []
}

console.log(getTasks('todos'))

function isOverdue() {
  const overduedTasks = document.querySelectorAll('.due-date--past-due')
  overdueMsg.classList.toggle('hidden', overduedTasks.length === 0)
}
isOverdue()

//Generate list elements
function createNewTaskElements(): HTMLLIElement {
  const newTask = document.createElement('li')
  newTask.className = 'todo-elements'
  return newTask
}

//Generate label
function createLabel(task: TaskCreation): HTMLLabelElement {
  const label = document.createElement('label')
  label.textContent = task.name
  label.classList.toggle('completed', task.status)
  return label
}

//Generate checkbox
function createCheckbox(task: TaskCreation): HTMLInputElement {
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'todo-elements__checkbox'
  checkbox.checked = task.status
  return checkbox
}

//Generate delete button
function createDeleteBtn(task: TaskCreation): HTMLButtonElement {
  const deleteBtn = document.createElement('button')
  deleteBtn.type = 'button'
  deleteBtn.className = 'delete-btn'
  deleteBtn.textContent = 'X'
  deleteBtn.ariaLabel = `Delete task: ${task.name}`
  //Implement deletion in API here

  return deleteBtn
}

// Generate due dates
function createDate(task: TaskCreation): HTMLTimeElement {
  const taskDate = task.date
  const dueDate = document.createElement('time')
  dueDate.className = 'due-date'
  dueDate.dateTime = taskDate
  if (taskDate) {
    dueDate.textContent = taskDate
    dateColorSetUp(dueDate)
  } else {
    dueDate.textContent = 'No due date'
  }

  return dueDate
}

// Rendering function
function renderTask(task: TaskCreation): void {
  const checkbox = createCheckbox(task)
  const label = createLabel(task)
  const newTask = createNewTaskElements()
  const deleteBtn = createDeleteBtn(task)
  const dueDate = createDate(task)
  const checkboxLabelWrapper = document.createElement('p')
  const dueDateDeleteWrapper = document.createElement('p')
  checkbox.addEventListener('change', () => {
    task.status = checkbox.checked
    saveTasksToStorage(taskList)
    label.classList.toggle('completed', checkbox.checked)
  })

  //Append elements
  dueDateDeleteWrapper.append(dueDate, deleteBtn)
  checkboxLabelWrapper.append(checkbox, label)
  newTask.append(checkboxLabelWrapper, dueDateDeleteWrapper)
  toDoList.appendChild(newTask)
}

//To midnight normalization
function toMidnight(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

//Dynamic color switch depending on due dates
function dueColor(dateString: string): string | null {
  const today = toMidnight(new Date())
  const selectedDate = toMidnight(new Date(dateString))
  const dayDiff = (selectedDate - today) / msInDay

  if (Number.isNaN(dayDiff)) {
    return null
  }

  if (dayDiff < 0) {
    return dueDateStatus.PastDue
  }
  if (dayDiff === 0) {
    return dueDateStatus.DueToday
  }
  if (dayDiff <= dueSoonDaysThreshold) {
    return dueDateStatus.DueSoon
  }
  return dueDateStatus.DueLater
}

function dateColorSetUp(dueDate: HTMLTimeElement): void {
  if (!dueDate.dateTime) {
    return
  }

  const verifiedTime = dueColor(dueDate.dateTime)
  if (verifiedTime) {
    dueDate.classList.add(verifiedTime)
  }
}

// Insert data
function addToList(userInput: string): void {
  const trimmedInput = userInput.trim()
  const todayMidnight = toMidnight(new Date())
  const selectedMidnight = toMidnight(new Date(dateInput.value))

  //Check later for eventual flaw in the logics
  if (dateInput.value && todayMidnight > selectedMidnight) {
    showError('Invalid date: date too early')
    return
  }

  if (!trimmedInput) {
    showError('Invalid task name: Empty name')
    return
  }
  hideError()

  // POST API Methods
}

// Delete all
function deleteAllTasks(): void {
  //DELETE(ALL) API  METHODS
}

clearAllBtn.addEventListener('click', deleteAllTasks)
const addTaskHandler = () => addToList(toDoInput.value)
const detectKey = (e: KeyboardEvent) => {
  if (e.key === 'Enter') addTaskHandler()
}
toDoInput.addEventListener('keydown', detectKey)

addButton.addEventListener('click', addTaskHandler)
