import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className='max-w-4xl mx-auto px-6 md:px-10 py-12 pt-24 sm:pt-28 text-gray-800'>

      {/* Title */}
      <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>
        Privacy Policy
      </h1>
      <p className='mt-3 text-sm md:text-base text-gray-500'>
        Last updated: 27 March 2026
      </p>

      {/* Intro */}
      <p className='mt-6 text-sm md:text-base leading-relaxed'>
        CirQlex respects your privacy and is committed to protecting your personal information. 
        This policy explains what data we collect and how it is used.
      </p>

      {/* Sections */}
      <div className='mt-10 space-y-10'>

        <div>
          <h2 className='text-lg md:text-xl font-semibold'>1. Information We Collect</h2>
          <p className='mt-2 text-sm md:text-base leading-relaxed text-gray-600'>
            We collect only the minimum information required to operate the platform. This may include 
            your institute email for verification, optional name, and contact details that you choose 
            to share in listings.
          </p>
        </div>

        <div>
          <h2 className='text-lg md:text-xl font-semibold'>2. How We Use Your Information</h2>
          <p className='mt-2 text-sm md:text-base leading-relaxed text-gray-600'>
            Your data is used to verify IIT Patna users, enable communication between buyers and sellers, 
            and improve the overall platform experience.
          </p>
        </div>

        <div>
          <h2 className='text-lg md:text-xl font-semibold'>3. Data Sharing</h2>
          <p className='mt-2 text-sm md:text-base leading-relaxed text-gray-600'>
            We do not sell or share your data with third parties. Your contact information is only visible 
            when you voluntarily include it in a listing.
          </p>
        </div>

        <div>
          <h2 className='text-lg md:text-xl font-semibold'>4. Data Security</h2>
          <p className='mt-2 text-sm md:text-base leading-relaxed text-gray-600'>
            We take reasonable measures to protect your data. However, users are responsible for the 
            information they share during offline interactions.
          </p>
        </div>

        <div>
          <h2 className='text-lg md:text-xl font-semibold'>5. User Responsibility</h2>
          <p className='mt-2 text-sm md:text-base leading-relaxed text-gray-600'>
            Users should avoid sharing sensitive personal information and ensure that all listing details 
            are accurate and appropriate.
          </p>
        </div>

        <div>
          <h2 className='text-lg md:text-xl font-semibold'>6. Updates to Policy</h2>
          <p className='mt-2 text-sm md:text-base leading-relaxed text-gray-600'>
            This policy may be updated as CirQlex evolves. Continued use of the platform indicates 
            acceptance of the latest version.
          </p>
        </div>

      </div>
    </div>
  )
}

export default PrivacyPolicy