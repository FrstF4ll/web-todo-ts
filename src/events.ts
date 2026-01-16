import { deleteAllData } from './api'
import { showStatusMessage, toDoList } from './dom'
import { API_URLS } from './constants'

export async function deleteAllTask() {
  try {
    if (toDoList.children.length === 0) {
      showStatusMessage('Todo-list already clean.')
      return
    }
    if (!window.confirm('Are you sure you want to delete all tasks?')) {
      return
    }
    await deleteAllData(API_URLS.TODOS)
    toDoList.innerHTML = ''
    showStatusMessage('All tasks successfully deleted')
  } catch (error) {
    console.error('Failed to delete Tasks : ', error)
    showStatusMessage('Failed to delete all Tasks, check console for details.')
  }
}
