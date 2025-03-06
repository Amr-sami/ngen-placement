import { PageWrapper, TracksSection } from '@/components/general'
import React from 'react'

const TracksPage = () => {
  return (
    <PageWrapper classNames="container mx-auto">
      <TracksSection title='Tracks' />
      <TracksSection title='Upcoming Tracks' />
    </PageWrapper>
  )
}

export default TracksPage