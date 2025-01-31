import React from 'react'

const styles = {
  connectDown: 'absolute bottom-0 left-1',
}

interface BackConnectorProps {
  roundIndex: any
  gapBetweenRounds: any
  isLoserGroup?: any
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
        className={`absolute right-1 border-t-2 border-t-teal-800 sm:${connectorWidth.sm} md:${connectorWidth.md} `} //connect behind
      />
    )
  else return ''
}

interface FrontConnectorProps {
  isLastRound: any
  roundIndex: any
  matchIndex: any
  gapBetweenRounds: any
  isLoserGroup: any
}
export const FrontConnector: React.FC<FrontConnectorProps> = ({
  isLastRound,
  roundIndex,
  matchIndex,
  gapBetweenRounds,
  isLoserGroup = false,
}) => {
  const connectorWidth = {
    sm: (gapBetweenRounds.sm / 2) * 4 - 2, // 4 is the value of the theme spacing, and -2 is just a random number
    md: (gapBetweenRounds.md / 2) * 4 - 2,
  }

  if (isLastRound | (isLoserGroup && roundIndex % 2 === 0)) return ''
  if (matchIndex % 2 === 0)
    return <Box sx={{ ...styles.connectDown, width: connectorWidth }} />
  else return <Box sx={{ ...styles.connectUp, width: connectorWidth }} />
}
