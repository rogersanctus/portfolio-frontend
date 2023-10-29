import { createContext } from 'react'

interface State {
  isOpen: boolean
}

export const initialState: State = {
  isOpen: true
}

type Actions = 'toggle' | 'reset' | 'store'

export interface Action<T> {
  type: Actions
  payload?: T
}

export function menuStoreReducer(state: State, action: Action<boolean>) {
  switch (action.type) {
    case 'toggle':
      const newIsOpen = action.payload ?? !state.isOpen

      return {
        ...state,
        isOpen: newIsOpen
      }
    case 'reset':
      return initialState

    case 'store':
      localStorage.setItem('isMenuOpen', String(state.isOpen))
      return state

    default:
      return state
  }
}

export interface MenuStoreContext {
  state: State
  dispatch: (action: Action<boolean>) => void
}

/* eslint-disable @typescript-eslint/no-empty-function */
export const menuStoreContext = createContext<MenuStoreContext>({
  state: initialState,
  dispatch: () => {}
})
