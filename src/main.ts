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
import { createTask } from './render'
// Time calculation
import {
  showStatusMessage,
  trimmedTitle,
  updateOverdueMessageDisplay,
  verifiedDate,
} from './utils'

// Loading tasks

export const categoriesCache: Record<number, Category> = {}

try {
  const tasks = await getData<Task>(API_URLS.SELECTED_CATEGORY)
  async function loadCategories() {
    const categories = await getData<Category>(API_URLS.CATEGORIES)
    categories.forEach((cat) => {
      categoriesCache[cat.id] = cat

      const opt = new Option(cat.title, cat.id.toString())
      categorySelector.appendChild(opt)
    })
  }
  await loadCategories()

  tasks.forEach(createTask)
} catch (error) {
  console.error('Failed to load initial tasks:', error)
  showStatusMessage('Could not load tasks. Check console for details')
}

updateOverdueMessageDisplay()

//Not API

async function addTodoToList(): Promise<void> {
  try {
    const selectedId = Number.parseInt(categorySelector.value, 10)
    if (!toDoInput || !dateInput) {
      return
    }
    const newTask: ClientTask = {
      title: trimmedTitle(toDoInput),
      due_date: verifiedDate(),
      done: false,
    }
    const postResponse = await postData<ClientTask, Task>(API_URLS.TODOS, newTask)
    if (!Number.isNaN(selectedId)) {
      await postData(API_URLS.CATEGORIES_TODOS, {
        category_id: selectedId,
        todo_id: postResponse.id,
      })
      postResponse.categories = [categoriesCache[selectedId]]
    }
    createTask(postResponse)
    toDoInput.value = ''
    dateInput.value = ''
  } catch (error) {
    console.error('Failed to add todo:', error)
  }
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
