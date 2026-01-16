// constants.ts
// for easier re-use and modification
// use 'as const' to prevent adding and changing properties out of its box
export const SELECTORS = {
  TODO_LIST: 'li',
  TODO_LIST_ELEMENTS: '#todos-container',
  LABEL: 'label',
  BUTTON: 'button',
  INPUT: 'input',
  TIME: 'time',
  PARAGRAPH: 'p',
  DELETE_BTN: '.delete-btn',
  TODO_CHECKBOX: '.todo-elements__checkbox',
  TODO_INPUT: '#todo-input',
  ADD_BUTTON: '#add-todo-button',
  DELETE_ALL: '#delete-all',
  ERROR_MESSAGE: '#error-msg',
  DATE_INPUT: '#todo-date-input',
  OVERDUE_MESSAGE: '#overdue-message',
} as const

export const INPUT_TYPES = {
  CHECKBOX: 'checkbox',
  BUTTON: 'button',
} as const

export const EVENT_TYPES = {
  CHANGE: 'change',
  CLICK: 'click',
  KEY_PRESS: 'keydown',
} as const

export const CSS_CLASSES = {
  HIDDEN: 'hidden',
  COMPLETED: 'completed',
  TODO_ELEMENT: 'todo-elements',
  TODO_CHECKBOX: 'todo-elements__checkbox',
  DELETE_BTN: 'delete-btn',
  DUE_DATE: 'due-date',
} as const

export const KEYS = {
  SUBMIT: 'Enter',
} as const

export const DATE_CONFIG = {
  SOON_THRESHOLD_DAYS: 4,
  MS_PER_DAY: 1000 * 60 * 60 * 24,
} as const
