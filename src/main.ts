import './style.css'

import { API_URL_TODOS, getData, postData } from './api'
// DOM import
import {
  addButton,
  clearAllBtn,
  dateInput,
  hideStatusMessage,
  overdueMsg,
  showStatusMessage,
  toDoInput,
} from './dom'
import { deleteAllTask } from './events'
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
  showStatusMessage('Could not load tasks. Check console for details')
}

//Not API
function updateOverdueMessageDisplay() {
  const overduedTasks = document.querySelectorAll('.due-date--past-due')
  overdueMsg.classList.toggle('hidden', overduedTasks.length === 0)
}
updateOverdueMessageDisplay()

async function addToList(): Promise<void> {
  const selectedDate = dateInput.value

  const selectedMidnight = toMidnight(new Date(selectedDate))
  const todayMidnight = toMidnight(new Date())

  if (selectedDate && todayMidnight > selectedMidnight) {
    showStatusMessage('Invalid date: date too early')
    return
  }

  const trimmed = toDoInput.value.trim()
  if (trimmed.length === 0) {
    showStatusMessage('Invalid task name: Empty name')
    return
  }

  hideStatusMessage()

  const newTask: ClientTask = {
    title: trimmed,
    due_date: selectedDate || null,
    done: false,
  }

  try {
    const postResponse = await postData<Task>(API_URL_TODOS, newTask)
    createTask(postResponse)
  } catch (error) {
    showStatusMessage('Data not posted as intended')
    console.error('Failed to send data: ', error)
  }

  toDoInput.value = ''
  dateInput.value = ''
}

// Delete all

const EVENT_KEY = 'Enter'

toDoInput.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === EVENT_KEY) addToList()
})
clearAllBtn.addEventListener('click', deleteAllTask)
addButton.addEventListener('click', () => addToList())
