import { SELECTORS } from './constants'

function getRequiredElement<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector)
  if (!el) throw new Error(`Element ${selector} not found`)
  return el
}

// DOM
export const categoryInput = getRequiredElement<HTMLInputElement>(
  SELECTORS.CATEGORY_INPUT,
)
export const addCategoryButon = getRequiredElement<HTMLButtonElement>(
  SELECTORS.ADD_CATEGORY_BUTTON,
)
export const categoryList = getRequiredElement<HTMLUListElement>(
  SELECTORS.CATEGORY_LIST_ELEMENTS,
)
export const errorMsg = getRequiredElement<HTMLParagraphElement>(
  SELECTORS.ERROR_MESSAGE,
)

// Render

//Add to database
