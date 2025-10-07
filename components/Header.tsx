"use client"
import { useEffect, useState } from 'react'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { usePathname, useRouter } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    setHasToken(!!localStorage.getItem('token'))
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setHasToken(false)
    router.push('/login')
  }

  let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/blog" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <Logo />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      {pathname !== '/login' ? (
        <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
          <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
            {headerNavLinks
              .map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-gray-900 dark:text-gray-100"
                >
                  {link.title}
                </Link>
              ))}
          </div>
          {/* <SearchButton /> */}
          <ThemeSwitch />
          <MobileNav />
          {hasToken ? (
            <span
              onClick={handleLogout}
              className="ml-4 px-4 py-2 hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleLogout()
              }}
            >
              Sair
            </span>
          ) : (
            <Link
              href="/login"
              className="ml-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded"
            >
              {/* Login */}
            </Link>
          )}
        </div>
      ) : (
        <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
          <ThemeSwitch />
        </div>
      )}
    </header>
  )
}

export default Header
