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
          className='w-full bg-[#4A5568] border-[#4A5568] text-white placeholder-[#A0AEC0] focus:ring-[#2563EB] h-12'
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

      <div className='space-y-2'>
        <Label className='text-white font-medium'>Upload Documents</Label>
        <div className='border-2 border-dashed border-[#4A5568] rounded-lg p-8 text-center bg-[#4A5568] hover:border-[#60A5FA] hover:bg-[#4A5568]/80 transition-colors cursor-pointer'>
          <div className='flex flex-col items-center gap-4'>
            <Cloud className='h-12 w-12 text-[#A0AEC0]' />
            <div className='space-y-2'>
              <p className='text-lg font-medium text-white'>
                Drag and drop files here
              </p>
              <p className='text-sm text-[#A0AEC0]'>PDFs, DOCs (max. 25MB)</p>
              <div className='flex items-center justify-center gap-2 my-3'>
                <div className='h-px bg-[#2D3748] flex-1' />
                <span className='text-sm text-[#A0AEC0]'>or</span>
                <div className='h-px bg-[#2D3748] flex-1' />
              </div>
              <Button
                type='button'
                variant='secondary'
                size='sm'
                className='bg-[#2D3748] hover:bg-[#4A5568] text-white border-[#4A5568]'
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
          className='bg-[#4A5568] hover:bg-[#5A6578] text-white border-[#4A5568]'
          disabled={isPending}
          onClick={handleGoBack}
        >
          Cancel
        </Button>
        <Button type='submit' className='bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-0' disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}

export default CourseForm
