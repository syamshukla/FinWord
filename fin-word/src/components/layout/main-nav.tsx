/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { db, firebaseConfig, app, auth, fireStore } from '@/lib/firebase/index'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { HamburgerMenuIcon, RocketIcon } from '@radix-ui/react-icons'
import { ModeToggle } from '../mode-toggle'
import ProfileDropdown from './profile-dropdown'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export default function MainNav() {
  const [user] = useAuthState(auth)
  const router = useRouter()
  const [avatar, setAvatar] = useState(false)
  const pathname = usePathname()
  useEffect(() => {
    const checkUser = async () => {
      const authUser = getAuth().currentUser

      if (authUser) {
        console.log('User exists')
        setAvatar(true)
      } else {
        console.log('User does not exist')
        setAvatar(false)
      }
    }

    checkUser()
  }, [router])

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        className="flex items-center justify-between px-3 py-3"
        aria-label="Global"
      >
        <div className="flex items-center gap-x-12">
          <Link href="/" className="flex items-center space-x-2">
            <RocketIcon className="h-5 w-5 text-foreground" />
            <span className="overflow-auto font-semibold leading-tight tracking-tight">
              BULL-ISH
            </span>
          </Link>
          <div className="hidden md:flex md:gap-x-12">
            <Link
              href="/play"
              className={cn(
                'text-sm font-light transition-colors hover:text-foreground/80',
                pathname === '/play' ? 'text-foreground' : 'text-foreground/60',
              )}
            >
              Play
            </Link>
            <Link
              href="/results"
              className={cn(
                'text-sm font-light transition-colors hover:text-foreground/80',
                pathname === '/results'
                  ? 'text-foreground'
                  : 'text-foreground/60',
              )}
            >
              Your Picks
            </Link>

            <Link
              href="/stats"
              className={cn(
                'text-sm font-light transition-colors hover:text-foreground/80',
                pathname === '/stats'
                  ? 'text-foreground'
                  : 'text-foreground/60',
              )}
            >
              Scoreboard
            </Link>
          </div>
        </div>

        <div className="text-foreground">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
          </button>
        </div>
        <div className="flex items-center space-x-1">
          {user ? (
            // <>
            //   <span>{user.displayName || user.email}</span>
            // </>
            <ProfileDropdown user={user} />
          ) : null}
          {user === null && (
            <Button asChild>
              <Link href="/login">Log In</Link>
            </Button>
          )}
          <ModeToggle />
          <div className="block md:hidden">
            <Popover>
              <PopoverTrigger>
                <Button variant="ghost" size="icon">
                  <HamburgerMenuIcon className="h-6 w-6 text-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-2 ">
                <Button variant="outline" asChild>
                  <Link href="/play">
                    <RocketIcon className="mr-2 h-5 w-5 text-foreground" />
                    Play Now
                  </Link>
                </Button>

                <Button variant="outline" asChild>
                  <Link href="/results">Your Picks</Link>
                </Button>

                <Button variant="outline" asChild>
                  <Link href="/stats">Scoreboard</Link>
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </nav>
    </header>
  )
}
