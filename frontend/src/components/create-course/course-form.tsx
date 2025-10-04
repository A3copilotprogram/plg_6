import {useActionState} from 'react'
import {useRouter} from 'next/navigation'
import {Cloud} from 'react-feather'

import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {Label} from '@/components/ui/label'

import {createCourse} from '@/actions/courses'

export function CourseForm() {
  const router = useRouter()
  const [_state, formAction, isPending] = useActionState(createCourse, {
    message: '',
    success: false,
  })


  function handleGoBack() {
    router.back()
  }

  return (
    <form action={formAction} className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='name' className='text-white font-medium'>Project Title</Label>
        <Input
          id='name'
          name='name'
          placeholder="e.g., 'History of Ancient Rome'"
          className='w-full bg-sb-surface-hover border-sb-border text-sb-text-primary placeholder-sb-text-secondary focus:ring-sb-primary h-12'
          required
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description' className='text-white font-medium'>Description</Label>
        <Textarea
          id='description'
          name='description'
          placeholder='A brief summary of what this project is about.'
          className='min-h-[120px] resize-none bg-sb-surface-hover border-sb-border text-sb-text-primary placeholder-sb-text-secondary focus:ring-sb-primary'
          required
        />
      </div>

      <div className='space-y-2'>
        <Label className='text-white font-medium'>Upload Documents</Label>
        <div className='border-2 border-dashed border-sb-border rounded-lg p-8 text-center bg-sb-surface-hover hover:border-sb-primary-light hover:bg-sb-surface-hover/80 transition-colors cursor-pointer'>
          <div className='flex flex-col items-center gap-4'>
            <Cloud className='h-12 w-12 text-sb-text-secondary' />
            <div className='space-y-2'>
              <p className='text-lg font-medium text-sb-text-primary'>
                Drag and drop files here
              </p>
              <p className='text-sm text-sb-text-secondary'>PDFs, DOCs (max. 25MB)</p>
              <div className='flex items-center justify-center gap-2 my-3'>
                <div className='h-px bg-sb-border-light flex-1' />
                <span className='text-sm text-sb-text-secondary'>or</span>
                <div className='h-px bg-sb-border-light flex-1' />
              </div>
              <Button
                type='button'
                variant='secondary'
                size='sm'
                className='bg-sb-border-light hover:bg-sb-surface-hover text-sb-text-primary border-sb-border'
              >
                Browse Files
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='flex gap-3 pt-4 justify-end'>
        <Button
          type='button'
          variant='secondary'
          className='bg-sb-surface-hover hover:bg-sb-surface-active text-sb-text-primary border-sb-border'
          disabled={isPending}
          onClick={handleGoBack}
        >
          Cancel
        </Button>
        <Button type='submit' className='bg-sb-primary hover:bg-sb-primary-hover text-sb-text-primary border-0' disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}

export default CourseForm
