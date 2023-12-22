import React, { HTMLAttributes, useState } from 'react'
import { Title } from '@/components/typography'
import { Box, Tab, Tabs } from '@mui/material'

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string
  tabs?: string[]
  sections?: JSX.Element[]
}

function Modal(props: Props) {
  const [value, setValue] = useState(0)

  const { title, tabs, sections, children } = props

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <article className='bg-white px-[30px] py-[20px]'>
      <div className='flex flex-row items-center justify-between mb-2'>
        <Title.Small className='text-2xl' text={title} />
      </div>

      <div className='flex flex-col'>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          {tabs && (
            <Tabs value={value} onChange={handleChange}>
              {tabs.map((value) => {
                return <Tab label={value} />
              })}
            </Tabs>
          )}
        </Box>

        {sections
          ? sections.map((section, index) => {
              return (
                <CustomTabPanel value={value} index={index}>
                  {section}
                </CustomTabPanel>
              )
            })
          : children}
      </div>
    </article>
  )
}

interface TabPanelProps extends React.PropsWithChildren {
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  )
}

export default Modal
