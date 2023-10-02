import React from 'react'
import Image from '@/components/image'
import { Headline, Label, Title } from '@/components/typography'
import { LocationOnOutlined, Star } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export default function GeneralViewPage() {
  return (
    <>
      <ClinicHeader />

      <GeneralDescription />

      <CommentsAndReview />
    </>
  )
}

function ClinicHeader() {
  const { t } = useTranslation()

  return (
    <section className='flex flex-row gap-x-[10px]'>
      <Image className='h-40 rounded-lg w-72' />
      <article className='flex flex-col'>
        <Headline.Medium text={t('veterinary-clinic')} />

        <LocationOnOutlined />

        <Title.Small text='AV. Lopez de vega' />

        <Star className='text-yellow-500' />

        <Label.Large text='4.5' />
      </article>
    </section>
  )
}

function GeneralDescription() {
  return <section></section>
}

function CommentsAndReview() {
  return <section></section>
}
