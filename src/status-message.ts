import { CSS_CLASSES, SELECTORS } from './constants'

function getRequiredElement<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector)
  if (!el) throw new Error(`Element ${selector} not found`)
  return el
}

export const errorMsg = getRequiredElement<HTMLParagraphElement>(
  SELECTORS.ERROR_MESSAGE,
)

export const showStatusMessage = (message: string) => {
  errorMsg.classList.remove(CSS_CLASSES.HIDDEN)
  errorMsg.textContent = message
}

export const hideStatusMessage = () => {
  errorMsg.classList.add(CSS_CLASSES.HIDDEN)
  errorMsg.textContent = ''
}
