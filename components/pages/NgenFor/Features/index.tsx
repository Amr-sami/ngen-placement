import React from 'react'
import { IFeaturedProps } from '../types'
import Image from 'next/image'


const Featured: React.FC<IFeaturedProps> = ({ features, imgSrc }) => {
  return (
    <>
      <h3 className="font-bold text-xl text-pumpkin mb-4 md:text-2xl xl:text-3xl">
        Features for Corporate
      </h3>
      <div className='flex flex-col-reverse space-between gap-10 lg:flex-row mb-6 lg:mb-10'>

        <ul className='grid grid-cols-2 my-10 list-disc list-inside flex-grow text-purple-dark font-bold xl:text-2xl'>
          {features.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <Image src={imgSrc} alt='Features' width={650} height={330}/>
      </div>
    </>
  )
}

export default Featured