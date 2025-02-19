"use client"

import { motion, useMotionValue, useSpring } from "framer-motion"
import type { MouseEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Skill = {
  name: string
  category: string
  description: string
  icon: string
}

const skills: Record<string, Skill[]> = {
  "Programming Languages": [
    {
      name: "Java",
      category: "Languages",
      description: "Enterprise application development and backend services",
      icon: "/icons/java.png",
    },
    {
      name: "Python",
      category: "Languages",
      description: "Data processing and backend development",
      icon: "/icons/python.png",
    },
    {
      name: "C/C++",
      category: "Languages",
      description: "Systems programming and performance-critical applications",
      icon: "/icons/cpp.png",
    },
    {
      name: "JavaScript",
      category: "Languages",
      description: "Frontend and Node.js development",
      icon: "/icons/js.png",
    },
    {
      name: "TypeScript",
      category: "Languages",
      description: "Type-safe JavaScript development",
      icon: "/icons/ts.png",
    },
    {
      name: "Go",
      category: "Languages",
      description: "Cloud-native application development",
      icon: "/icons/golang.png",
    },
  ],
  "Cloud & DevOps": [
    {
      name: "Amazon Web Services",
      category: "Cloud",
      description: "Cloud infrastructure and services",
      icon: "/icons/aws.png",
    },
    {
      name: "Google Cloud",
      category: "Cloud",
      description: "Cloud platform services",
      icon: "/icons/gcp.png",
    },
    {
      name: "Azure",
      category: "Cloud",
      description: "Microsoft cloud services",
      icon: "/icons/azure.png",
    },
    {
      name: "Kubernetes",
      category: "DevOps",
      description: "Container orchestration",
      icon: "/icons/kubernetes.png",
    },
    {
      name: "Docker",
      category: "DevOps",
      description: "Container platform",
      icon: "/icons/docker.png",
    },
    {
      name: "Terraform",
      category: "DevOps",
      description: "Infrastructure as Code",
      icon: "/icons/terraform.png",
    },
    {
      name: "Jenkins",
      category: "DevOps",
      description: "Continuous Integration/Deployment",
      icon: "/icons/jenkins.png",
    },
    {
      name: "Splunk",
      category: "DevOps",
      description: "Log monitoring and analysis",
      icon: "/icons/splunk.png",
    },
  ],
  "Web Frameworks": [
    {
      name: "React",
      category: "Web Frameworks",
      description: "Building modern user interfaces",
      icon: "/icons/react.png",
    },
    {
      name: "Next.js",
      category: "Web Frameworks",
      description: "React framework for production-grade applications",
      icon: "/icons/nextjs.png",
    },
    {
      name: "Spring",
      category: "Web Frameworks",
      description: "Java-based enterprise applications",
      icon: "/icons/spring.png",
    },
    {
      name: "Express",
      category: "Web Frameworks",
      description: "Node.js web applications and APIs",
      icon: "/icons/express.png",
    },
    {
      name: "Flask",
      category: "Web Frameworks",
      description: "Python web development",
      icon: "/icons/flask.png",
    },
  ],
}

function MotionTracker() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const handleMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event
    const { innerWidth, innerHeight } = window

    x.set((clientX / innerWidth) * 2 - 1)
    y.set((clientY / innerHeight) * 2 - 1)
  }

  return (
      <div className="relative h-[50vh] overflow-hidden" onMouseMove={handleMouseMove}>
        <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20"
            style={{
              x: mouseXSpring.get() * 100,
              y: mouseYSpring.get() * 100,
            }}
        />
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Ian Czerkis
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Software Engineer with a Strong Background in
              <br />
              Infrastructure Platforms and Platform Engineering
            </p>
          </div>
        </div>
      </div>
  )
}

function SkillsSection() {
  return (
      <section className="py-8 md:py-16">
        <div className="container space-y-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Skills
          </h2>
          {Object.entries(skills).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-4">{category}</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {categorySkills.map((skill) => (
                      <TooltipProvider key={skill.name} delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Card className="p-2 hover:bg-accent transition-colors">
                              <div className="flex flex-col items-center gap-1">
                                {/* Fixed-height container for logos */}
                                <div className="w-full h-12 flex items-center justify-center">
                                  <Image
                                      src={skill.icon || "/icons/.png"}
                                      alt={skill.name}
                                      width={32}
                                      height={32}
                                      className="object-contain"
                                  />
                                </div>
                                <h4 className="text-xs font-medium text-center">
                                  {skill.name}
                                </h4>
                              </div>
                            </Card>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-sm">{skill.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                  ))}
                </div>
              </div>
          ))}
        </div>
      </section>
  )
}

export default function HomePage() {
  return (
      <>
        <MotionTracker />
        <SkillsSection />
        <div className="container py-8 text-center">
          <Link href="/experience">
            <Button size="lg">
              View My Experience
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
      </>
  )
}
