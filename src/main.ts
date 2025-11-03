import './style.css'
// Element null check
function getRequiredElement<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector)
  if (!el) throw new Error(`Element ${selector} not found`)
  return el
}

// Get elements from HTML

const toDoInput = getRequiredElement<HTMLInputElement>('#todo-input')
const addButton = getRequiredElement<HTMLButtonElement>('#add-todo-button')
const toDoList = getRequiredElement<HTMLUListElement>('ul')
const errorMsg = getRequiredElement<HTMLParagraphElement>('#error-msg')
const taskList: string[] = JSON.parse(localStorage.getItem('tasks') || '[]')
const taskText = toDoInput.value.trim()

//Rendering
function renderTask(): void{
  const newTask = document.createElement('li')
  newTask.className = 'todo-elements'
  newTask.textContent = taskText
  toDoList.appendChild(newTask)
  toDoInput.value = '' 
    taskList.push(taskText);  
  localStorage.setItem('tasks', JSON.stringify(taskList)); 
}

//Validation 
function addToList(): void {
  if (!taskText) {
    errorMsg.classList.remove('hidden')
    return
  }
  errorMsg.classList.add('hidden')
  renderTask()
  return
}



toDoInput.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    addToList()
  }
})
addButton.addEventListener('click', addToList)
