// Interface Import
import type { ClientTask, Task } from './interface'
import { dateColorSetUp } from './utils'

//Generate list elements
export function createNewTaskElements(): HTMLLIElement {
  const newTask = document.createElement('li')
  newTask.className = 'todo-elements'
  return newTask
}

//Generate label
export function createLabel(task: Task): HTMLLabelElement {
  const label = document.createElement('label')
  label.textContent = task.title
  label.classList.toggle('completed', task.done)
  return label
}

//Generate checkbox
export function createCheckbox(task: ClientTask): HTMLInputElement {
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'todo-elements__checkbox'
  checkbox.checked = task.done
  return checkbox
}

//Generate delete button
export function createDeleteBtn(task: ClientTask): HTMLButtonElement {
  const deleteBtn = document.createElement('button')
  deleteBtn.type = 'button'
  deleteBtn.className = 'delete-btn'
  deleteBtn.textContent = 'X'
  deleteBtn.ariaLabel = `Delete task: ${task.title}`
  return deleteBtn
}

// Generate due dates
export function createDate(task: ClientTask): HTMLTimeElement {
  const taskDate = task.dueDate
  const dueDate = document.createElement('time')
  dueDate.className = 'due-date'
  if (taskDate) {
    dueDate.dateTime = taskDate
    dueDate.textContent = taskDate
    dateColorSetUp(dueDate)
  } else {
    dueDate.textContent = 'No due date'
  }

  return dueDate
}
