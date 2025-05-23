import { MatchFrontend } from '@/types/tournament/tournament'

interface EditScoreButtonProps {
  match: MatchFrontend
  disableButton: boolean
}

export const EditScoreButton: React.FC<EditScoreButtonProps> = ({
  match,
  disableButton,
}) => {
  // const { openMatchScoreEditDialog } = useTournamentContext()

  return (
    <div className='relative'>
      {/* <ClickToolTip title={disableButton ? "Please first start the Tournament" : ""}>
        <span>
          <IconButton
            onClick={() => openMatchScoreEditDialog(match, matchEditDialogTabs.reportScore)}
            disabled={disableButton}
            className="p-1"
          >
            <SportsScoreIcon className="text-gray-500" />
          </IconButton>
        </span>
      </ClickToolTip> */}
    </div>
  )
}
