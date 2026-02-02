import { getData, postData, deleteAllData } from '../api'
import { API_URLS, EVENT_TYPES, KEYS, SELECTORS, CSS_CLASSES } from '../constants'
import type { Category, ClientTask, Task } from '../interface'
import {
  getRequiredElement,
  showStatusMessage,
  trimmedTitle,
  verifiedDate,
} from '../utils'
import { categoriesCache } from '../store'
import { createTask } from '../render'



let toDoInput: HTMLInputElement
let dateInput: HTMLInputElement
let toDoList: HTMLUListElement
let overdueMessage: HTMLParagraphElement
let categorySelector: HTMLSelectElement

export const TodosPage = {
  render: () => `
    <section id="user-input" class="page-fade">
      <div class="test">
        <label for="todo-input" id="todo-label">New Task</label>
        <p id="error-msg" class="hidden" aria-live="polite">ERROR: Task cannot be empty</p>
      </div>
      <div class="user-input-layout">
        <input id="todo-input" placeholder="Write here your task">
        <input type="date" id="todo-date-input">
        <select id="category-selector">
          <option value="none">Select a category</option>
        </select>
        <button id="add-todo-button">Add to list</button>
      </div>
    </section>
    <section class="app-list page-fade">
      <button id="delete-all">Clear tasks</button>
      <ul id="todos-container"></ul>
    </section>
  `,
  init: async () => {
    toDoInput = getRequiredElement<HTMLInputElement>(SELECTORS.TODO_INPUT)
    dateInput = getRequiredElement<HTMLInputElement>(SELECTORS.DATE_INPUT)
    toDoList = getRequiredElement<HTMLUListElement>(
      SELECTORS.TODO_LIST_ELEMENTS,
    )
    const addButton = getRequiredElement<HTMLButtonElement>(
      SELECTORS.ADD_BUTTON,
    )
    const clearAllBtn = getRequiredElement<HTMLButtonElement>(
      SELECTORS.DELETE_ALL,
    )
    overdueMessage = getRequiredElement<HTMLParagraphElement>(SELECTORS.OVERDUE_MESSAGE)
    categorySelector = getRequiredElement<HTMLSelectElement>(
      SELECTORS.CATEGORY_SELECTOR,
    )

    toDoInput.addEventListener(EVENT_TYPES.KEY_PRESS, (e: KeyboardEvent) => {
      if (e.key === KEYS.SUBMIT) addTodoToList()
    })
    clearAllBtn.addEventListener(EVENT_TYPES.CLICK, async () => {
      await deleteAllTask()
      updateOverdueMessageDisplay()
    })

    addButton.addEventListener(EVENT_TYPES.CLICK, () => addTodoToList())


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
      tasks.forEach((task) => createTask(task, toDoList))
    } catch (error) {
      console.error('Failed to load initial tasks:', error)
      showStatusMessage('Could not load tasks. Check console for details')
    }
  },
}

async function addTodoToList(): Promise<void> {
  try {
    const selectedId = Number.parseInt(categorySelector.value, 10)
    const newTask: ClientTask = {
      title: trimmedTitle(toDoInput),
      due_date: verifiedDate(dateInput),
      done: false,
    }

    const postResponse = await postData<ClientTask, Task>(
      API_URLS.TODOS,
      newTask,
    )
    if (!Number.isNaN(selectedId)) {
      await postData(API_URLS.CATEGORIES_TODOS, {
        category_id: selectedId,
        todo_id: postResponse.id,
      })
      postResponse.categories = [categoriesCache[selectedId]]
    }
    createTask(postResponse, toDoList)

    toDoInput.value = ''
    dateInput.value = ''
  } catch (error) {
    console.error('Failed to add todo:', error)
  }
}

async function deleteAllTask() {
  try {
    if (toDoList?.children.length === 0) {
      showStatusMessage('Todo-list already clean.')
      return
    }
    if (!window.confirm('Are you sure you want to delete all tasks?')) {
      return
    }
    await deleteAllData(API_URLS.TODOS)
    if (toDoList) toDoList.innerHTML = ''
    showStatusMessage('All tasks successfully deleted')
  } catch (error) {
    console.error('Failed to delete Tasks : ', error)
    showStatusMessage('Failed to delete all Tasks, check console for details.')
  }
}

export function updateOverdueMessageDisplay() {
  if (!overdueMessage) return
  const overduedTasks = document.querySelectorAll('.due-date--past-due')
  const noOverdueTasks = overduedTasks.length === 0
  overdueMessage.classList.toggle(CSS_CLASSES.HIDDEN, noOverdueTasks)
}