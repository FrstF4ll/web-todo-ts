// constants.ts
// for easier re-use and modification
// use 'as const' to prevent adding and changing properties out of its box
const SELECTORS = {
  TODO_LIST: 'li',
  TODO_LIST_ELEMENTS: 'ul',
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
export const SEL = SELECTORS

const INPUT_TYPES = {
  CHECKBOX: 'checkbox',
  BUTTON: 'button',
} as const
export const TYPES = INPUT_TYPES

const EVENT_TYPES = {
  CHANGE: 'change',
  CLICK: 'click',
  KEY_PRESS: 'keydown',
} as const
export const EVENTS = EVENT_TYPES

const CSS_CLASSES = {
  HIDDEN: 'hidden',
  COMPLETED: 'completed',
  TODO_ELEMENT: 'todo-elements',
  TODO_CHECKBOX: 'todo-elements__checkbox',
  DELETE_BTN: 'delete-btn',
  DUE_DATE: 'due-date',
  HIDE: 'hidden',
} as const
export const CSS = CSS_CLASSES

export const KEYS = {
  SUBMIT: 'Enter',
} as const

const DUE_DATE_CONFIG = {
  SOON_THRESHOLD_DAYS: 4,
  MS_PER_DAY: 1000 * 60 * 60 * 24,
} as const
export const DATE = DUE_DATE_CONFIG
