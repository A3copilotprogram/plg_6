import {FileText, X, Loader, AlertCircle} from 'react-feather'
import {DocumentPublic} from '@/client'

export default function FileCard({file}: {file: DocumentPublic}) {
  const {filename, status} = file

  const onRemove = () => {}

  return (
    <div className='inset-ring-1 inset-ring-[#4A5568] rounded-lg p-4 flex items-center gap-3 relative mb-3 bg-[#2D3748] border border-[#4A5568]'>
      {/* File Icon */}
      <div className='flex-shrink-0'>
        <FileText className='w-5 h-5 text-[#A0AEC0]' />
      </div>

      {/* File Info */}
      <div className='flex-1 min-w-0'>
        <div className='text-white text-sm font-medium truncate'>
          {filename}
        </div>

        {/* Status and Progress */}
        {status === 'pending' && (
          <div className='flex items-center gap-2 mt-1'>
            <Loader className='w-4 h-4 text-[#A0AEC0] animate-spin' />
            <span className='text-[#A0AEC0] text-xs'>Uploading...</span>
          </div>
        )}

        {status === 'processing' && (
          <div className='mt-2'>
            <div className='flex items-center justify-between mb-1'>
              <span className='text-[#A0AEC0] text-xs'>70%</span>
            </div>
            <div className='w-full bg-[#4A5568] rounded-full h-1'>
              <div
                className='bg-[#2563EB] h-1 rounded-full transition-all duration-300 block'
                style={{width: `60%`}}
              />
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div className='mt-1'>
            <div className='w-full bg-green-500 rounded-full h-1' />
          </div>
        )}

        {status === 'failed' && (
          <div className='flex items-center gap-2 mt-1'>
            <AlertCircle className='w-4 h-4 text-red-400' />
            <span className='text-red-400 text-xs'>Upload failed</span>
          </div>
        )}
      </div>

      {/* Status Icon */}
      <div className='flex-shrink-0 flex items-center gap-2'>
        <button
          onClick={onRemove}
          className='w-6 h-6 text-[#A0AEC0] hover:text-red-400 transition-colors'
        >
          <X className='w-4 h-4' />
        </button>
      </div>
    </div>
  )
}
