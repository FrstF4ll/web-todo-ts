import { overdueMsg } from './dom'
//To midnight normalization
export function toMidnight(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

const dueSoonDaysThreshold = 4
const msInDay = 1000 * 60 * 60 * 24
const dueDateStatus = {
  PastDue: 'due-date--past-due',
  DueToday: 'due-date--due-today',
  DueSoon: 'due-date--due-soon',
  DueLater: 'due-date--due-later',
}

//Dynamic color switch depending on due dates
function dueColor(dateString: string): string | null {
  const today = toMidnight(new Date())
  const selectedDate = toMidnight(new Date(dateString))
  const dayDiff = (selectedDate - today) / msInDay

  if (Number.isNaN(dayDiff)) {
    return null
  }

  if (dayDiff < 0) {
    return dueDateStatus.PastDue
  }
  if (dayDiff === 0) {
    return dueDateStatus.DueToday
  }
  if (dayDiff <= dueSoonDaysThreshold) {
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
  overdueMsg.classList.toggle('hidden', noOverdueTasks)
}
