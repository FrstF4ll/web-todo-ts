import './style.css'
import { CSS_CLASSES, SELECTORS } from './constants'

// Get only non-null element.
function getRequiredElement<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector)
  if (!el) throw new Error(`Element ${selector} not found`)
  return el
}

// DOM
export const toDoInput = getRequiredElement<HTMLInputElement>(
  SELECTORS.TODO_INPUT,
)
export const addButton = getRequiredElement<HTMLButtonElement>(
  SELECTORS.ADD_BUTTON,
)
export const toDoList = getRequiredElement<HTMLUListElement>(
  SELECTORS.TODO_LIST_ELEMENTS,
)
export const errorMsg = getRequiredElement<HTMLParagraphElement>(
  SELECTORS.ERROR_MESSAGE,
)
export const clearAllBtn = getRequiredElement<HTMLButtonElement>(
  SELECTORS.DELETE_ALL,
)
export const dateInput = getRequiredElement<HTMLInputElement>(
  SELECTORS.DATE_INPUT,
)
export const overdueMsg = getRequiredElement<HTMLHeadingElement>(
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
