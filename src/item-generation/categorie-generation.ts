import { deleteData } from '../api'
import {
  API_URLS,
  CSS_CLASSES,
  EVENT_TYPES,
  INPUT_TYPES,
  SELECTORS,
} from '../global-variables/constants'
import type { Category, ClientCategory } from '../global-variables/interface'
import { renderSettingsWindow } from './settings'
import { getRequiredElement, showStatusMessage, } from '../utils'
import { categoriesCache } from '../utils'

// Render
export function createNewCategoryElements(): HTMLLIElement {
  const newcategory = document.createElement(SELECTORS.LIST_ELEMENT)
  newcategory.className = CSS_CLASSES.CATEGORY_ELEMENT
  return newcategory
}
function createCategoryTitle(category: Category): HTMLParagraphElement {
  const categoryTitle = document.createElement(SELECTORS.PARAGRAPH)
  categoryTitle.className = 'category-title'
  categoryTitle.textContent = category.title
  return categoryTitle
}
// Generate delete button
export function createDeleteBtn(category: ClientCategory): HTMLButtonElement {
  const deleteBtn = document.createElement(SELECTORS.BUTTON)
  deleteBtn.type = INPUT_TYPES.BUTTON
  deleteBtn.className = CSS_CLASSES.DELETE_BTN
  deleteBtn.textContent = 'X'
  deleteBtn.ariaLabel = `Delete category: ${category.title}`
  return deleteBtn
}
function createModifyingButton(category: ClientCategory): HTMLButtonElement {
  const modifyButton = document.createElement(SELECTORS.BUTTON)
  modifyButton.type = INPUT_TYPES.BUTTON
  modifyButton.className = CSS_CLASSES.MODIFY_BTN
  modifyButton.textContent = 'Modify'
  modifyButton.ariaLabel = `Modify category${category.title}`
  return modifyButton
}

function createCategoryElements(category: Category): HTMLLIElement {
  const newCategory = createNewCategoryElements()
  newCategory.id = category.id.toString()
  newCategory.className = CSS_CLASSES.CATEGORY_ELEMENT
  newCategory.style.backgroundColor = category.color
  const deleteBtn = createDeleteBtn(category)
  const categoryTitle = createCategoryTitle(category)
  const modifyBtn = createModifyingButton(category)

  newCategory.append(modifyBtn, categoryTitle, deleteBtn)
  return newCategory
}

// Event Listeners

function attachCategoryEventListeners(
  category: Category,
  element: HTMLLIElement,
): void {
  const modifyBtn = element.querySelector(
    `.${CSS_CLASSES.MODIFY_BTN}`,
  ) as HTMLButtonElement

  modifyBtn.addEventListener(EVENT_TYPES.CLICK, () => {
    const parentElement = modifyBtn.parentElement as HTMLLIElement
    if (!parentElement) {
      return
    }
    const elementBackgroundColor = parentElement.style.backgroundColor
    const elementTitle = parentElement.querySelector<HTMLParagraphElement>(
      SELECTORS.CATEGORY_TITLE,
    )
    if (!elementTitle) {
      return
    }
    const elementTextContent = elementTitle.textContent ?? ''
    renderSettingsWindow(
      parentElement,
      elementBackgroundColor,
      elementTextContent,
    )
  })

  const deleteBtn = element.querySelector(
    SELECTORS.DELETE_BTN,
  ) as HTMLButtonElement
  deleteBtn.addEventListener(EVENT_TYPES.CLICK, async () => {
    try {
      await deleteData(API_URLS.CATEGORIES, category.id)
      element.remove()
    } catch (error) {
      console.error(`Failed to delete category ${category.id}:`, error)
      showStatusMessage('Failed to delete category. Please try again.')
    }
  })
}

export function createCategory(category: Category | undefined): void {
  if (typeof category === 'undefined') {
    throw new Error('Type of category is undefined, cannot create category')
  }
  const container = getRequiredElement<HTMLUListElement>(
    SELECTORS.CATEGORY_LIST_ELEMENTS,
  )
  const element = createCategoryElements(category)
  attachCategoryEventListeners(category, element)
  categoriesCache[category.id] = category
  container.appendChild(element)
}
