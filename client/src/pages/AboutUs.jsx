import React from 'react'

const AboutUs = () => {
  return (
    <div className='max-w-4xl mx-auto px-6 md:px-10 py-12 pt-24 sm:pt-28 text-gray-800'>

      {/* Title */}
      <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>
        About CirQlex
      </h1>

      {/* Intro */}
      <p className='mt-6 text-sm md:text-base leading-relaxed text-gray-600'>
        CirQlex is built to solve a simple but common problem in college life — 
        students often buy items that are only useful for a short period of time.
      </p>

      <p className='mt-4 text-sm md:text-base leading-relaxed text-gray-600'>
        From engineering kits and calculators to cycles and cables, these items 
        often end up unused once their purpose is fulfilled. At the same time, 
        new students spend money buying the same things again.
      </p>

      {/* Problem → Solution */}
      <div className='mt-10 space-y-6'>
        <h2 className='text-lg md:text-xl font-semibold'>What We Do</h2>

        <p className='text-sm md:text-base leading-relaxed text-gray-600'>
          CirQlex connects students within the same campus to buy and sell 
          pre-owned items easily.
        </p>

        <ul className='list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2'>
          <li>Buy useful items at lower prices</li>
          <li>Sell unused items quickly</li>
          <li>Reduce waste within the campus</li>
        </ul>
      </div>

      {/* How it works */}
      <div className='mt-10 space-y-6'>
        <h2 className='text-lg md:text-xl font-semibold'>How It Works</h2>

        <p className='text-sm md:text-base leading-relaxed text-gray-600'>
          Students can list items by adding basic details and their contact information. 
          Interested buyers can directly reach out to the seller and complete the 
          transaction offline.
        </p>

        <p className='text-sm md:text-base leading-relaxed text-gray-600'>
          There is no middleman, no commission, and no complicated process — just 
          simple student-to-student exchange.
        </p>
      </div>

      {/* Trust */}
      <div className='mt-10 space-y-6'>
        <h2 className='text-lg md:text-xl font-semibold'>Built for IIT Patna Students</h2>

        <p className='text-sm md:text-base leading-relaxed text-gray-600'>
          Only verified IIT Patna students can list items on CirQlex. This ensures 
          a trusted environment where users interact within their own campus community.
        </p>
      </div>

      {/* Vision */}
      <div className='mt-10 space-y-6'>
        <h2 className='text-lg md:text-xl font-semibold'>Our Vision</h2>

        <p className='text-sm md:text-base leading-relaxed text-gray-600'>
          We aim to build a reliable campus marketplace where resources are reused, 
          money is saved, and student life becomes more efficient and sustainable.
        </p>
      </div>

      {/* Footer line */}
      <p className='mt-12 text-sm text-gray-500'>
        Made with ❤️ by IITP students
      </p>

    </div>
  )
}

export default AboutUs