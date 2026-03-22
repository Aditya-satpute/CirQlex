import React from 'react'

const Terms = () => {
  return (
    <div className='max-w-4xl mx-auto px-6 md:px-10 py-12 pt-24 sm:pt-28 text-gray-800'>

      {/* Title */}
      <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>
        Terms & Conditions
      </h1>
      <p className='mt-3 text-sm md:text-base text-gray-500'>
        Last updated: 27 March 2026
      </p>

      {/* Intro */}
      <p className='mt-6 text-sm md:text-base leading-relaxed'>
        By using CirQlex, you agree to the following terms and conditions. 
        Please read them carefully before using the platform.
      </p>

      {/* Sections */}
      <div className='mt-10 space-y-10'>

        <div>
          <h2 className='text-lg md:text-xl font-semibold'>1. Platform Nature</h2>
          <p className='mt-2 text-sm md:text-base leading-relaxed text-gray-600'>
            CirQlex is a student-to-student marketplace for listing pre-owned items. 
            We do not handle payments, delivery, or transactions.
          </p>
        </div>

        <div>
          <h2 className='text-lg md:text-xl font-semibold'>2. User Eligibility</h2>
          <p className='mt-2 text-sm md:text-base leading-relaxed text-gray-600'>
            Only verified IIT Patna students can list items on the platform. 
            Non-IITP users may browse listings but cannot post items.
          </p>
        </div>

        <div>
          <h2 className='text-lg md:text-xl font-semibold'>3. Listings</h2>
          <p className='mt-2 text-sm md:text-base leading-relaxed text-gray-600'>
            Users must ensure that items listed are genuine, accurately described, 
            and appropriate for the platform. Illegal or harmful listings are strictly prohibited.
          </p>
        </div>

        <div>
          <h2 className='text-lg md:text-xl font-semibold'>4. Transactions</h2>
          <p className='mt-2 text-sm md:text-base leading-relaxed text-gray-600'>
            All transactions are conducted offline between users. CirQlex is not responsible 
            for payment issues, item condition disputes, or any form of miscommunication.
          </p>
        </div>

        <div>
          <h2 className='text-lg md:text-xl font-semibold'>5. Safety</h2>
          <p className='mt-2 text-sm md:text-base leading-relaxed text-gray-600'>
            Users are advised to verify items before purchase and conduct transactions 
            in safe, public locations within the campus.
          </p>
        </div>

        <div>
          <h2 className='text-lg md:text-xl font-semibold'>6. Misuse & Restrictions</h2>
          <p className='mt-2 text-sm md:text-base leading-relaxed text-gray-600'>
            CirQlex reserves the right to remove listings or restrict users who violate 
            platform rules or engage in inappropriate behavior.
          </p>
        </div>

        <div>
          <h2 className='text-lg md:text-xl font-semibold'>7. Limitation of Liability</h2>
          <p className='mt-2 text-sm md:text-base leading-relaxed text-gray-600'>
            CirQlex acts only as a platform and is not liable for any loss, damage, 
            or disputes arising from user interactions or transactions.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Terms