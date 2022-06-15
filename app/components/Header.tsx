/* eslint-disable @next/next/no-img-element */
import { ConnectButton } from '@rainbow-me/rainbowkit'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'

const navs = [
  { name: 'Home', url: '/' },
  { name: 'Initialize', url: '/init' },
]

const Header: FC = () => {
  const router = useRouter()

  return (
    <nav className="container-fluid flex items-center mt-3 mx-2 justify-between">
      <div className="inline-flex items-center justify-center">
        <Link href="/">
          <a>
            <img
              className="h-8"
              src="https://s.gitcoin.co/static/v2/images/top-bar/grants-symbol-pos.77da7200d2c5.svg"
              alt="Grants"
            />
          </a>
        </Link>
        <div className="ml-20">
          {navs.map((nav) => {
            return (
              <Link href={nav.url} key={nav.name}>
                <a
                  className={classNames(
                    nav.url === router.pathname
                      ? 'bg-gray-600 text-white'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white',
                    'px-3 py-2 rounded-md text-sm font-medium mr-3'
                  )}
                  aria-current={nav.url === router.pathname ? 'page' : undefined}
                >
                  {nav.name}
                </a>
              </Link>
            )
          })}
        </div>
      </div>

      <ConnectButton />
    </nav>
  )
}

export default Header
