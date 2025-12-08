//Interface

export interface ClientTask {
  title: string
  dueDate: string | null
  done: boolean
}

export interface Task extends ClientTask {
  id: number
}
