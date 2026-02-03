import './style.css'

import { CategoriesPage } from './pages/categories'
import { TodosPage } from './pages/todos'
import {
  customStatusMessage,
  defaultStatusMessage,
  getSingleRequiredElement,
} from './utils'

type Page = {
  render: () => string
  init: () => Promise<void>
}

const pages: Record<string, Page> = {
  '/': TodosPage,
  '/categories': CategoriesPage,
}

const appContent = getSingleRequiredElement<HTMLDivElement>('#app-content')
const navButtons = document.querySelectorAll<HTMLButtonElement>('.nav-link')

async function loadPage(route: string): Promise<void> {
  const page = pages[route]

  if (!page) {
    console.error(`Page not found: ${route}`)
    return
  }

  try {
    // Add fade effect
    appContent.classList.add('is-switching')

    // Clear and render new page
    appContent.innerHTML = page.render()

    // Initialize page
    await page.init()

    // Remove fade effect
    appContent.classList.remove('is-switching')
    defaultStatusMessage()
  } catch (error) {
    console.error(`Failed to load page ${route}:`, error)
    customStatusMessage('Failed to load page. Check console for details.')
    appContent.classList.remove('is-switching')
  }
}

// Setup navigation
navButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const route = btn.getAttribute('data-route') || '/'
    loadPage(route)
  })
})

// Load initial page
loadPage('/')
