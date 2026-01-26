import { deleteData, getData, postData } from './api'
import {
  API_URLS,
  CSS_CLASSES,
  EVENT_TYPES,
  INPUT_TYPES,
  KEYS,
  SELECTORS,
} from './constants'
import type { Category, ClientCategory } from './interface'
import { renderSettingsWindow } from './settings'
import { hideStatusMessage, showStatusMessage } from './status-message'

function getRequiredElement<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector)
  if (!el) throw new Error(`Element ${selector} not found`)
  return el
}

// DOM
export const categoryInput = getRequiredElement<HTMLInputElement>(
  SELECTORS.CATEGORY_INPUT,
)
export const addCategoryButton = getRequiredElement<HTMLButtonElement>(
  SELECTORS.ADD_CATEGORY_BUTTON,
)
export const categoryList = getRequiredElement<HTMLUListElement>(
  SELECTORS.CATEGORY_LIST_ELEMENTS,
)
export const errorMsg = getRequiredElement<HTMLParagraphElement>(
  SELECTORS.ERROR_MESSAGE,
)
export const colorSelector = getRequiredElement<HTMLInputElement>(
  SELECTORS.CATEGORY_COLOR_INPUT,
)

// Load from database

try {
  const tasks = await getData<Category>(API_URLS.CATEGORIES)
  tasks.forEach(createCategory)
} catch (error) {
  console.error('Failed to load initial tasks:', error)
  showStatusMessage('Could not load tasks. Check console for details')
}

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
//Generate delete button
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
  newCategory.className = 'categories-elements'
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
    const elementTitle = parentElement.querySelector('p')
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

export function createCategory(category: Category): void {
  const element = createCategoryElements(category)
  attachCategoryEventListeners(category, element)
  categoryList.appendChild(element)
}

//Add to database

async function addCategoryToList(): Promise<void> {
  const trimmed = categoryInput.value.trim()
  if (trimmed.length === 0) {
    showStatusMessage('Invalid category name: Empty name')
    return
  }

  hideStatusMessage()

  const newCategory: ClientCategory = {
    title: trimmed,
    color: colorSelector.value,
  }

  try {
    const postResponse = await postData<ClientCategory, Category>(
      API_URLS.CATEGORIES,
      newCategory,
    )
    createCategory(postResponse)
  } catch (error) {
    showStatusMessage('Data not posted as intended')
    console.error('Failed to send data: ', error)
  }

  categoryInput.value = ''
}

categoryInput.addEventListener(EVENT_TYPES.KEY_PRESS, (e: KeyboardEvent) => {
  if (e.key === KEYS.SUBMIT) addCategoryToList()
})
addCategoryButton.addEventListener(EVENT_TYPES.CLICK, () => addCategoryToList())
