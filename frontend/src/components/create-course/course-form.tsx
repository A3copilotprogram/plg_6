import {useActionState} from 'react'
import {useRouter} from 'next/navigation'

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
          className='w-full bg-[#4A5568] border-[#4A5568] text-white placeholder-[#A0AEC0] focus:ring-[#2563EB]'
          required
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description' className='text-white font-medium'>Description</Label>
        <Textarea
          id='description'
          name='description'
          placeholder='A brief summary of what this project is about.'
          className='min-h-[120px] resize-none bg-[#4A5568] border-[#4A5568] text-white placeholder-[#A0AEC0] focus:ring-[#2563EB]'
          required
        />
      </div>
      <div className='flex gap-3 pt-4'>
        <Button
          type='button'
          variant='secondary'
          className='flex-1 bg-[#4A5568] hover:bg-[#5A6578] text-white border-[#4A5568]'
          disabled={isPending}
          onClick={handleGoBack}
        >
          Cancel
        </Button>
        <Button type='submit' className='flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-0' disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}

export default CourseForm
