import React from 'react'

interface BackConnectorProps {
  roundIndex: number
  gapBetweenRounds: any
  isLoserGroup?: boolean
}

export const BackConnector: React.FC<BackConnectorProps> = ({
  roundIndex,
  gapBetweenRounds,
  isLoserGroup = false,
}) => {
  let connectorWidth
  if (isLoserGroup && roundIndex % 2 === 1) {
    connectorWidth = {
      sm: gapBetweenRounds.sm * 4 - 2, // 4 is the value of the theme spacing, and -2 is just a random number
      md: gapBetweenRounds.md * 4 - 2,
    }
  } else {
    connectorWidth = {
      sm: (gapBetweenRounds.sm / 2) * 4 - 2, // 4 is the value of the theme spacing, and -2 is just a random number
      md: (gapBetweenRounds.md / 2) * 4 - 2,
    }
  }

  if (!(roundIndex == 0))
    return (
      <div
        className={`absolute right-1 border-t-2 border-t-teal-200 w-[28px] md:w-[40px]" `} //connect behind
      />
    )
  else return ''
}

interface FrontConnectorProps {
  isLastRound: boolean
  roundIndex: number
  matchIndex: number
  gapBetweenRounds: { sm: number; md: number }
  isLoserGroup: boolean
}
export const FrontConnector: React.FC<FrontConnectorProps> = ({
  isLastRound,
  roundIndex,
  matchIndex,
  gapBetweenRounds,
  isLoserGroup = false,
}) => {
  // const connectorWidth = {
  //   sm: (gapBetweenRounds.sm / 2) * 4 - 2, // 4 is the value of the theme spacing, and -2 is just a random number
  //   md: (gapBetweenRounds.md / 2) * 4 - 2,
  // }

  if (isLastRound || (isLoserGroup && roundIndex % 2 === 0)) return ''
  if (matchIndex % 2 === 0)
    //todo:: fix styles returned
    return (
      <div
        className={`absolute bottom-0 left-1 h-1/2 border-t-2 border-r-2 border-t-teal-200 border-r-teal-200 w-[10px] md:w-[15px]`}
      />
    )
  else
    return (
      <div
        className={`absolute top-0 left-1 h-1/2 border-b-2 border-r-2 border-b-teal-200 border-r-teal-200 w-[10px] md:w-[15px]`}
      />
    )
}
