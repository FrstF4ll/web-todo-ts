import { deleteData, getData, postData } from '../api'
import {
  API_URLS,
  CSS_CLASSES,
  EVENT_TYPES,
  KEYS,
  SELECTORS,
} from '../global-variables/constants'
import type { Category, ClientTask, Task } from '../global-variables/interface'
import { createTask } from '../item-generation/todo-generation'
import {
  categoriesCache,
  getManyRequiredElements,
  getSingleRequiredElement,
  showStatusMessage,
  trimmedTitle,
  verifiedDate,
} from '../utils'

let toDoInput: HTMLInputElement
let dateInput: HTMLInputElement
let toDoList: HTMLUListElement
let overdueMessage: HTMLParagraphElement
let categorySelector: NodeListOf<HTMLSelectElement>
let assignCategory: HTMLSelectElement
let filterCategory: HTMLSelectElement

export const TodosPage = {
  render: () => `
    <section id="user-input" class="page-fade">
      <div class="test">
        <label for="todo-input" id="todo-label">New Task</label>
        <p id="error-msg" class="hidden" aria-live="polite">ERROR: Task cannot be empty</p>
      </div>
      <div class="user-input-layout">
        <input aria-labelledby="todo-label" id="todo-input" placeholder="Write here your task">
        <input aria-label="Due date" type="date" id="todo-date-input">
        <select aria-label="Assign category for task creation" id="add-category-select" class="category-selector">
          <option value="none">Select a category</option>
        </select>
        <button id="add-todo-button">Add to list</button>
      </div>
    </section>
    <section class="app-list page-fade">
      <select aria-label="Filter task by category" id="filter-category-select" class="category-selector">
        <option value="all">All</option>
        <option value="0">Uncategorized</option>
      </select>
      <button id="delete-all">Clear tasks</button>
      <ul aria-label="Tasks list" id="todos-container"></ul>
    </section>
  `,
  init: async () => {
    toDoInput = getSingleRequiredElement<HTMLInputElement>(SELECTORS.TODO_INPUT)
    dateInput = getSingleRequiredElement<HTMLInputElement>(SELECTORS.DATE_INPUT)
    toDoList = getSingleRequiredElement<HTMLUListElement>(
      SELECTORS.TODO_LIST_ELEMENTS,
    )
    const addButton = getSingleRequiredElement<HTMLButtonElement>(
      SELECTORS.ADD_BUTTON,
    )
    const clearAllBtn = getSingleRequiredElement<HTMLButtonElement>(
      SELECTORS.DELETE_ALL,
    )
    overdueMessage = getSingleRequiredElement<HTMLParagraphElement>(
      SELECTORS.OVERDUE_MESSAGE,
    )
    categorySelector = getManyRequiredElements<HTMLSelectElement>(
      SELECTORS.CATEGORY_SELECTOR,
    )

    filterCategory = getSingleRequiredElement<HTMLSelectElement>(
      SELECTORS.CATEGORY_FILTER,
    )

    assignCategory = getSingleRequiredElement<HTMLSelectElement>(
      SELECTORS.CATEGORY_ADD,
    )

    toDoInput.addEventListener(EVENT_TYPES.KEY_PRESS, (e: KeyboardEvent) => {
      if (e.key === KEYS.SUBMIT) addTodoToList()
    })

    clearAllBtn.addEventListener(EVENT_TYPES.CLICK, async () => {
      await deleteAllTask(filterCategory.value)
      updateOverdueMessageDisplay()
    })

    addButton.addEventListener(EVENT_TYPES.CLICK, () => addTodoToList())

    try {
      const populateSelectElements = (
        selector: HTMLSelectElement,
        categories: Category[],
      ) => {
        categories.forEach((cat) => {
          categoriesCache[cat.id] = cat
          const opt = new Option(cat.title, cat.id.toString())
          selector.appendChild(opt)
        })
      }

      const [categories, tasks] = await Promise.all([
        getData<Category>(API_URLS.CATEGORIES),
        getData<Task>(API_URLS.SELECTED_CATEGORY),
      ])

      categorySelector.forEach((sel) => {
        populateSelectElements(sel, categories)
      })
      tasks.forEach((task) => {
        createTask(task, toDoList)
      })
      filterCategory.addEventListener(EVENT_TYPES.CHANGE, () =>
        sortTodosByCategories(filterCategory.value),
      )
    } catch (error) {
      console.error('Failed to load initial tasks:', error)
      showStatusMessage('Could not load tasks. Check console for details')
    }
  },
}

async function addTodoToList(): Promise<void> {
  try {
    const selectedCategoryId = assignCategory.value
    const newTask: ClientTask = {
      title: trimmedTitle(toDoInput),
      due_date: verifiedDate(dateInput),
      done: false,
    }

    const postResponse = await postData<ClientTask, Task>(
      API_URLS.TODOS,
      newTask,
    )
    if (selectedCategoryId !== 'none') {
      const categoryId = Number.parseInt(assignCategory.value, 10)
      await postData(API_URLS.CATEGORIES_TODOS, {
        category_id: categoryId,
        todo_id: postResponse.id,
      })
      postResponse.categories = [categoriesCache[categoryId]]
    }
    createTask(postResponse, toDoList)

    toDoInput.value = ''
    dateInput.value = ''
  } catch (error) {
    console.error('Failed to add todo:', error)
  }
}

async function deleteAllTask(filter: string) {
  try {
    const todos = getManyRequiredElements(SELECTORS.TODOS)

    if (toDoList?.children.length === 0) {
      showStatusMessage('Todo-list already clean.')
      return
    }
    if (!window.confirm('Are you sure you want to delete all tasks?')) {
      return
    }

    todos.forEach(async (todo) => {
      const category = todo.querySelector('.category-tag') as HTMLDivElement
      const isMatch = category.dataset.id === filter || filter === 'all'
      if (isMatch) {
        await deleteData(API_URLS.TODOS, Number(todo.id))
        todo.remove()
        showStatusMessage('All tasks of this category successfully deleted')
      }
    })
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

function sortTodosByCategories(filter: string) {
  const todos = getManyRequiredElements(SELECTORS.TODOS)
  todos.forEach((todo) => {
    const category = todo.querySelector('.category-tag') as HTMLDivElement
    const isMatch = category.dataset.id === filter || filter === 'all'
    todo.classList.toggle('hidden', !isMatch)
  })
}
