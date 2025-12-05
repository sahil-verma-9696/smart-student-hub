import { Github, Linkedin, Mail } from 'lucide-react'

const team = [
  {
    name: 'Sahil Verma',
    role: 'Lead Developer',
    initials: 'SV',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Sonal Verma',
    role: 'Product Manager',
    initials: 'SV',
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Krishna Gupta',
    role: 'Backend Engineer',
    initials: 'KG',
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Prakhar Shukla',
    role: 'Frontend Engineer',
    initials: 'PS',
    color: 'from-orange-500 to-red-500'
  },
  {
    name: 'Adarsh Singh',
    role: 'UI/UX Designer',
    initials: 'AS',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    name: 'Gaurav Sharma',
    role: 'DevOps Engineer',
    initials: 'GS',
    color: 'from-teal-500 to-blue-500'
  }
]

export default function Team() {
  return (
    <section id="team" className="px-4 py-20 sm:py-28 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-slate-900 mb-6">
            Meet Our Team
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-light">
            Dedicated professionals bringing Smart Student Hub to life with expertise and innovation
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Avatar */}
              <div className="p-8 pb-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="font-display text-2xl text-white">{member.initials}</span>
                </div>

                <h3 className="font-display text-xl text-slate-900 mb-1">
                  {member.name}
                </h3>

                <p className="text-slate-600 font-medium mb-6">
                  {member.role}
                </p>

                {/* Social Links */}
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white transition-colors duration-200 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white transition-colors duration-200 flex items-center justify-center">
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white transition-colors duration-200 flex items-center justify-center">
                    <Github className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className={`h-1 bg-gradient-to-r ${member.color}`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
