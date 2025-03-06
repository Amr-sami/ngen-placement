import React from 'react'
import { ITracksOverviewCardProps } from '../types'
import Image from 'next/image'

const TracksOverviewCard: React.FC<ITracksOverviewCardProps> = ({ text, imgSrc }) => {
  return (
    <div className='lg:bg-gray-default rounded-[14px] p-6 flex items-center justify-between gap-7 my-10 flex-col-reverse lg:flex-row'>
      <p className='text-xl lg:text-2xl text-gray-dark'>{text}</p>
      <Image src={imgSrc} alt='Tracks Overview' width={270} height={195}/>
    </div>
  )
}

export default TracksOverviewCard