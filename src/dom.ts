import './style.css'
import { SEL } from './constants'

// Get only non-null element.
function getRequiredElement<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector)
  if (!el) throw new Error(`Element ${selector} not found`)
  return el
}



// DOM
export const toDoInput = getRequiredElement<HTMLInputElement>(SEL.TODO_INPUT)
export const addButton =
  getRequiredElement<HTMLButtonElement>(SEL.ADD_BUTTON)
export const toDoList = getRequiredElement<HTMLUListElement>(SEL.TODO_LIST)
export const errorMsg = getRequiredElement<HTMLParagraphElement>(SEL.ERROR_MESSAGE)
export const clearAllBtn = getRequiredElement<HTMLButtonElement>(SEL.DELETE_ALL)
export const dateInput =
  getRequiredElement<HTMLInputElement>(SEL.DATE_INPUT)
export const overdueMsg =
  getRequiredElement<HTMLHeadingElement>(SEL.OVERDUE_MESSAGE)
// Show or hide error message
export const showStatusMessage = (message: string) => {
  errorMsg.classList.remove('hidden')
  errorMsg.textContent = message
}
export const hideStatusMessage = () => {
  errorMsg.classList.add('hidden')
  errorMsg.textContent = ''
}
