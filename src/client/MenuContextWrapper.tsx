import {
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react'
import { FIT_MENU } from '@src/consts'
import {
  type MenuStoreContext,
  initialState,
  menuStoreContext,
  menuStoreReducer
} from './menu-store'

function getIsMenuOpen() {
  const isMenuOpen =
    localStorage.getItem('isMenuOpen') ?? String(initialState.isOpen)

  return isMenuOpen === 'true'
}

interface MenuContextWrapperProps {
  children: ReactNode
}

const initialOuter = {
  wasMobileSizingToggled: false,
  oldFitMenu: false
}

const outer = { ...initialOuter }

export function MenuContextWrapper({ children }: MenuContextWrapperProps) {
  const [state, dispatch] = useReducer(menuStoreReducer, initialState)

  useEffect(() => {
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
          dispatch({ type: 'toggle', payload: true })
        } else {
          dispatch({ type: 'toggle', payload: getIsMenuOpen() })
        }

        outer.wasMobileSizingToggled = true
      }

      if (outer.oldFitMenu !== fitMenu) {
        outer.wasMobileSizingToggled = false
      }
    }

    function load() {
      dispatch({ type: 'reset' })
      outer.wasMobileSizingToggled = initialOuter.wasMobileSizingToggled
      outer.oldFitMenu = initialOuter.oldFitMenu

      const isMenuOpen = getIsMenuOpen()

      dispatch({ type: 'toggle', payload: isMenuOpen })
      processWindowSize()

      window.addEventListener('resize', processWindowSize)
    }

    load()

    return () => {
      window.removeEventListener('resize', processWindowSize)
    }
  }, [])

  const context = useMemo(
    () => ({
      state,
      dispatch
    }),
    [state]
  )

  return (
    <menuStoreContext.Provider value={context}>
      {children}
    </menuStoreContext.Provider>
  )
}

export const useMenuStore = () => useContext<MenuStoreContext>(menuStoreContext)
