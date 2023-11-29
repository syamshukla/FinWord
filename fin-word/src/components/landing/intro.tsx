'use client'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import Link from 'next/link'

export function Intro() {
  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  }
  return (
    <motion.div
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className=" text-center"
    >
      <motion.div
        className="hidden sm:mb-8 sm:flex sm:justify-center"
        variants={FADE_UP_ANIMATION_VARIANTS}
      >
        <div className="relative z-50 rounded-full bg-background px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-ring/10 hover:ring-ring/20">
          Learn how FinWord works.{' '}
          <a href="#" className="font-semibold text-primary">
            <span className="absolute inset-0" aria-hidden="true" />
            Read more <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </motion.div>
      <motion.h1
        className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
        variants={FADE_UP_ANIMATION_VARIANTS}
      >
        Bet against markets with friends
      </motion.h1>
      <motion.p
        className="mt-6 text-lg leading-8 text-muted-foreground"
        variants={FADE_UP_ANIMATION_VARIANTS}
      >
        FinWord is a social betting platform that allows you to bet against
        friends on the future performance of stocks, crypto, and more.
      </motion.p>
      <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild>
            <Link href="/play">Play Now</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/learn-more">Learn More</Link>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}