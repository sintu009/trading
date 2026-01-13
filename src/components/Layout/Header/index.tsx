'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { headerData } from '../Header/Navigation/menuData'
import Logo from './Logo'
import Image from 'next/image'
import HeaderLink from '../Header/Navigation/HeaderLink'
import MobileHeaderLink from '../Header/Navigation/MobileHeaderLink'
import Signin from '@/components/Auth/SignIn'
import SignUp from '@/components/Auth/SignUp'
import { useTheme } from 'next-themes'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { Icon } from '@iconify/react/dist/iconify.js'

const Header: React.FC = () => {
  const pathUrl = usePathname()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState(null)
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)

  const navbarRef = useRef<HTMLDivElement>(null)
  const signInRef = useRef<HTMLDivElement>(null)
  const signUpRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/'
  }

  const handleScroll = () => {
    setSticky(window.scrollY >= 80)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      signInRef.current &&
      !signInRef.current.contains(event.target as Node)
    ) {
      setIsSignInOpen(false)
    }
    if (
      signUpRef.current &&
      !signUpRef.current.contains(event.target as Node)
    ) {
      setIsSignUpOpen(false)
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [navbarOpen, isSignInOpen, isSignUpOpen])

  useEffect(() => {
    if (isSignInOpen || isSignUpOpen || navbarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isSignInOpen, isSignUpOpen, navbarOpen])

  // Don't render header on admin pages
  if (pathUrl.includes('/admin')) {
    return null
  }

  return (
    <header
      className={`fixed top-0 z-40 w-full pb-5 transition-all duration-300 ${sticky ? ' shadow-lg bg-background pt-5' : 'shadow-none pt-7'
        }`}>
      <div className='lg:py-0 py-2'>
        <div className='container px-4 flex items-center justify-between'>
          <Logo />
          <nav className='hidden lg:flex grow items-center gap-8 justify-center'>
            {headerData.map((item, index) => (
              <HeaderLink key={index} item={item} />
            ))}
          </nav>
          <div className='sm:flex hidden gap-4 items-center'>
            {user && !pathUrl.includes('/admin') ? (
              <>
                <Link href='/dashboard' className='flex items-center gap-2 text-white hover:text-primary'>
                  <Icon icon='mdi:wallet' className='text-xl' />
                  <span>${user.wallet?.balance?.toFixed(2) || '0.00'}</span>
                </Link>
                <span className='text-white text-sm'>Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className='bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm'
                >
                  Logout
                </button>
              </>
            ) : user ? (
              <>
                <span className='text-white text-sm'>Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className='bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm'
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Dialog>
                  <DialogTrigger className='bg-transparent border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white'>
                    Sign In
                  </DialogTrigger>
                  <DialogContent className='bg-[#0d121c]'>
                    <Signin />
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger className='bg-primary text-white px-4 py-2 rounded-lg hover:bg-transparent hover:text-primary border border-primary'>
                    Sign Up
                  </DialogTrigger>
                  <DialogContent className='bg-[#0d121c]'>
                    <SignUp />
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
          <button
            onClick={() => setNavbarOpen(!navbarOpen)}
            className='block lg:hidden p-2 rounded-lg'
            aria-label='Toggle mobile menu'>
            <span className='block w-6 h-0.5 bg-white'></span>
            <span className='block w-6 h-0.5 bg-white mt-1.5'></span>
            <span className='block w-6 h-0.5 bg-white mt-1.5'></span>
          </button>
        </div>
        {navbarOpen && (
          <div className='fixed top-0 left-0 w-full h-full bg-black/50 z-40' />
        )}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden fixed top-0 right-0 h-full w-full bg-background shadow-lg transform transition-transform duration-300 max-w-xs ${navbarOpen ? 'translate-x-0' : 'translate-x-full'
            } z-50`}>
          <div className='flex items-center justify-between p-4'>
            <h2 className='text-lg font-bold text-foreground dark:text-foreground'>
              <Logo />
            </h2>
            <button
              onClick={() => setNavbarOpen(false)}
              className="bg-[url('/images/closed.svg')] bg-no-repeat bg-contain w-5 h-5 absolute top-0 right-0 mr-8 mt-8 dark:invert"
              aria-label='Close menu Modal'></button>
          </div>
          <nav className='flex flex-col items-start p-4'>
            {headerData.map((item, index) => (
              <MobileHeaderLink key={index} item={item} />
            ))}
            <div className='mt-4 flex flex-col gap-4 w-full'>
              {user ? (
                <>
                  <Link href='/dashboard' className='text-white hover:text-primary'>
                    Dashboard
                  </Link>
                  <span className='text-white'>Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg'
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href='/signin'
                    className='bg-transparent border border-primary text-primary px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white'
                    onClick={() => setNavbarOpen(false)}>
                    Sign In
                  </Link>
                  <Link
                    href='/signup'
                    className='bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700'
                    onClick={() => setNavbarOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
