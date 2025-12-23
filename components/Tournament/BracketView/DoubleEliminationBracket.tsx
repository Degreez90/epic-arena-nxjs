"use client"
import React, { useLayoutEffect, useRef, useState } from "react"
import { StageFrontend } from '@/types/tournament/tournament'
import MatchCard from './MatchCard'
import LoserBracket from './LoserBracket'

interface DoubleEliminationBracketProps {
  stage: StageFrontend
}

const DoubleEliminationBracket: React.FC<DoubleEliminationBracketProps> = ({
  stage,
}) => {
  const groups = stage.groups
  const winnersGroup = groups[0]
  const losersGroup = groups[1]
  const grandFinalGroup = groups[2]

  // --- Winners bracket overlay connector logic ---
  const winnersContainerRef = useRef<HTMLDivElement | null>(null)
  const matchElMapRef = useRef<Map<string, HTMLElement>>(new Map())
  const [winnerPaths, setWinnerPaths] = useState<string[]>([])

  const attachMatchEl = (key: string) => (el: HTMLElement | null) => {
    const map = matchElMapRef.current
    if (!el) {
      map.delete(key)
      return
    }
    map.set(key, el)
  }

  function computeWinnerPaths() {
    if (!winnersContainerRef.current || !winnersGroup) {
      setWinnerPaths([])
      return
    }

    const containerRect = winnersContainerRef.current.getBoundingClientRect()
    const paths: string[] = []

    const rounds = winnersGroup.rounds
    for (let r = 0; r < rounds.length - 1; r++) {
      const currentRound = rounds[r]
      const nextRound = rounds[r + 1]
      if (!currentRound || !nextRound) continue

      const childCount = currentRound.matches.length
      const parentCount = nextRound.matches.length

      for (let i = 0; i < childCount; i++) {
        const childKey = `w:${r}:${i}`
        // Index-based parent mapping: two children feed one parent
        const parentIdx = Math.min(Math.floor(i / 2), parentCount - 1)
        const parentKey = `w:${r + 1}:${parentIdx}`

        const childEl = matchElMapRef.current.get(childKey)
        const parentEl = matchElMapRef.current.get(parentKey)
        if (!childEl || !parentEl) continue

        const childRect = childEl.getBoundingClientRect()
        const parentRect = parentEl.getBoundingClientRect()

        const startX = childRect.right - containerRect.left
        const startY = childRect.top + childRect.height / 2 - containerRect.top
        const endX = parentRect.left - containerRect.left
        const endY = parentRect.top + parentRect.height / 2 - containerRect.top
        const midX = startX + (endX - startX) / 2

        const d = `M ${startX} ${startY} H ${midX} V ${endY} H ${endX}`
        paths.push(d)
      }
    }

    setWinnerPaths(paths)
  }

  useLayoutEffect(() => {
    computeWinnerPaths()
    const onResize = () => computeWinnerPaths()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winnersGroup])

  return (
    <div className='w-full overflow-x-auto pb-8'>
      <div className='min-w-max space-y-12 p-4'>
        {/* Winners Bracket */}
        {winnersGroup && (
          <div className='relative'>
            <h3 className='text-lg md:text-xl font-semibold mb-8'>
              Winners Bracket
            </h3>
            {/* SVG overlay behind cards */}
            <svg
              className='absolute inset-0 pointer-events-none z-0'
              width='100%'
              height='100%'
            >
              {winnerPaths.map((d, idx) => (
                <path key={idx} d={d} stroke='currentColor' strokeWidth={2} fill='none' className='text-muted-foreground/50' />
              ))}
            </svg>
            <div
              ref={winnersContainerRef}
              className='relative flex gap-16 md:gap-20 [--round-gap:4rem] md:[--round-gap:5rem] [--connector-inline:calc(var(--round-gap)_/_2)] z-10'
            >
              {winnersGroup.rounds.map((round, roundIdx) => (
                <WinnerBracketRound
                  key={roundIdx}
                  round={round}
                  roundIndex={roundIdx}
                  totalRounds={winnersGroup.rounds.length}
                  attachEl={attachMatchEl}
                />
              ))}
            </div>
          </div>
        )}

        {/* Losers Bracket */}
        {losersGroup && (
          <div className='pt-12 border-t'>
            <h3 className='text-lg md:text-xl font-semibold mb-8'>
              Losers Bracket
            </h3>
            <div className='flex gap-16 md:gap-20 [--round-gap:4rem] md:[--round-gap:5rem] [--connector-inline:calc(var(--round-gap)_/_2)]'>
              {losersGroup.rounds.map((round, roundIdx) => (
                <LoserBracket
                  key={roundIdx}
                  round={round}
                  roundIndex={roundIdx}
                  totalRounds={losersGroup.rounds.length}
                />
              ))}
            </div>
          </div>
        )}

        {/* Grand Final */}
        {grandFinalGroup && grandFinalGroup.rounds[0] && (
          <div className='pt-12 border-t'>
            <h3 className='text-lg md:text-xl font-semibold mb-8 text-center'>
              Grand Final
            </h3>
            <div className='flex justify-center'>
              <div className='w-48'>
                <MatchCard match={grandFinalGroup.rounds[0].matches[0]} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface WinnerBracketRoundProps {
  round: any
  roundIndex: number
  totalRounds: number
  attachEl: (key: string) => (el: HTMLElement | null) => void
}

const WinnerBracketRound: React.FC<WinnerBracketRoundProps> = ({
  round,
  roundIndex,
  totalRounds,
  attachEl,
}) => {
  const matchCount = round.matches.length

  // Keep simple spacing for now; connectors will handle visual linkage
  const baseGap = 20
  const gapBetweenMatches = baseGap * Math.pow(2, roundIndex)
  const gapBetweenRounds = 64

  return (
    <div
      className='flex flex-col relative'
      style={{ marginRight: `${gapBetweenRounds}px` }}
    >
      {/* Round Label */}
      <div className='mb-4 text-center'>
        <h4 className='text-sm font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap'>
          Round {roundIndex + 1}
        </h4>
      </div>

      {/* Matches as standard divs with refs for measurement */}
      <div className='flex flex-col' style={{ gap: `${gapBetweenMatches}px` }}>
        {round.matches.map((match: any, idx: number) => (
          <div key={idx} className='w-48' ref={attachEl(`w:${roundIndex}:${idx}`)}>
            <MatchCard match={match} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoubleEliminationBracket
