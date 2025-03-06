import React from 'react'
import TracksOverviewCard from '../TracksOverviewCard'
import { ITracksOverviewSectionProps } from '../types'

const TracksOverviewSection: React.FC<ITracksOverviewSectionProps> = ({ data }) => {

  return (
    <>
      <h3 className="font-bold text-xl text-pumpkin mb-8 xl:mb-10 md:text-2xl xl:text-3xl">
        Tracks Overview
      </h3>

      <h5 className="font-bold text-xl text-purple-dark md:text-2xl xl:font-medium xl:text-3xl">
        Overview
      </h5>

      {data.map((item, index) => (
        <TracksOverviewCard key={index} text={item.text} imgSrc={item.imgSrc} />
      ))}

    </>
  )
}


export default TracksOverviewSection