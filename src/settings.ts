import { patchData } from './api'
import { API_URLS, SELECTORS } from './constants'

function createModal() {
  const modal = document.createElement('div')
  modal.className = 'settings-modal'
  return modal
}

function createOverlay() {
  const overlay = document.createElement('div')
  overlay.className = 'settings-overlay'
  return overlay
}

const overlay = createOverlay()
const modal = createModal()

const rgbToHex = (rgb: string): string => {
  const matches = rgb.match(/\d+/g)
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
  saveAndCancelWrapper.className = 'save-cancel-wrapper'

  const saveBtn = document.createElement('button')
  saveBtn.id = 'save-btn'
  saveBtn.textContent = 'Apply'

  const cancelBtn = document.createElement('button')
  cancelBtn.id = 'cancel-btn'
  cancelBtn.textContent = 'Cancel'

  saveAndCancelWrapper.appendChild(saveBtn)
  saveAndCancelWrapper.appendChild(cancelBtn)
  modal.appendChild(saveAndCancelWrapper)

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

    categoryElement.style.backgroundColor = color
    const titleElement = categoryElement.querySelector(SELECTORS.CATEGORY_TITLE)
    if (!titleElement) {
      return
    }
    titleElement.textContent = title

    overlay.remove()
  }
}
