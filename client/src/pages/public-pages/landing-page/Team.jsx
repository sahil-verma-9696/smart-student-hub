import { Card } from '@/components/ui/card'
import { Github, Linkedin, Mail } from 'lucide-react'

const team = [
  { 
    name: 'Sahil Verma', 
    role: 'Lead Developer',
    image: '/placeholder.svg'
  },
  { 
    name: 'Sonal Verma', 
    role: 'Product Manager',
    image: "https://i.ibb.co/pvZkttnL/IMG-20250204-WA0007.jpg"
  },
  { 
    name: 'Krishna Gupta', 
    role: 'Backend Engineer',
    image: "https://i.ibb.co/0Rh6ycJ7/IMG-20250204-WA0005.jpg"
  },
  { 
    name: 'Prakhar Shukla', 
    role: 'Frontend Engineer',
    image: "https://i.ibb.co/yBkbCHqn/IMG-20250204-WA0006.jpg"
  },
  { 
    name: 'Adarsh Singh', 
    role: 'UI/UX Designer',
    image: '/placeholder.svg'
  },
  { 
    name: 'Gaurav Sharma', 
    role: 'DevOps Engineer',
    image: '/placeholder.svg'
  }
]

export default function Team() {
  return (
    <section id="team" className="px-4 py-20 sm:px-6 lg:px-8 bg-[#F7F4ED]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="space-y-4 mb-14 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0B234A]">
            Meet Our Team
          </h2>
          <p className="text-lg text-[#4b5563] max-w-2xl mx-auto">
            Dedicated professionals bringing Smart Student Hub to life
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {team.map((member, index) => (
            <Card
              key={index}
              className="
                rounded-2xl overflow-hidden
                bg-white/80 backdrop-blur-sm
                border border-[#e6e0d6]
                shadow-sm hover:shadow-md 
                transition-all duration-300
              "
            >

              {/* Clean, Adjusted Full-Width Image */}
              <div className="px-4 pt-4">
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#e9e5dd]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-[#0B234A]">
                  {member.name}
                </h3>

                <p className="text-[#2A4F8E] font-medium text-sm mb-4">
                  {member.role}
                </p>

                {/* Social Buttons */}
                <div className="flex justify-center gap-3">
                  <button className="p-2 rounded-lg hover:bg-[#f0ede7] transition-colors">
                    <Mail className="w-4 h-4 text-[#4b5563]" />
                  </button>

                  <button className="p-2 rounded-lg hover:bg-[#f0ede7] transition-colors">
                    <Linkedin className="w-4 h-4 text-[#4b5563]" />
                  </button>

                  <button className="p-2 rounded-lg hover:bg-[#f0ede7] transition-colors">
                    <Github className="w-4 h-4 text-[#4b5563]" />
                  </button>
                </div>
              </div>

            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
