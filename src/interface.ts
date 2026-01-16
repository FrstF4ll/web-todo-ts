//Interface

export interface ClientTask {
  title: string
  due_date: string | null
  done: boolean
}

export interface Task extends ClientTask {
  id: number
}

export interface ClientCategory {
  title: string
  color: string
}

export interface Category extends ClientCategory {
  id: number
}
