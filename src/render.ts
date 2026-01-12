// Interface Import

import { API_URL_TODOS, deleteData, patchData } from './api'
import { CSS, EVENTS, SEL, TYPES } from './constants'
import { showStatusMessage, toDoList } from './dom'
import type { ClientTask, Task } from './interface'
import { dateColorSetUp, updateOverdueMessageDisplay } from './utils'

export function createNewTaskElements(): HTMLLIElement {
  const newTask = document.createElement(SEL.TODO_LIST)
  newTask.className = CSS.TODO_ELEMENT
  return newTask
}

//Generate label
export function createLabel(task: Task, checkboxId: string): HTMLLabelElement {
  const label = document.createElement(SEL.LABEL)
  label.textContent = task.title
  label.htmlFor = checkboxId
  label.classList.toggle(CSS.COMPLETED, task.done)
  return label
}

//Generate checkbox
export function createCheckbox(task: ClientTask): HTMLInputElement {
  const checkbox = document.createElement(SEL.INPUT)
  checkbox.type = TYPES.CHECKBOX
  checkbox.className = CSS.TODO_CHECKBOX
  checkbox.checked = task.done
  return checkbox
}

//Generate delete button
export function createDeleteBtn(task: ClientTask): HTMLButtonElement {
  const deleteBtn = document.createElement(SEL.BUTTON)
  deleteBtn.type = TYPES.BUTTON
  deleteBtn.className = CSS.DELETE_BTN
  deleteBtn.textContent = 'X'
  deleteBtn.ariaLabel = `Delete task: ${task.title}`
  return deleteBtn
}

// Generate due dates
export function createDate(task: ClientTask): HTMLTimeElement {
  const taskDate = task.due_date
  const dueDate = document.createElement(SEL.TIME)
  dueDate.className = CSS.DUE_DATE
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
  const checkboxLabelWrapper = document.createElement(SEL.PARAGRAPH)
  checkboxLabelWrapper.append(checkbox, label)

  const dueDate = createDate(task)
  const deleteBtn = createDeleteBtn(task)
  const dueDateDeleteWrapper = document.createElement(SEL.PARAGRAPH)
  dueDateDeleteWrapper.append(dueDate, deleteBtn)

  newTask.append(checkboxLabelWrapper, dueDateDeleteWrapper)
  return newTask
}

// Event Listeners
function attachTaskEventListeners(task: Task, element: HTMLLIElement): void {
  const deleteBtn = element.querySelector(SEL.DELETE_BTN) as HTMLButtonElement
  const checkbox = element.querySelector(SEL.TODO_CHECKBOX) as HTMLInputElement
  const label = element.querySelector(SEL.LABEL) as HTMLLabelElement

  deleteBtn.addEventListener(EVENTS.CLICK, async () => {
    try {
      await deleteData(API_URL_TODOS, task.id)
      element.remove()
      updateOverdueMessageDisplay()
    } catch (error) {
      console.error(`Failed to delete task ${task.id}:`, error)
      showStatusMessage('Failed to delete task. Please try again.')
    }
  })

  checkbox.addEventListener(EVENTS.CHANGE, async () => {
    const originalDoneState = task.done
    task.done = checkbox.checked
    label.classList.toggle(CSS.COMPLETED, task.done)
    try {
      await patchData(API_URL_TODOS, task.id, { done: task.done })
    } catch (error) {
      // Revert UI on failure to keep it consistent with the server state
      task.done = originalDoneState
      checkbox.checked = originalDoneState
      label.classList.toggle(CSS.COMPLETED, task.done)
      console.error(`Failed to update task ${task.id}:`, error)
      showStatusMessage('Failed to update task. Please try again.')
    }
  })
}

export function createTask(task: Task): void {
  const element = createTaskElements(task)
  attachTaskEventListeners(task, element)
  toDoList.appendChild(element)
}
