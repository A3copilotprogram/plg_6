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
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors bg-sb-surface-hover
                ${
                  isDragActive
                    ? 'border-sb-primary bg-sb-primary/10'
                    : 'border-sb-border hover:border-sb-primary-light hover:bg-sb-surface-hover/80'
                }
              `}
    >
      <input {...getInputProps()} />
      <Cloud className='mx-auto h-12 w-12 text-sb-text-secondary mb-4' />
      <div className='space-y-2'>
        <p className='text-lg font-medium text-sb-text-primary'>
          {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
        </p>
        <p className='text-sm text-sb-text-secondary'>PDFs, DOCs (max. 25MB)</p>
        <div className='flex items-center justify-center gap-2 my-3'>
          <div className='h-px bg-sb-border flex-1' />
          <span className='text-sm text-sb-text-secondary'>or</span>
          <div className='h-px bg-sb-border flex-1' />
        </div>
        <Button
          type='button'
          variant='secondary'
          size='sm'
          disabled={isUploading}
          className='bg-sb-border-light hover:bg-sb-surface-hover text-sb-text-primary border-sb-border'
        >
          {isUploading ? 'Uploading...' : 'Browse Files'}
        </Button>
      </div>
    </div>
  )
}
