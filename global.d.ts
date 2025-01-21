interface Window {
  bracketsViewer: {
    render: (config: {
      stages: any
      matches: any
      matchGames: any
      participants: any
    }) => void
  }
}
