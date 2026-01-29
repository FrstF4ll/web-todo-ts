import './style.css'

import { getData } from './api'
import { API_URLS, EVENT_TYPES, KEYS, SELECTORS } from './constants'
// DOM import
import {
  addButton,
  clearAllBtn,
  dateInput,
  showStatusMessage,
  toDoInput,
} from './dom'
import { deleteAllTask } from './events'
import type { ClientTask, Task, Category } from './interface'
import { createTask } from './render'
// Time calculation
import { sendDataToAPI, trimmedTitle, updateOverdueMessageDisplay, verifiedDate } from './utils'

// Loading tasks


const categorySelector = document.querySelector(SELECTORS.CATEGORY_SELECTOR) as HTMLSelectElement

try {
  const tasks = await getData<Task>(API_URLS.TODOS)
  const categories = await getData<Category>(API_URLS.CATEGORIES)

  categories.forEach(category => {
    const newOption = document.createElement('option') as HTMLOptionElement
    newOption.value = category.id.toString()
    newOption.textContent = category.title
    categorySelector.appendChild(newOption)
  })
  tasks.forEach(createTask)
} catch (error) {
  console.error('Failed to load initial tasks:', error)
  showStatusMessage('Could not load tasks. Check console for details')
}

updateOverdueMessageDisplay()

//Not API

async function addTodoToList(): Promise<void> {
  sendDataToAPI<ClientTask, Task>(API_URLS.TODOS, { title: trimmedTitle(), due_date: verifiedDate(), done: false }, createTask)
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
