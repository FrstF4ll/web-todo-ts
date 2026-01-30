import './style.css'

import { getData } from './api'
import { API_URLS, CUSTOM_PROPERTIES, EVENT_TYPES, KEYS } from './constants'
// DOM import
import {
  addButton,
  clearAllBtn,
  dateInput,
  toDoInput,
  categorySelector
} from './dom'
import { deleteAllTask } from './events'
import type { ClientTask, Task, Category } from './interface'
import { createTask } from './render'
import { showStatusMessage } from './utils'
// Time calculation
import { sendDataToAPI, updateOverdueMessageDisplay, } from './utils'

// Loading tasks



try {
  const tasks = await getData<Task>(API_URLS.TODOS)
  const categories = await getData<Category>(API_URLS.CATEGORIES)

  categories.forEach(category => {
    const newOption = document.createElement('option') as HTMLOptionElement
    newOption.value = category.id.toString()
    newOption.textContent = category.title
    newOption.setAttribute(CUSTOM_PROPERTIES.COLOR, category.color)
    categorySelector.appendChild(newOption)
  })
  tasks.forEach(createTask)
} catch (error) {
  console.error('Failed to load initial tasks:', error)
  showStatusMessage('Could not load tasks. Check console for details')
}

updateOverdueMessageDisplay()

//Not API

import { trimmedTitle, verifiedDate } from './utils'

async function addTodoToList(): Promise<void> {
  const postResponse = await sendDataToAPI<ClientTask, Task>(API_URLS.TODOS, {
    title: trimmedTitle(toDoInput!),
    due_date: verifiedDate(),
    done: false
  })
  createTask(postResponse)
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
