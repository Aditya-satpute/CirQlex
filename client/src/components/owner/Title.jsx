import React from 'react'

const Title = ({ title, subTitle }) => {
  return (
    <>
      <h1 className='font-medium text-3xl break-words whitespace-normal max-w-full'>{title}</h1>
      <p className='text-sm md:text-base text-gray-500/90 mt-2 break-words whitespace-normal max-w-full'>{subTitle}</p>
    </>
  )
}

export default Title
