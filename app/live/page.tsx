import React from 'react'
import VideoStream from '@/components/custom/VideoStream'

const goLive = () => {
  return (
    <div className='h-screen m-4'>
      <h1 className='text-center font-alata font-bold text-red-600 my-4'>Streaming Begins</h1>
      <VideoStream/>
    </div>
  )
}

export default goLive
