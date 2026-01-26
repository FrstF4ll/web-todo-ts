import './style.css'
import { CSS_CLASSES, SELECTORS } from './constants'
import { getRequiredElement } from './utils'

// DOM
export const toDoInput = document.querySelector<HTMLInputElement>(
  SELECTORS.TODO_INPUT,
)
export const addButton = document.querySelector<HTMLButtonElement>(
  SELECTORS.ADD_BUTTON,
)
export const toDoList = document.querySelector<HTMLUListElement>(
  SELECTORS.TODO_LIST_ELEMENTS,
)
export const errorMsg = getRequiredElement<HTMLParagraphElement>(
  SELECTORS.ERROR_MESSAGE,
)
export const clearAllBtn = document.querySelector<HTMLButtonElement>(
  SELECTORS.DELETE_ALL,
)
export const dateInput = document.querySelector<HTMLInputElement>(
  SELECTORS.DATE_INPUT,
)
export const overdueMsg = document.querySelector<HTMLHeadingElement>(
  SELECTORS.OVERDUE_MESSAGE,
)
// Show or hide error message
export const showStatusMessage = (message: string) => {
  errorMsg.classList.remove(CSS_CLASSES.HIDDEN)
  errorMsg.textContent = message
}
export const hideStatusMessage = () => {
  errorMsg.classList.add(CSS_CLASSES.HIDDEN)
  errorMsg.textContent = ''
}
