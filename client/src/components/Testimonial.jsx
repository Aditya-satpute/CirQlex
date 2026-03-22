import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets';
import { motion } from 'motion/react';

const Testimonial = () => {

    const testimonials = [
        { name: "1st year student", 
          location: "CVR, IIT Patna", 
          image: assets.testimonial_image_1, 
          testimonial: "Everyone told me to buy all the lab stuff in first year. No one told me I’d never use most of it again." 
        },
        { name: "2nd year student", 
          location: "Aryabhatta Hostel, IIT Patna", 
          image: assets.testimonial_image_2, 
          testimonial: "My room has a cycle, cables, and random stuff I don’t use anymore. CirQlex feels like a good way to finally get rid of it." 
        },
        { name: "3rd year student", 
          location: "Kalam Hostel, IIT Patna", 
          image: assets.testimonial_image_1, 
          testimonial: "At this point, I’ve realized half the things we buy in college are temporary. Would’ve saved a lot if this existed earlier." 
        }
    ];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
            
           <Title title="Voices from the Campus" subTitle="From first year excitement to third year reality"/>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
                {testimonials.map((testimonial, index) => (
                    <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
                    viewport={{ once: true, amount: 0.3 }}
                    
                    key={index} className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500">

                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                            {Array(5).fill(0).map((_, index) => (
                                <img key={index} src={assets.star_icon} alt="star-icon" />
                            ))}
                        </div>
                        <p className="text-gray-500 max-w-90 mt-4 font-light">"{testimonial.testimonial}"</p>
                    </motion.div>
                ))}
            </div>
        </div>
  )
}

export default Testimonial
