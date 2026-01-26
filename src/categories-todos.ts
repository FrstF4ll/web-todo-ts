import { getData } from "./api"
import { API_URLS, SELECTORS } from "./constants"
import { Category } from "./interface"


// Display all categories in selector

const categorySelector = document.querySelector(SELECTORS.CATEGORY_SELECTOR) as HTMLSelectElement
const categories = await getData<Category>(API_URLS.CATEGORIES)
categories.forEach(category => {
    const newOption = document.createElement('option') as HTMLOptionElement
    newOption.value = category.id.toString()
    newOption.textContent = category.title
    categorySelector.appendChild(newOption)
})
