import { MenuItem } from '@src/client/MenuItem.tsx'
import { useEffect, useRef } from 'react'
import { ArrowUp } from '@src/icons/dynamic/ArrowUp.tsx'
import {
  isMenuOpen,
  storeMenuState,
  toggleMenu,
  load as loadMenu,
  unload as unloadMenu
} from '@src/client/menu-store'
import { useStore } from '@nanostores/react'

export function PageHeader() {
  const $isMenuOpen = useStore(isMenuOpen)
  const btnTopo = useRef<HTMLAnchorElement | null>(null)

  function onToggleMenu() {
    const newIsMenuOpen = !$isMenuOpen
    toggleMenu(newIsMenuOpen)
    storeMenuState()
  }

  useEffect(() => {
    loadMenu()

    if (btnTopo.current !== null) {
      if (window.scrollY <= 0) {
        btnTopo.current.style.display = 'none'
      } else {
        btnTopo.current.style.display = 'block'
      }
    }

    const onScrollEvt = () => {
      if (btnTopo.current === null) {
        return
      }

      if (window.scrollY <= 0 && btnTopo.current.style.display === 'block') {
        btnTopo.current.style.display = 'none'
      } else if (
        btnTopo.current.style.display === 'none' &&
        window.scrollY > 0
      ) {
        btnTopo.current.style.display = 'block'
      }
    }

    document.addEventListener('scroll', onScrollEvt)

    return () => {
      document.removeEventListener('scroll', onScrollEvt)
      unloadMenu()
    }
  }, [btnTopo])

  return (
    <>
      <header
        id='top'
        className='static fitmenu:absolute w-full fitmenu:px-2 fitmenu:py-4 fitmenu:bg-transparent bg-blue-700 fitmenu:border-b-0 border-b border-blue-700'
      >
        <div className='fitmenu:hidden flex items-center'>
          <button
            className='flex items-center outline-none m-2 hover:text-accent text-white'
            onClick={onToggleMenu}
          >
            <svg
              className='w-8 h-8'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path d='M4 6h16M4 12h16M4 18h16'></path>
            </svg>
            <span className='font-semibold uppercase ml-2'>Menu</span>
          </button>
        </div>
        <nav className='flex justify-center'>
          <ul
            className={`${
              $isMenuOpen ? '' : 'hidden'
            } flex fitmenu:flex-row flex-col gap-1 fitmenu:gap-8 text-white fitmenu:text-blue-500 nav-menu cursor-pointer fitmenu:w-auto w-full fitmenu:pb-0 pb-4`}
          >
            <MenuItem name='Sobre mim' section='about_me' />
            <MenuItem name='Habilidades' section='skills' />
            <MenuItem name='No que trabalho' section='about_jobs' />
            {/*<MenuItem name="Portfólio" section="portfolio" />*/}
            <MenuItem name='Experiências' section='experiences' />
            {/*<MenuItem name="Perguntas Frequentes" section="faq" />*/}
            <MenuItem name='Contato' section='contact' />
          </ul>
        </nav>
      </header>
      <div className='absolute z-20'>
        <a
          href='#top'
          className='fixed bottom-4 right-4 hidden'
          title='Go to the top'
          ref={btnTopo}
        >
          <ArrowUp className='fill-current text-lime-500 hover:text-lime-500/70 w-12 h-12 drop-shadow' />
        </a>
      </div>
    </>
  )
}
