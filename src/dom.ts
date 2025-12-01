import './style.css'


// Get only non-null element.
function getRequiredElement<T extends HTMLElement>(selector: string): T {
    const el = document.querySelector<T>(selector)
    if (!el) throw new Error(`Element ${selector} not found`)
    return el
}
// DOM
export const toDoInput = getRequiredElement<HTMLInputElement>('#todo-input')
export const addButton = getRequiredElement<HTMLButtonElement>('#add-todo-button')
export const toDoList = getRequiredElement<HTMLUListElement>('ul')
export const errorMsg = getRequiredElement<HTMLParagraphElement>('#error-msg')
export const clearAllBtn = getRequiredElement<HTMLButtonElement>('#delete-all')
export const dateInput = getRequiredElement<HTMLInputElement>('#todo-date-input')
export const overdueMsg = getRequiredElement<HTMLHeadingElement>('#overdue-message')
// Show or hide error message
export const showError = (message: string) => {
    errorMsg.classList.remove('hidden')
    errorMsg.textContent = message
}
export const hideError = () => {
    errorMsg.classList.add('hidden')
    errorMsg.textContent = ''
}