import './style.css'

import { getData, postData } from './api'
import { API_URLS, EVENT_TYPES, KEYS } from './constants'
// DOM import
import {
  addButton,
  clearAllBtn,
  dateInput,
  hideStatusMessage,
  showStatusMessage,
  toDoInput,
} from './dom'
import { deleteAllTask } from './events'
import type { ClientTask, Task } from './interface'
import { createTask } from './render'
// Time calculation
import { toMidnight, updateOverdueMessageDisplay } from './utils'

// Loading tasks

try {
  const tasks = await getData<Task>(API_URLS.TODOS)
  tasks.forEach(createTask)
} catch (error) {
  console.error('Failed to load initial tasks:', error)
  showStatusMessage('Could not load tasks. Check console for details')
}

updateOverdueMessageDisplay()

//Not API

async function addTodoToList(): Promise<void> {
  const selectedDate = dateInput!.value

  const selectedMidnight = toMidnight(new Date(selectedDate))
  const todayMidnight = toMidnight(new Date())

  if (selectedDate && todayMidnight > selectedMidnight) {
    showStatusMessage('Invalid date: date too early')
    return
  }

  const trimmed = toDoInput!.value.trim()
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
    const postResponse = await postData<ClientTask, Task>(
      API_URLS.TODOS,
      newTask,
    )
    createTask(postResponse)
  } catch (error) {
    showStatusMessage('Data not posted as intended')
    console.error('Failed to send data: ', error)
  }

  toDoInput!.value = ''
  dateInput!.value = ''
}

// Delete all

toDoInput?.addEventListener(EVENT_TYPES.KEY_PRESS, (e: KeyboardEvent) => {
  if (e.key === KEYS.SUBMIT) addTodoToList()
})
clearAllBtn?.addEventListener(EVENT_TYPES.CLICK, async () => {
  await deleteAllTask()
  updateOverdueMessageDisplay()
})
addButton?.addEventListener(EVENT_TYPES.CLICK, () => addTodoToList())
