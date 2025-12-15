'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { MatchFrontend } from '@/types/tournament/tournament'
import { reportScoreSchema, ReportScoreType } from '@/schemas/reportScore'

interface ReportScoreTabProps {
  match: MatchFrontend
  onClose: () => void
}

const ReportScoreTab: React.FC<ReportScoreTabProps> = ({ match, onClose }) => {
  const participants = match.participants ?? []

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<ReportScoreType>({
    resolver: zodResolver(reportScoreSchema),
    defaultValues: {
      participant_one_score: participants[0]?.score ?? undefined,
      participant_two_score: participants[1]?.score ?? undefined,
    },
  })

  const onSubmit = async (data: ReportScoreType) => {
    // TODO: Replace with your actual API call
    await new Promise((res) => setTimeout(res, 800))
    reset()
    onClose()
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Report Score</CardTitle>
        </CardHeader>
        <CardContent>
          {(errors.participant_one_score || errors.participant_two_score) && (
            <Alert variant='destructive' className='mb-4'>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errors.participant_one_score?.message ||
                  errors.participant_two_score?.message}
              </AlertDescription>
            </Alert>
          )}
          <div className='grid grid-cols-2 gap-4 items-center mb-2'>
            <Label>{participants[0]?.name || 'Participant 1'}</Label>
            <Input
              type='number'
              {...register('participant_one_score')}
              min={0}
              className='w-24'
              autoFocus
              disabled={isSubmitting}
            />
            <Label>{participants[1]?.name || 'Participant 2'}</Label>
            <Input
              type='number'
              {...register('participant_two_score')}
              min={0}
              className='w-24'
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
        <CardFooter className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Save
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default ReportScoreTab
