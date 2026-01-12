// constants.ts
// use 'as const' to prevent adding and changing properties for these objects
const SELECTORS = {
    TODO_INPUT: '#todo-input',
    ADD_BUTTON: '#add-todo-button',
    TODO_LIST: 'ul',
    DELETE_ALL: '#delete-all',
    ERROR_MESSAGE: '#error-msg',
    DATE_INPUT: '#todo-date-input',
    OVERDUE_MESSAGE: '#overdue-message',
} as const
export const SEL = SELECTORS

const CSS_CLASSES = {
    CHECKBOX: 'todo-elements__checkbox',
    DELETE_BTN: 'delete-btn',
    DUE_DATE: 'due-date',
    TODO_ELEMENT: 'todo-elements',
    HIDE: 'hidden',
} as const
export const CLASS = CSS_CLASSES

export const KEYS = {
    SUBMIT: 'Enter',
} as const

const DUE_DATE_CONFIG = {
    SOON_THRESHOLD_DAYS: 4,
    MS_PER_DAY: 1000 * 60 * 60 * 24,
} as const

export const DATE = DUE_DATE_CONFIG