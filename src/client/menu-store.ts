import { FIT_MENU } from '@src/consts'
import { atom } from 'nanostores'

/// state
const initialValue = true
export const isMenuOpen = atom(initialValue)

function getIsMenuOpen() {
  const isOpen = localStorage.getItem('isMenuOpen') ?? String(initialValue)

  return isOpen === 'true'
}

export function toggleMenu(newValue?: boolean) {
  isMenuOpen.set(newValue ?? !isMenuOpen.get())
}

export function resetMenu() {
  isMenuOpen.set(initialValue)
}

export function storeMenuState() {
  localStorage.setItem('isMenuOpen', String(isMenuOpen.get()))
}

/// handling
const initialOuter = {
  wasMobileSizingToggled: false,
  oldFitMenu: false
}

const outer = { ...initialOuter }

function processWindowSize() {
  let fitMenu = false

  if (window.innerWidth >= FIT_MENU) {
    fitMenu = true
  }

  if (window.innerWidth < FIT_MENU) {
    fitMenu = false
  }

  if (!outer.wasMobileSizingToggled) {
    outer.oldFitMenu = fitMenu

    if (fitMenu) {
      toggleMenu(true)
    } else {
      toggleMenu(getIsMenuOpen())
    }

    outer.wasMobileSizingToggled = true
  }

  if (outer.oldFitMenu !== fitMenu) {
    outer.wasMobileSizingToggled = false
  }
}

export function load() {
  console.log('just called load the menu state')
  resetMenu()

  outer.wasMobileSizingToggled = initialOuter.wasMobileSizingToggled
  outer.oldFitMenu = initialOuter.oldFitMenu

  const isMenuOpen = getIsMenuOpen()

  toggleMenu(isMenuOpen)
  processWindowSize()

  window.addEventListener('resize', processWindowSize)
}

export function unload() {
  console.log('just called unload menu state')
  window.removeEventListener('resize', processWindowSize)
}
