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

interface clientTask {
  title: string
  due_date: string | null
  done: boolean
}

interface Task extends clientTask {
  id: string
}

// API endpoints
const API_URL_TODOS: string = 'https://api.todos.in.jt-lab.ch/todos'
// const CATEGORIES_API_ENDPOINT: string = 'https://api.todos.in.jt-lab.ch/categories'
// const CATEGORIES_TODO_API_ENDPOINT: string = 'https://api.todos.in.jt-lab.ch/categories_todos'

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

//Data type check
// function isTask(item: unknown): item is Task {
//   if (typeof item !== 'object' || item === null) return false
//   const task = item as Record<string, unknown>
//   return (
//     typeof task.id === 'string' &&
//     typeof task.title === 'string' &&
//     typeof task.due_date === 'string' || typeof task.due_date === null &&
//     typeof task.done === 'boolean'
//   )
// }

//API error handling
async function handleApiError(response: Response): Promise<void> {
  if (!response.ok) {
    let errorDetails = `HTTP Error ${response.status}: ${response.statusText}.`
    try {
      const errorBody = await response.json()
      errorDetails += ` Server Message: ${JSON.stringify(errorBody)}`
    } catch (e) {}
    throw new Error(errorDetails)
  }
}

//Get API data
async function getData<T>(apiURL: string): Promise<T[]> {
  try {
    const response = await fetch(apiURL, {
      method: 'GET',
    })

    await handleApiError(response)

    if (response.status === 204) {
      return [] as T[]
    }
    const fetchedData = await response.json()

    if (Array.isArray(fetchedData)) {
      return fetchedData as T[]
    }
    console.warn(`API at ${apiURL} returned data, but it was not an array`)
    return [] as T[]
  } catch (error) {
    console.error('Failed to fetch data', error)
    throw error
  }
}

//Post request
async function postData<Task>(
  apiURL: string,
  newDatas: clientTask | Task,
): Promise<Task | null> {
  try {
    const response = await fetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDatas),
    })
    await handleApiError(response)

    if (response.status === 204) {
      return null
    }
    const text = await response.text()
    if (!text) {
      return null
    }
    const createdData: unknown = JSON.parse(text)
    return createdData as Task
  } catch (error) {
    console.error(`Data failed to post to ${apiURL}: `, error)
    throw error
  }
}

//Patch request
async function patchData<C, R>(
  apiURL: string,
  id: string,
  updatedDatas: C,
): Promise<R | null> {
  const completeURL = `${apiURL}?${id}`
  try {
    const response = await fetch(completeURL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDatas),
    })
    await handleApiError(response)
    if (response.status === 204) {
      return null as R
    }

    const updatedResource: unknown = await response.json()
    return updatedResource as R
  } catch (error) {
    console.error(`Patch failed for task ${id} at ${completeURL}:`, error)
    throw error
  }
}

//Delete request
async function deleteData(apiURL: string, id: string): Promise<void> {
  const completeURL = `${apiURL}?${id}`
  try {
    const response = await fetch(completeURL, {
      method: 'DELETE',
    })
    await handleApiError(response)
  } catch (error) {
    console.error(`Delete failed for task ${id} at ${completeURL}:`, error)
    throw error
  }
}

await getData<Task>(API_URL_TODOS).then((tasks: Task[]) => {
  tasks.forEach((el) => {
    createTask(el)
    return
  })
})
//Not API
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
function createLabel(task: clientTask): HTMLLabelElement {
  const label = document.createElement('label')
  label.textContent = task.title
  label.classList.toggle('completed', task.done)
  return label
}

//Generate checkbox
function createCheckbox(task: clientTask): HTMLInputElement {
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'todo-elements__checkbox'
  checkbox.checked = task.done
  return checkbox
}

function deleteAllTask() {
  getData<Task>(API_URL_TODOS).then((tasks: Task[]) =>
    tasks.forEach((task) => {
      deleteData(API_URL_TODOS, task.id)
    }),
  )
}
//Generate delete button
function createDeleteBtn(task: clientTask): HTMLButtonElement {
  const deleteBtn = document.createElement('button')
  deleteBtn.type = 'button'
  deleteBtn.className = 'delete-btn'
  deleteBtn.textContent = 'X'
  deleteBtn.ariaLabel = `Delete task: ${task.title}`
  //Implement deletion in API here
  return deleteBtn
}

// Generate due dates
function createDate(task: clientTask): HTMLTimeElement {
  const taskDate = task.due_date
  const dueDate = document.createElement('time')
  dueDate.className = 'due-date'
  if (taskDate) {
    dueDate.dateTime = taskDate
    dueDate.textContent = taskDate
    dateColorSetUp(dueDate)
  } else {
    dueDate.textContent = 'No due date'
  }

  return dueDate
}

//To midnight normalization
function toMidnight(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}
// Patch tasks
function patchTasks(label: HTMLLabelElement, task: Task, status: boolean) {
  const updatePayload = { done: status }
  patchData(API_URL_TODOS, task.id, updatePayload)
  label.classList.toggle('completed', status)
  task.done = status
}

// Create the task on the dom
function createTask(task: Task): void {
  const checkbox = createCheckbox(task)
  const label = createLabel(task)
  const newTask = createNewTaskElements()
  const deleteBtn = createDeleteBtn(task)
  const dueDate = createDate(task)
  const checkboxLabelWrapper = document.createElement('p')
  const dueDateDeleteWrapper = document.createElement('p')
  newTask.id = task.id

  //Append elements
  dueDateDeleteWrapper.append(dueDate, deleteBtn)
  checkboxLabelWrapper.append(checkbox, label)
  newTask.append(checkboxLabelWrapper, dueDateDeleteWrapper)
  toDoList.appendChild(newTask)
}

async function addToList(): Promise<void> {
  const trimmed = toDoInput.value.trim()
  const selectedDate = dateInput.value
  const selectedMidnight = toMidnight(new Date(selectedDate))
  const todayMidnight = toMidnight(new Date())

  if (selectedDate && todayMidnight > selectedMidnight) {
    showError('Invalid date: date too early')
    return
  }
  if (trimmed.length === 0) {
    showError('Invalid task name: Empty name')
    return
  }

  hideError()

  const newTask: clientTask = {
    title: trimmed,
    due_date: selectedDate || null,
    done: false,
  }

  await postData<Task>(API_URL_TODOS, newTask)

  getData<Task>(API_URL_TODOS).then((tasks: Task[]) => {
    tasks.forEach((el: Task) => {
      const createdElement = document.getElementById(el.id)
      if (!createdElement) {
        createTask(el)
      }
      return
    })
  })

  toDoInput.value = ''
  dateInput.value = ''
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

// Delete all
const addTaskHandler = () => addToList()
const detectKey = (e: KeyboardEvent) => {
  if (e.key === 'Enter') addTaskHandler()
}

toDoInput.addEventListener('keydown', detectKey)
clearAllBtn.addEventListener('click', deleteAllTask)
addButton.addEventListener('click', addTaskHandler)
