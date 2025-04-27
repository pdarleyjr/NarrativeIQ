
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  initials: string;
  index: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, role, initials, index }) => {
  return (
    <div 
      className="glass-card p-6 rounded-xl animate-fadeIn opacity-0"
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <div className="flex items-start">
        <span className="text-4xl font-serif text-ems-400 leading-none mr-2">"</span>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{quote}</p>
      </div>
      <div className="flex items-center mt-4">
        <Avatar className="h-10 w-10 mr-3 border-2 border-ems-100 dark:border-ems-800">
          <AvatarFallback className="bg-ems-100 dark:bg-ems-800 text-ems-600 dark:text-ems-400">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{author}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "This tool has completely transformed our documentation process. I can generate accurate narratives in seconds that used to take me 20 minutes.",
      author: "Michael Johnson",
      role: "Paramedic, Boston EMS",
      initials: "MJ"
    },
    {
      quote: "As an EMS supervisor, I've seen a dramatic improvement in report quality and consistency across our team since implementing this tool.",
      author: "Sarah Martinez",
      role: "EMS Supervisor, San Diego FD",
      initials: "SM"
    },
    {
      quote: "The accuracy is impressive. The AI understands medical terminology perfectly and generates narratives that follow all our protocols.",
      author: "David Wilson",
      role: "Flight Medic, AirMed",
      initials: "DW"
    },
    {
      quote: "This saves me hours each week. The subscription pays for itself many times over just in the time savings alone.",
      author: "Jennifer Thomas",
      role: "EMT, Chicago EMS",
      initials: "JT"
    }
  ];

  return (
    <section id="testimonials" className="section-padding bg-white dark:bg-gray-800">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            What EMS Professionals Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Helping emergency medical services professionals improve their documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              initials={testimonial.initials}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
