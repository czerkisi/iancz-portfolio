import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const experiences = [
  {
    title: "Software Engineer",
    company: "JPMorganChase",
    location: "Jersey City, New Jersey",
    period: "February 2025 - Present",
    description:
      "Working on cloud architecture and infrastructure projects, contributing to the development of scalable and efficient solutions for enterprise-level applications.",
    logo: "/icons/jpmc.png",
  },
  {
    title: "Software Engineering Intern",
    company: "JPMorganChase",
    location: "Jersey City, New Jersey",
    period: "June 2024 - August 2024",
    description:
      "Worked on a cloud architecture team to consult and assist with application migrations to Public Cloud, and contributed to a Product as a Platform infrastructure automation tool for hundreds of product teams.",
    logo: "/icons/jpmc.png",
  },
  {
    title: "Software Engineering Intern",
    company: "JPMorganChase",
    location: "Jersey City, New Jersey",
    period: "May 2023 - August 2023",
    description:
      "Developed full stack applications in an AWS environment, deployed on Amazon Web Services, and wrote microservices to manage databases and web applications.",
    logo: "/icons/jpmc.png",
  },
  {
    title: "Applications Engineer Intern",
    company: "Intrepid Control Systems",
    period: "May 2022 - August 2022",
    location: "Troy, Michigan",
    description:
      "Created and debugged vehicle network solutions using C#, Python, and proprietary languages for Fortune 500 companies and major conferences.",
    logo: "/icons/intrepidcs.png",
  },
]

export default function ExperiencePage() {
  return (
    <div className="container py-12 md:py-24">
      <h1 className="text-4xl font-bold tracking-tighter mb-12 text-center">Experience</h1>
      <div className="relative max-w-4xl mx-auto">
        {/* Timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border transform -translate-x-1/2" />

        <div className="space-y-12">
          {experiences.map((experience, index) => (
            <div key={index} className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Timeline dot */}
              <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 md:block hidden">
                <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
              </div>

              <Card className={`p-6 ${index % 2 === 0 ? "md:mr-8" : "md:ml-8 md:col-start-2"}`}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={experience.logo || "/placeholder.svg"}
                      alt={`${experience.company} logo`}
                      width={60}
                      height={60}
                      className="rounded-lg object-contain"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{experience.title}</h3>
                      <p className="text-muted-foreground">{experience.company}</p>
                    </div>
                  </div>
                  <div>
                    {experience.location && <p className="text-sm font-medium">{experience.location}</p>}
                    <p className="text-sm text-muted-foreground">{experience.period}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{experience.description}</p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12 text-center">
        <Link href="/education">
          <Button size="lg">
            View My Education
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2 h-4 w-4"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  )
}

