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

// DOM import
import {
  addButton,
  clearAllBtn,
  dateInput,
  hideError,
  overdueMsg,
  showError,
  toDoInput,
  toDoList,
} from './dom'
import type { ClientTask, Task } from './interface'

// API endpoints
export const API_URL_TODOS: string = 'https://api.todos.in.jt-lab.ch/todos'
// const CATEGORIES_API_ENDPOINT: string = 'https://api.todos.in.jt-lab.ch/categories'
// const CATEGORIES_TODO_API_ENDPOINT: string = 'https://api.todos.in.jt-lab.ch/categories_todos'

//API error handling
async function handleApiError(response: Response): Promise<void> {
  if (!response.ok) {
    let errorDetails = `HTTP Error ${response.status}: ${response.statusText}.`
    try {
      const errorBody = await response.json()
      errorDetails += ` Server Message: ${JSON.stringify(errorBody)}`
    } catch (parseError) {
      console.error(`Query failed : ${parseError}`)
    }
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
async function postData<T>(
  apiURL: string,
  newDatas: ClientTask,
): Promise<T | null> {
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
    return createdData as T
  } catch (error) {
    console.error(`Data failed to post to ${apiURL}: `, error)
    throw error
  }
}

//Patch request
export async function patchData<C, R>(
  apiURL: string,
  id: number,
  updatedDatas: C,
): Promise<R | null> {
  const completeURL = `${apiURL}?id=eq.${id}`
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
async function deleteData(apiURL: string, id: number): Promise<void> {
  const completeURL = `${apiURL}?id=eq.${id}`
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
// Delete request
async function deleteAllData(apiURL: string): Promise<void> {
  const completeURL = `${apiURL}`
  try {
    const response = await fetch(completeURL, {
      method: 'DELETE',
    })
    await handleApiError(response)
  } catch (error) {
    console.error(`Delete failed at ${completeURL}:`, error)
    throw error
  }
}

// Loading tasks
try {
  const tasks = await getData<Task>(API_URL_TODOS)
  tasks.forEach(createTask)
} catch (error) {
  console.error('Failed to load initial tasks:', error)
  showError('Could not load tasks. Check console for details')
}

//Not API
function isOverdue() {
  const overduedTasks = document.querySelectorAll('.due-date--past-due')
  overdueMsg.classList.toggle('hidden', overduedTasks.length === 0)
}
isOverdue()

async function deleteAllTask() {
  try {
    if (toDoList.children.length === 0) {
      showError('Todo-list already clean.')
      return
    }
    if (!window.confirm('Are you sure you want to delete all tasks?')) {
      return
    }
    await deleteAllData(API_URL_TODOS)
    toDoList.innerHTML = ''
    showError('All tasks successfully deleted')
  } catch (error) {
    console.error('Failed to delete Tasks : ', error)
    showError('Failed to delete all Tasks, check console for details.')
  }
}

//To midnight normalization
function toMidnight(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

// Generate due dates
export function createDate(task: ClientTask): HTMLTimeElement {
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

import {
  createCheckbox,
  createDeleteBtn,
  createLabel,
  createNewTaskElements,
} from './render'

function createTask(task: Task): void {
  const checkbox = createCheckbox(task)
  const label = createLabel(task)
  const newTask = createNewTaskElements()
  const deleteBtn = createDeleteBtn(task)
  const dueDate = createDate(task)
  const checkboxLabelWrapper = document.createElement('p')
  const dueDateDeleteWrapper = document.createElement('p')
  newTask.id = task.id.toString()
  checkbox.id = `checkbox-${newTask.id}`
  label.htmlFor = checkbox.id

  const deleteSingleElement = (taskId: number): void => {
    const taskElement = document.getElementById(`${taskId}`)
    if (taskElement) {
      const taskElementId = Number(taskElement.id)
      if (taskElementId === taskId) {
        taskElement.remove()
        deleteData(API_URL_TODOS, taskId)
      }
    }
  }

  const checkboxStatusHandler = () => {
    task.done = checkbox.checked
    label.classList.toggle('completed', task.done)
    patchData(API_URL_TODOS, task.id, { done: checkbox.checked })
  }

  //Append elements
  dueDateDeleteWrapper.append(dueDate, deleteBtn)
  checkboxLabelWrapper.append(checkbox, label)
  newTask.append(checkboxLabelWrapper, dueDateDeleteWrapper)
  toDoList.appendChild(newTask)
  deleteBtn.addEventListener('click', () => deleteSingleElement(task.id))
  checkbox.addEventListener('change', () => checkboxStatusHandler())
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

  const newTask: ClientTask = {
    title: trimmed,
    due_date: selectedDate || null,
    done: false,
  }

  try {
    await postData<Task>(API_URL_TODOS, newTask)
    const tasks = await getData<Task>(API_URL_TODOS)
    tasks.forEach((el: Task) => {
      const createdElement = document.getElementById(`${el.id}`)
      if (!createdElement) {
        createTask(el)
      }
      return
    })
  } catch (error) {
    showError('Data not posted as intended')
    console.error('Failed to send data: ', error)
  }

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

export function dateColorSetUp(dueDate: HTMLTimeElement): void {
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
