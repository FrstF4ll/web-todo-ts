//Interface

export interface ClientTask {
  title: string
  due_date: string | null
  done: boolean
}

export interface Task extends ClientTask {
  id: number
}
