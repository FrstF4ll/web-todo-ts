import { getRequiredElement } from '../utils'
import { SELECTORS, API_URLS } from '../constants'
import { showStatusMessage } from '../utils'
import { getData, postData } from '../api'
import { Category, ClientCategory } from '../interface'
import { EVENT_TYPES, KEYS } from '../constants'
import { trimmedTitle } from '../utils'
import { createCategory } from '../item-generation/categorie-generation'

let addButton: HTMLButtonElement
let titleInput: HTMLInputElement
let colorInput: HTMLInputElement
let errorMessage: HTMLParagraphElement
let container: HTMLUListElement

export const CategoriesPage = {
  render: () => `
    <section id="user-input" class="page-fade">
        <div class="test">
            <label for="category-name-input" id="category-label">New Category</label>
            <p id="error-msg" class="hidden" aria-live="polite">ERROR: Category cannot be empty</p>
        </div>
        <div class="user-input-layout">
            <input id="category-name-input" placeholder="Write here your category">
            <input type="color" id="category-color-input" value="#ff0000">
            <button id="add-category-button">Add to category list</button>
            <label for="category-color-input" class="for-readers">Category color</label>
        </div>
    </section>
    <section class="app-list page-fade">
        <ul id="categories-container">
            </ul>
    </section>
  `,

  init: async () => {
    addButton = getRequiredElement<HTMLButtonElement>(
      SELECTORS.ADD_CATEGORY_BUTTON,
    )
    titleInput = getRequiredElement<HTMLInputElement>(
      SELECTORS.CATEGORY_INPUT,
    )
    colorInput = getRequiredElement<HTMLInputElement>(
      SELECTORS.CATEGORY_COLOR_INPUT,
    )
    errorMessage = getRequiredElement<HTMLParagraphElement>(
      SELECTORS.ERROR_MESSAGE,
    )
    container = getRequiredElement<HTMLUListElement>(
      SELECTORS.CATEGORY_LIST_ELEMENTS,
    )

    addButton.addEventListener(EVENT_TYPES.CLICK, () => addCategoryToList())
    titleInput.addEventListener(EVENT_TYPES.KEY_PRESS, (e: KeyboardEvent) => {
      if (e.key === KEYS.SUBMIT) addCategoryToList()
    })
    container.innerHTML
    await loadInitialCategories()
  },
}

async function loadInitialCategories() {
  try {
    const categories = await getData<Category>(API_URLS.CATEGORIES)
    categories.forEach(createCategory)
  } catch (error) {
    console.error('Failed to load initial categories:', error)
    showStatusMessage('Could not load categories. Check console for details')
  }
}

async function addCategoryToList(): Promise<void> {
  try {
    const postResponse = await postData<ClientCategory, Category>(
      API_URLS.CATEGORIES,
      {
        title: trimmedTitle(titleInput),
        color: colorInput.value,
      },
    )
    createCategory(postResponse)
    titleInput.value = ''
  } catch (error) {
    console.error('Failed to add category', error)
  }
}
