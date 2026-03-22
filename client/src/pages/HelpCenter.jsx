import React, { useState } from 'react'

const faqs = [
  {
    question: "How does CirQlex work?",
    answer:
      "Students list items with price and contact details. Buyers browse listings, contact the seller directly, and complete the transaction offline."
  },
  {
    question: "Who can use CirQlex?",
    answer:
      "Only IIT Patna students can list items after verification. Other users can browse but cannot post listings."
  },
  {
    question: "Is payment done on the platform?",
    answer:
      "No. All payments are handled offline between buyers and sellers."
  },
  {
    question: "How do I contact a seller?",
    answer:
      "You can use the contact details provided in the listing to directly reach out to the seller."
  },
  {
    question: "Is CirQlex safe?",
    answer:
      "We verify IITP users via OTP. However, always meet in public places and verify items before purchasing."
  },
  {
    question: "What if someone posts inappropriate content?",
    answer:
      "Such users can be reported. CirQlex may remove listings or restrict accounts that violate guidelines."
  },
  {
    question: "Is there a lost and found feature?",
    answer:
      "This feature is coming soon. It will allow students to report and find lost items within the campus."
  }
]

const HelpCenter = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className='max-w-4xl mx-auto px-6 md:px-10 py-12 pt-24 sm:pt-28 text-gray-800'>

      {/* Title */}
      <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>
        Help Center
      </h1>
      <p className='mt-3 text-sm md:text-base text-gray-500'>
        Find answers to common questions about CirQlex.
      </p>

      {/* FAQ */}
      <div className='mt-10 divide-y border-t border-gray-200'>
        {faqs.map((faq, index) => (
          <div key={index} className='py-5'>

            {/* Question */}
            <button
              onClick={() => toggle(index)}
              className='w-full flex justify-between items-center text-left'
            >
              <span className='text-sm md:text-base font-medium'>
                {faq.question}
              </span>
              <span className='text-lg'>
                {openIndex === index ? '−' : '+'}
              </span>
            </button>

            {/* Answer */}
            {openIndex === index && (
              <p className='mt-3 text-sm md:text-base text-gray-600 leading-relaxed'>
                {faq.answer}
              </p>
            )}

          </div>
        ))}
      </div>

    </div>
  )
}

export default HelpCenter