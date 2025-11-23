import { Card } from '@/components/ui/card'
import { Github, Linkedin, Mail } from 'lucide-react'

const team = [
  {
    name: 'Sahil Verma',
    role: 'Lead Developer',
    // image: '/professional-developer-headshot.png'
  },
  {


    name: 'Sonal Verma',
    role: 'Product Manager',
    // image: '/professional-product-manager-headshot.jpg'
  },
  {
    name: 'Krishna Gupta',
    role: 'Backend Engineer',
    // image: '/professional-backend-engineer-headshot.jpg'
  },
  {
    name: 'Prakhar Shukla',
    role: 'Frontend Engineer',
    // image: '/professional-frontend-engineer-headshot.jpg'
  },
  {
    name: 'Adarsh Singh',
    role: 'UI/UX Designer',
    // image: '/professional-designer-headshot.png'
  },
  {
    name: 'Gaurav Sharma',
    role: 'DevOps Engineer',
    // image: '/professional-devops-engineer-headshot.jpg'
  }
]

export default function Team() {
  return (
    <section id="team" className="px-4 py-20 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Meet Our Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Dedicated professionals bringing Smart Student Hub to life with expertise and innovation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-border">
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {member.name}
                </h3>

                <p className="text-primary font-medium mb-4">
                  {member.role}
                </p>

                <div className="flex gap-3">
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </button>

                  <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Linkedin className="w-4 h-4 text-muted-foreground" />
                  </button>

                  <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Github className="w-4 h-4 text-muted-foreground" />
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
