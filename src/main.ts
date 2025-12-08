import './style.css'

import { deleteAllData, deleteData, getData, patchData, postData } from './api'
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
import { createDate } from './render'
// Time calculation
import { toMidnight } from './utils'
// API endpoints
export const API_URL_TODOS: string = 'https://api.todos.in.jt-lab.ch/todos'
// const CATEGORIES_API_ENDPOINT: string = 'https://api.todos.in.jt-lab.ch/categories'
// const CATEGORIES_TODO_API_ENDPOINT: string = 'https://api.todos.in.jt-lab.ch/categories_todos'

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

import {
  createCheckbox,
  createDeleteBtn,
  createLabel,
  createNewTaskElements,
} from './render'

function createTask(task: Task): void {
  const newTask = createNewTaskElements()
  newTask.id = task.id.toString()

  const checkbox = createCheckbox(task)
  checkbox.id = `checkbox-${newTask.id}`

  const label = createLabel(task)
  label.htmlFor = checkbox.id

  const checkboxLabelWrapper = document.createElement('p')
  checkboxLabelWrapper.append(checkbox, label)

  const dueDate = createDate(task)
  const deleteBtn = createDeleteBtn(task)

  const dueDateDeleteWrapper = document.createElement('p')
  dueDateDeleteWrapper.append(dueDate, deleteBtn)

  newTask.append(checkboxLabelWrapper, dueDateDeleteWrapper)

  //Append elements
  deleteBtn.addEventListener('click', () => {
    newTask.remove()
    deleteData(API_URL_TODOS, task.id)
  })

  checkbox.addEventListener('change', () => {
    task.done = checkbox.checked
    label.classList.toggle('completed', task.done)
    patchData(API_URL_TODOS, task.id, { done: checkbox.checked })
  })
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

// Delete all
const addTaskHandler = () => addToList()
const detectKey = (e: KeyboardEvent) => {
  if (e.key === 'Enter') addTaskHandler()
}

toDoInput.addEventListener('keydown', detectKey)
clearAllBtn.addEventListener('click', deleteAllTask)
addButton.addEventListener('click', addTaskHandler)
