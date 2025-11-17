import './style.css'

// Element null check
function getRequiredElement<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector)
  if (!el) throw new Error(`Element ${selector} not found`)
  return el
}
//Interface
interface Task {
  id: string
  name: string
  status: boolean
  date: string
}

//Storage keys
const TASKS_STORAGE_KEY = 'tasks'

// DOM
const toDoInput = getRequiredElement<HTMLInputElement>('#todo-input')
const addButton = getRequiredElement<HTMLButtonElement>('#add-todo-button')
const toDoList = getRequiredElement<HTMLUListElement>('ul')
const errorMsg = getRequiredElement<HTMLParagraphElement>('#error-msg')
const clearAllBtn = getRequiredElement<HTMLButtonElement>('#delete-all')
const dateInput = getRequiredElement<HTMLInputElement>('#todo-date-input')

// Show or hide error message
const showError = (message: string) => {
  errorMsg.classList.remove('hidden')
  errorMsg.textContent = message
}
const hideError = () => {
  errorMsg.classList.add('hidden')
  errorMsg.textContent = ''
}

//Check invalid local storage data
function isTask(item: unknown): item is Task {
  if (typeof item !== 'object' || item === null) return false
  const task = item as Record<string, unknown>
  return (
    typeof task.name === 'string' &&
    typeof task.status === 'boolean' &&
    typeof task.id === 'string' &&
    typeof task.date === 'string'
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

//Generate list elements
function createNewTaskElements(): HTMLLIElement {
  const newTask = document.createElement('li')
  newTask.className = 'todo-elements'
  return newTask
}

//Generate label
function createLabel(task: Task): HTMLLabelElement {
  const label = document.createElement('label')
  label.textContent = task.name
  label.htmlFor = task.id
  label.classList.toggle('completed', task.status)
  return label
}

//Generate checkbox
function createCheckbox(task: Task): HTMLInputElement {
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'todo-elements__checkbox'
  checkbox.checked = task.status
  checkbox.id = task.id
  return checkbox
}

//Generate delete button
function createDeleteBtn(task: Task): HTMLButtonElement {
  const deleteBtn = document.createElement('button')
  deleteBtn.type = 'button'
  deleteBtn.className = 'delete-btn'
  deleteBtn.textContent = 'X'
  deleteBtn.ariaLabel = `Delete task: ${task.name}`

  function deleteAction(): void {
    const taskIndex = taskList.findIndex((obj) => obj.id === task.id)
    if (taskIndex > -1) {
      taskList.splice(taskIndex, 1)
    }

    saveTasksToStorage(taskList)
    deleteBtn.closest('.todo-elements')?.remove()
  }

  deleteBtn.addEventListener('click', deleteAction)
  return deleteBtn
}

// Generate due dates
function createDate(task: Task): HTMLTimeElement {
  const taskDate = task.date
  const dueDate = document.createElement('time')
  dueDate.className = 'due-date'
  dueDate.dateTime = taskDate
  dateColorSetUp(dueDate)
  if (taskDate) {
    dueDate.textContent = taskDate
  } else {
    dueDate.textContent = 'No due date'
  }

  return dueDate
}

// Rendering function
function renderTask(task: Task): void {
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
function dateColorSetUp(dueDate: HTMLTimeElement): void {
  const today = toMidnight(new Date())
  const selectedDate = toMidnight(new Date(dueDate.dateTime))
  const dayDiff = (selectedDate - today) / (1000 * 60 * 60 * 24)
  const dateColor = (c: string) => {
    dueDate.style.backgroundColor = c
  }
  console.log(today, selectedDate, dayDiff)
  dueDate.style.color = 'black'
  if (dueDate.dateTime && !isNaN(dayDiff)) {
    if (dayDiff < 0) {
      dateColor('red')
    } else if (dayDiff === 0) {
      dateColor('orange')
    } else if (dayDiff <= 4) {
      dateColor('#EBDF07')
    } else {
      dateColor('#BEF500')
    }
  }
}

// Insert data
function addToList(userInput: string): void {
  const uniqueId = crypto.randomUUID()
  const trimmedInput = userInput.trim()
  const todayMidnight = toMidnight(new Date())
  const selectedMidnight = toMidnight(new Date(dateInput.value))
  if (dateInput.value && todayMidnight > selectedMidnight) {
    showError('Invalid date: date too early')
    return
  }

  if (!trimmedInput) {
    showError('Invalid task name: Empty name')
    return
  }
  hideError()

  const newTask: Task = {
    name: trimmedInput,
    status: false,
    id: uniqueId,
    date: dateInput.value,
  }
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
const addTaskHandler = () => addToList(toDoInput.value)
const detectKey = (e: KeyboardEvent) => {
  if (e.key === 'Enter') addTaskHandler()
}
toDoInput.addEventListener('keydown', detectKey)

addButton.addEventListener('click', addTaskHandler)
