import { getData, postData } from '../api'
import {
  API_URLS,
  EVENT_TYPES,
  KEYS,
  SELECTORS,
} from '../global-variables/constants'
import type { Category, ClientCategory } from '../global-variables/interface'
import { createCategory } from '../item-generation/categorie-generation'
import {
  getSingleRequiredElement,
  showStatusMessage,
  trimmedTitle,
} from '../utils'

let addButton: HTMLButtonElement
let titleInput: HTMLInputElement
let colorInput: HTMLInputElement
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
    addButton = getSingleRequiredElement<HTMLButtonElement>(
      SELECTORS.ADD_CATEGORY_BUTTON,
    )
    titleInput = getSingleRequiredElement<HTMLInputElement>(
      SELECTORS.CATEGORY_INPUT,
    )
    colorInput = getSingleRequiredElement<HTMLInputElement>(
      SELECTORS.CATEGORY_COLOR_INPUT,
    )

    container = getSingleRequiredElement<HTMLUListElement>(
      SELECTORS.CATEGORY_LIST_ELEMENTS,
    )

    addButton.addEventListener(EVENT_TYPES.CLICK, () => addCategoryToList())
    titleInput.addEventListener(EVENT_TYPES.KEY_PRESS, (e: KeyboardEvent) => {
      if (e.key === KEYS.SUBMIT) addCategoryToList()
    })
    container.innerHTML = ''
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
