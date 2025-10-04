import React from 'react'
import {APIError} from '@/lib/result'
import {get} from '@/utils'

export default function ErrorBox({error}: {error: APIError}) {
  const parsedDetails = get(error, 'details.detail', null)
  return (
    <div role='alert' className='rounded-md border border-red-500/20 p-4 bg-red-500/10 mb-2'>
      {error && <>
          <strong className='block text-sm text-red-400'>Error: {error?.message}</strong>
          {error.status && <div className='text-xs text-red-300'>Status: {error?.status}</div>}
          {error.code && <div className='text-xs text-red-300'>Code: {error?.code}</div>}
          {error.details && (
            <pre className='text-xs mt-2 break-words text-red-300'>
              {typeof error.details === 'string'
                ? error.details
                : parsedDetails
                ? parsedDetails
                : JSON.stringify(error.details, null, 2)}
            </pre>
          )}
      </>}
    </div>
  )
}
