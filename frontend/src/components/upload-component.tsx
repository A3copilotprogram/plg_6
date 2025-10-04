'use client'

import {useState} from 'react'
import {Cloud} from 'react-feather'
import {useDropzone} from 'react-dropzone'
import {toast} from 'sonner'

import {Button} from '@/components/ui/button'
import {uploadDocuments} from '@/lib/documents'

const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
}

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB

export default function UploadComponent({
  courseId,
  callback,
}: {
  courseId: string
  callback?: () => void
}) {
  const [isUploading, setIsUploading] = useState(false)
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    onDrop: async (documents) => {
      setIsUploading(true)
      await uploadDocuments(courseId, documents)
      if (callback) {
        await callback()
      }
      setIsUploading(false)
    },
    disabled: isUploading,
    multiple: true,
    maxFiles: 5,
    noClick: isUploading,
    noKeyboard: isUploading,
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            toast.error(`Error: ${file.file.name} is larger than 25MB.`)
          } else if (err.code === 'file-invalid-type') {
            toast.error(
              `Error: ${file.file.name} is not a supported file type.`,
            )
          } else {
            toast.error(`Error: ${err.message}`)
          }
        })
      })
    },
  })

  return (
    <div
      {...getRootProps()}
      className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors bg-[#4A5568]
                ${
                  isDragActive
                    ? 'border-[#2563EB] bg-[#2563EB]/10'
                    : 'border-[#4A5568] hover:border-[#60A5FA] hover:bg-[#4A5568]/80'
                }
              `}
    >
      <input {...getInputProps()} />
      <Cloud className='mx-auto h-12 w-12 text-[#A0AEC0] mb-4' />
      <div className='space-y-2'>
        <p className='text-lg font-medium text-white'>
          {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
        </p>
        <p className='text-sm text-[#A0AEC0]'>PDFs, DOCs (max. 25MB)</p>
        <div className='flex items-center justify-center gap-2 my-3'>
          <div className='h-px bg-[#4A5568] flex-1' />
          <span className='text-sm text-[#A0AEC0]'>or</span>
          <div className='h-px bg-[#4A5568] flex-1' />
        </div>
        <Button
          type='button'
          variant='secondary'
          size='sm'
          disabled={isUploading}
          className='bg-[#2D3748] hover:bg-[#4A5568] text-white border-[#4A5568]'
        >
          {isUploading ? 'Uploading...' : 'Browse Files'}
        </Button>
      </div>
    </div>
  )
}
