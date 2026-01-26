import { CSS_CLASSES, SELECTORS } from './constants'
import { getRequiredElement } from './utils'

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
