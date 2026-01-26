import { patchData } from './api'
import { API_URLS, SELECTORS } from './constants'

function createModal() {
  const modal = document.createElement('div')
  Object.assign(modal.style, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px',
    backgroundColor: '#638519',
    padding: '24px',
    borderRadius: '12px',
    maxWidth: '300px',
    minHeight: '320px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', // "Pop" effect
    color: 'whitesmoke', // Text color
  })
  return modal
}

function createOverlay() {
  const overlay = document.createElement('div')
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: '1000',

    // Centering Logic (The most important part)
    display: 'flex',
    justifyContent: 'center', // Centers horizontally
    alignItems: 'center', // Centers vertically
  })
  return overlay
}

const overlay = createOverlay()
const modal = createModal()

function styleModalChildrenElements() {
  const mainSection = modal.querySelector('main')

  if (mainSection)
    Object.assign(mainSection.style, {
      display: 'flex',
      flexDirection: 'row',
      gap: '20px',
      padding: '1.5rem',
      alignItems: 'center',
    })

  const h2 = modal.querySelector('h2')
  if (h2)
    Object.assign(h2.style, {
      textAlign: 'center',
    })

  const colorInput = modal.querySelectorAll('input')
  if (colorInput)
    colorInput.forEach((inputEl) => {
      Object.assign(inputEl.style, {
        height: '25px',
        cursor: 'pointe r',
        padding: '0.2rem',
      })
    })
  const modalButton = modal.querySelectorAll('button')
  if (modalButton)
    modalButton.forEach((btn) => {
      Object.assign(btn.style, {
        cursor: 'pointer',
      })
    })

  const saveAndCancelWrapper = modal.querySelector(
    '#save-cancel-wrapper',
  ) as HTMLDivElement
  if (saveAndCancelWrapper)
    Object.assign(saveAndCancelWrapper.style, {
      display: 'flex',
      flexDirection: 'row',
      gap: '150px',
    })
}

const rgbToHex = (rgb: string): string => {
  const matches = rgb.match(/\d+/g)

  // If no numbers are found, return a default (like black) or an empty string
  if (!matches) return '#000000'

  return `#${matches
    .slice(0, 3)
    .map((x) => (+x).toString(16).padStart(2, '0'))
    .join('')}`
}

export function renderSettingsWindow(
  categoryElement: HTMLLIElement,
  parentElementBackgroundColors: string,
  parentElementTitleContent: string,
) {
  // Clear modal
  modal.innerHTML = ''

  // Create h2
  const h2 = document.createElement('h2')
  h2.textContent = 'Settings'
  modal.appendChild(h2)

  // Create main section
  const main = document.createElement('main')

  // Title input group
  const titleDiv = document.createElement('div')
  const titleLabel = document.createElement('label')
  titleLabel.textContent = 'Title'
  const titleInput = document.createElement('input')
  titleInput.type = 'text'
  titleInput.id = 'new-title-input'
  titleInput.value = parentElementTitleContent
  titleDiv.appendChild(titleLabel)
  titleDiv.appendChild(titleInput)

  // Color input group
  const colorDiv = document.createElement('div')
  const colorLabel = document.createElement('label')
  colorLabel.textContent = 'Color'
  const colorInput = document.createElement('input')
  colorInput.type = 'color'
  colorInput.id = 'color-input'
  colorInput.value = rgbToHex(parentElementBackgroundColors)
  colorDiv.appendChild(colorLabel)
  colorDiv.appendChild(colorInput)

  main.appendChild(titleDiv)
  main.appendChild(colorDiv)
  modal.appendChild(main)

  // Create buttons wrapper
  const saveAndCancelWrapper = document.createElement('div')
  saveAndCancelWrapper.id = 'save-cancel-wrapper'

  const saveBtn = document.createElement('button')
  saveBtn.id = 'save-btn'
  saveBtn.textContent = 'Apply'

  const cancelBtn = document.createElement('button')
  cancelBtn.id = 'cancel-btn'
  cancelBtn.textContent = 'Cancel'

  saveAndCancelWrapper.appendChild(saveBtn)
  saveAndCancelWrapper.appendChild(cancelBtn)
  modal.appendChild(saveAndCancelWrapper)

  styleModalChildrenElements()
  overlay.appendChild(modal)
  document.body.appendChild(overlay)

  cancelBtn.onclick = () => overlay.remove()
  saveBtn.onclick = async () => {
    const color = colorInput.value
    const title = titleInput.value
    await patchData(API_URLS.CATEGORIES, categoryElement.id, {
      title: title,
      color: color,
    })

    // Update the UI
    categoryElement.style.backgroundColor = color
    const titleElement = categoryElement.querySelector(SELECTORS.CATEGORY_TITLE)
    if (!titleElement) {
      return
    }
    titleElement.textContent = title

    overlay.remove()
  }
}
