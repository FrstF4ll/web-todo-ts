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
        cursor: 'pointer',
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

export function renderSettingsWindow(
  categoryElement: HTMLLIElement,
  parentElementBackgroundColors: string,
  parentElementTitleContent: string,
) {
  modal.innerHTML = `
        <h2>Settings</h2>
        <main>
            <div>
                <label>Title</label>
                <input type="text" id="new-title-input" value="${parentElementTitleContent}">
            </div>
            <div>
                <label>Color</label>
                <input type="color" id="color-input" value="${parentElementBackgroundColors}">
            </div>
        </main>
        <div id="save-cancel-wrapper">
        <button id="save-btn">Apply</button>
        <button id="cancel-btn">Cancel</button>
        </div>
    `
  styleModalChildrenElements()

  overlay.appendChild(modal)
  document.body.appendChild(overlay)

  const saveBtn = modal.querySelector('#save-btn') as HTMLButtonElement
  const cancelBtn = modal.querySelector('#cancel-btn') as HTMLButtonElement
  cancelBtn.onclick = () => overlay.remove()
  saveBtn.onclick = async () => {
    const color = (modal.querySelector('#color-input') as HTMLInputElement)
      .value
    const title = (modal.querySelector('#new-title-input') as HTMLInputElement)
      .value
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
