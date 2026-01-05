// Interface Import

import { API_URL_TODOS, deleteData, patchData } from './api'
import { showStatusMessage, toDoList } from './dom'
import type { ClientTask, Task } from './interface'
import { dateColorSetUp, updateOverdueMessageDisplay } from './utils'

export function createNewTaskElements(): HTMLLIElement {
  const newTask = document.createElement('li')
  newTask.className = 'todo-elements'
  return newTask
}

//Generate label
export function createLabel(task: Task, checkboxId: string): HTMLLabelElement {
  const label = document.createElement('label')
  label.textContent = task.title
  label.htmlFor = checkboxId
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
  const taskDate = task.due_date
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

export function createTask(task: Task): void {
  const newTask = createNewTaskElements()
  newTask.id = task.id.toString()

  const checkbox = createCheckbox(task)
  checkbox.id = `checkbox-${newTask.id}`

  const label = createLabel(task, checkbox.id)

  const checkboxLabelWrapper = document.createElement('p')
  checkboxLabelWrapper.append(checkbox, label)

  const dueDate = createDate(task)
  const deleteBtn = createDeleteBtn(task)

  const dueDateDeleteWrapper = document.createElement('p')
  dueDateDeleteWrapper.append(dueDate, deleteBtn)

  newTask.append(checkboxLabelWrapper, dueDateDeleteWrapper)

  // Event listeners
  deleteBtn.addEventListener('click', async () => {
    try {
      await deleteData(API_URL_TODOS, task.id)
      newTask.remove()
      updateOverdueMessageDisplay()
    } catch (error) {
      console.error(`Failed to delete task ${task.id}:`, error)
      showStatusMessage('Failed to delete task. Please try again.')
    }
  })

  checkbox.addEventListener('change', async () => {
    const originalDoneState = task.done
    task.done = checkbox.checked
    label.classList.toggle('completed', task.done)
    try {
      await patchData(API_URL_TODOS, task.id, { done: task.done })
    } catch (error) {
      // Revert UI on failure to keep it consistent with the server state
      task.done = originalDoneState
      checkbox.checked = originalDoneState
      label.classList.toggle('completed', task.done)
      console.error(`Failed to update task ${task.id}:`, error)
      showStatusMessage('Failed to update task. Please try again.')
    }
  })
  toDoList.appendChild(newTask)
}
