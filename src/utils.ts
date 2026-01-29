import { CSS_CLASSES, DATE_CONFIG } from './constants'
import { overdueMsg, dateInput, toDoInput, errorMsg } from './dom'
import { postData } from './api'



export const showStatusMessage = (message: string) => {
  errorMsg.classList.remove(CSS_CLASSES.HIDDEN)
  errorMsg.textContent = message
}

export const hideStatusMessage = () => {
  errorMsg.classList.add(CSS_CLASSES.HIDDEN)
  errorMsg.textContent = ''
}

const dueDateStatus = {
  PastDue: 'due-date--past-due',
  DueToday: 'due-date--due-today',
  DueSoon: 'due-date--due-soon',
  DueLater: 'due-date--due-later',
}

//To midnight normalization
export function toMidnight(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

//Dynamic color switch depending on due dates
function dueColor(dateString: string): string | null {
  const today = toMidnight(new Date())
  const selectedDate = toMidnight(new Date(dateString))
  const dayDiff = (selectedDate - today) / DATE_CONFIG.MS_PER_DAY

  if (Number.isNaN(dayDiff)) {
    return null
  }

  if (dayDiff < 0) {
    return dueDateStatus.PastDue
  }
  if (dayDiff === 0) {
    return dueDateStatus.DueToday
  }
  if (dayDiff <= DATE_CONFIG.SOON_THRESHOLD_DAYS) {
    return dueDateStatus.DueSoon
  }
  return dueDateStatus.DueLater
}

export function dateColorSetUp(dueDate: HTMLTimeElement): void {
  if (!dueDate.dateTime) {
    return
  }

  const verifiedTime = dueColor(dueDate.dateTime)
  if (verifiedTime) {
    dueDate.classList.add(verifiedTime)
  }
}

export function updateOverdueMessageDisplay() {
  const overduedTasks = document.querySelectorAll('.due-date--past-due')
  const noOverdueTasks = overduedTasks.length === 0
  overdueMsg?.classList.toggle(CSS_CLASSES.HIDDEN, noOverdueTasks)
}

export function getRequiredElement<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector)
  if (!el) throw new Error(`Element ${selector} not found`)
  return el
}

export function verifiedDate() {
  const selectedDate = dateInput!.value
  if (!selectedDate) return null;
  const selectedMidnight = toMidnight(new Date(selectedDate))
  const todayMidnight = toMidnight(new Date())
  if (todayMidnight > selectedMidnight) {
    showStatusMessage('Invalid date: date too early')
    throw new Error("DATE_TOO_EARLY")
  }
  return selectedDate
}


export function trimmedTitle() {
  const trimmed = toDoInput!.value.trim()
  if (trimmed.length === 0) {
    showStatusMessage('Invalid task name: Empty name')
    throw new Error("TITLE_EMPTY")
  }
  return trimmed
}


export async function sendDataToAPI<T_Client, T_Server>(url: string, clientSideItem: T_Client, elementGeneration: (data: T_Server) => void) {
  try {
    const postResponse = await postData<T_Client, T_Server>(
      url,
      clientSideItem,
    )
    elementGeneration(postResponse)
  } catch (error) {
    showStatusMessage('Data not posted as intended')
    console.error('Failed to send data: ', error)
  }
}
