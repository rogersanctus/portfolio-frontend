interface Props {
  section?: string
  url?: string
  name: string
}

export function MenuItem({ section, url, name }: Props) {
  let href = url

  if (section) {
    href = `#${section}`
  }

  return (
    <li className='text-md font-semibold fitmenu:text-lg uppercase'>
      <a
        href={href}
        className='flex flex-col items-center fitmenu:static relative'
      >
        <span className='fitmenu:z-auto z-10 whitespace-nowrap fitmenu:p-0 p-2'>
          {name}
        </span>
        <div className='fitmenu:static absolute w-full h-full fitmenu:w-0 fitmenu:h-[3px] fitmenu:mt-1 fitmenu:bg-blue-500 bg-gray-900'></div>
      </a>
    </li>
  )
}
