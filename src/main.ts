import './style.css'

import { API_URL_TODOS, deleteAllData, getData, postData } from './api'
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
import { createTask } from './render'
// Time calculation
import { toMidnight } from './utils'

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

async function addToList(): Promise<void> {
  const selectedDate = dateInput.value

  const selectedMidnight = toMidnight(new Date(selectedDate))
  const todayMidnight = toMidnight(new Date())

  if (selectedDate && todayMidnight > selectedMidnight) {
    showError('Invalid date: date too early')
    return
  }

  const trimmed = toDoInput.value.trim()
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
    const postResponse = await postData<Task>(API_URL_TODOS, newTask)
    createTask(postResponse)
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
