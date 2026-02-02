// Interface Import

import { deleteData, patchData } from '../api'
import {
  API_URLS,
  COLORS,
  CSS_CLASSES,
  EVENT_TYPES,
  INPUT_TYPES,
  SELECTORS,
} from '../global-variables/constants'
import type { ClientTask, Task } from '../global-variables/interface'
import {
  dateColorSetUp,
  showStatusMessage,
  updateOverdueMessageDisplay,
} from '../utils'

export function createNewTaskElements(): HTMLLIElement {
  const newTask = document.createElement(SELECTORS.LIST_ELEMENT)
  newTask.className = CSS_CLASSES.TODO_ELEMENT
  return newTask
}

//Generate label
export function createLabel(task: Task, checkboxId: string): HTMLLabelElement {
  const label = document.createElement(SELECTORS.LABEL)
  label.textContent = task.title
  label.htmlFor = checkboxId
  label.classList.toggle(CSS_CLASSES.COMPLETED, task.done)
  return label
}

//Generate checkbox
export function createCheckbox(task: ClientTask): HTMLInputElement {
  const checkbox = document.createElement(SELECTORS.INPUT)
  checkbox.type = INPUT_TYPES.CHECKBOX
  checkbox.className = CSS_CLASSES.TODO_CHECKBOX
  checkbox.checked = task.done
  return checkbox
}

//Generate delete button
export function createDeleteBtn(task: ClientTask): HTMLButtonElement {
  const deleteBtn = document.createElement(SELECTORS.BUTTON)
  deleteBtn.type = INPUT_TYPES.BUTTON
  deleteBtn.className = CSS_CLASSES.DELETE_BTN
  deleteBtn.textContent = 'X'
  deleteBtn.ariaLabel = `Delete task: ${task.title}`
  return deleteBtn
}

function renderSelectedCategory(task: Task): HTMLDivElement {
  const displayedCategory = document.createElement('div')

  if (task.categories && task.categories.length > 0) {
    const cat = task.categories[0]
    displayedCategory.className = 'category-tag' // Use a consistent class
    displayedCategory.dataset.id = cat.id.toString()
    displayedCategory.textContent = cat.title
  } else {
    displayedCategory.className = 'none'
    displayedCategory.textContent = 'No categories'
  }

  return displayedCategory
}

// Generate due dates
export function createDate(task: ClientTask): HTMLTimeElement {
  const taskDate = task.due_date
  const dueDate = document.createElement(SELECTORS.TIME)
  dueDate.className = CSS_CLASSES.DUE_DATE
  if (taskDate) {
    dueDate.dateTime = taskDate
    dueDate.textContent = taskDate
    dateColorSetUp(dueDate)
  } else {
    dueDate.textContent = 'No due date'
  }

  return dueDate
}

function createTaskElements(task: Task): HTMLLIElement {
  const newTask = createNewTaskElements()
  newTask.id = task.id.toString()

  const checkbox = createCheckbox(task)
  checkbox.id = `checkbox-${newTask.id}`

  const label = createLabel(task, checkbox.id)
  const checkboxLabelWrapper = document.createElement(SELECTORS.PARAGRAPH)
  checkboxLabelWrapper.append(checkbox, label)

  const category = renderSelectedCategory(task)
  const categoryColor = task.categories?.[0]?.color || COLORS.DEFAULT
  newTask.style.borderStyle = 'solid'
  newTask.style.borderColor = categoryColor

  const dueDate = createDate(task)
  const deleteBtn = createDeleteBtn(task)
  const dueDateDeleteWrapper = document.createElement(SELECTORS.PARAGRAPH)
  dueDateDeleteWrapper.append(dueDate, deleteBtn)
  newTask.append(checkboxLabelWrapper, category, dueDateDeleteWrapper)
  return newTask
}

// Event Listeners
function attachTaskEventListeners(task: Task, element: HTMLLIElement): void {
  const deleteBtn = element.querySelector(
    SELECTORS.DELETE_BTN,
  ) as HTMLButtonElement
  const checkbox = element.querySelector(
    SELECTORS.TODO_CHECKBOX,
  ) as HTMLInputElement
  const label = element.querySelector(SELECTORS.LABEL) as HTMLLabelElement

  deleteBtn.addEventListener(EVENT_TYPES.CLICK, async () => {
    try {
      await deleteData(API_URLS.TODOS, task.id)
      element.remove()
      updateOverdueMessageDisplay()
    } catch (error) {
      console.error(`Failed to delete task ${task.id}:`, error)
      showStatusMessage('Failed to delete task. Please try again.')
    }
  })

  checkbox.addEventListener(EVENT_TYPES.CHANGE, async () => {
    const originalDoneState = task.done
    task.done = checkbox.checked
    label.classList.toggle(CSS_CLASSES.COMPLETED, task.done)
    try {
      await patchData(API_URLS.TODOS, task.id, { done: task.done })
    } catch (error) {
      task.done = originalDoneState
      checkbox.checked = originalDoneState
      label.classList.toggle(CSS_CLASSES.COMPLETED, task.done)
      console.error(`Failed to update task ${task.id}:`, error)
      showStatusMessage('Failed to update task. Please try again.')
    }
  })
}

export function createTask(
  task: Task | undefined,
  container: HTMLUListElement,
): void {
  if (typeof task === 'undefined') {
    throw new Error('Type of task is undefined, cannot create task')
  }
  const element = createTaskElements(task)
  attachTaskEventListeners(task, element)
  container.appendChild(element)
}
