import './style.css'

import { getData, postData } from './api'
import { API_URLS, EVENT_TYPES, KEYS } from './constants'
// DOM import
import {
  addButton,
  categorySelector,
  clearAllBtn,
  dateInput,
  toDoInput,
} from './dom'
import { deleteAllTask } from './events'
import type { Category, ClientTask, Task } from './interface'
import { categoriesCache, createTask } from './render'
// Time calculation
import {
  showStatusMessage,
  updateOverdueMessageDisplay,
} from './utils'

// Loading tasks

try {
  const tasks = await getData<Task>(API_URLS.TODOS)
  async function loadCategories() {
    const categories = await getData<Category>(API_URLS.CATEGORIES)
    categories.forEach((cat) => {
      categoriesCache[cat.id] = cat

      const opt = new Option(cat.title, cat.id.toString())
      categorySelector.appendChild(opt)
    })
  }
  loadCategories()

  tasks.forEach(createTask)
} catch (error) {
  console.error('Failed to load initial tasks:', error)
  showStatusMessage('Could not load tasks. Check console for details')
}

updateOverdueMessageDisplay()

//Not API

import { trimmedTitle, verifiedDate } from './utils'

async function addTodoToList(): Promise<void> {
  const newTask: ClientTask = {
    title: trimmedTitle(toDoInput!),
    due_date: verifiedDate(),
    done: false,
  }
  const postResponse = await postData<ClientTask, Task>(
    API_URLS.TODOS,
    newTask,
  )

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
