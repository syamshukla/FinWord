'use client'

import React from 'react'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

import { RocketIcon } from '@radix-ui/react-icons'
import { ModeToggle } from '../mode-toggle'

export default function MainNav() {
  const pathname = usePathname()

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
              FinWord
            </span>
          </Link>
          <div className="hidden md:flex md:gap-x-12">
            <Link
              href="/test"
              className={cn(
                'text-sm font-light transition-colors hover:text-foreground/80',
                pathname === '/test' ? 'text-foreground' : 'text-foreground/60',
              )}
            >
              Test
            </Link>
          </div>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
          </button>
        </div>
        <div className="flex items-center space-x-1">
          <Button asChild>
            <Link href="/play">Play Now</Link>
          </Button>
          <ModeToggle />
        </div>
      </nav>
    </header>
  )
}
