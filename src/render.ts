// Interface Import
import type { ClientTask, Task } from './interface'

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
  label.htmlFor = task.id.toString()
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
