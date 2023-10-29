import type { SVGProps } from 'react'

interface ArrowUpProps extends SVGProps<SVGElement> {
  className?: string
}

export function ArrowUp({ className, ...rest }: ArrowUpProps) {
  return (
    <svg
      className={className}
      {...rest}
      version='1.1'
      viewBox='0 0 180 180'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='m90 0a90 90 0 0 0-90 90 90 90 0 0 0 90 90 90 90 0 0 0 90-90 90 90 0 0 0-90-90zm0 33.734c0.42058 0 0.84079 0.023343 1.2598 0.064453 0.36475 0.035089 0.72308 0.09165 1.0781 0.15625 0.042642 0.00786 0.086336 0.011231 0.12891 0.019531 0.38281 0.073615 0.75523 0.16893 1.125 0.27539 0.02889 0.00845 0.059091 0.014938 0.087891 0.023438 2.2295 0.65887 4.197 1.9016 5.7402 3.5527l35.346 35.346c5.0519 5.0519 5.0519 13.186 0 18.238s-13.186 5.0519-18.238 0l-13.631-13.633v55.592c0 7.1445-5.752 12.896-12.896 12.896-7.1445 0-12.896-5.752-12.896-12.896v-55.592l-13.631 13.633c-5.0519 5.0519-13.186 5.0519-18.238 0-5.0519-5.0519-5.0519-13.186 0-18.238l35.346-35.346c1.5432-1.6511 3.5107-2.8939 5.7402-3.5527 0.02862-0.00845 0.059181-0.015238 0.087891-0.023438 0.36976-0.10646 0.74219-0.20178 1.125-0.27539 0.042192-0.00809 0.086606-0.011831 0.12891-0.019531 0.35505-0.064597 0.71337-0.12116 1.0781-0.15625 0.41898-0.04112 0.83919-0.064451 1.2598-0.064453z'
        strokeWidth='7.9215'
      ></path>
    </svg>
  )
}