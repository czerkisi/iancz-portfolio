import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const projects = [
    {
        title: "NBA Betting AI Model",
        description:
            "An innovative AI model that predicts NBA game outcomes using advanced machine learning techniques.",
        image: "/images/nba.jpg",
    },
    {
        title: "Workload Planner",
        description:
            "A tool designed to streamline class and professor management for universities",
        image: "/images/wlp.png",
    },
    {
        title: "Freelance Website Development",
        description:
            "A modern, responsive website built to showcase freelance work and portfolio projects.",
        image: "/images/webdev.png",
    },
]

export default function ProjectsPage() {
    return (
        <div className="container py-12 md:py-24">
            <h1 className="text-4xl font-bold tracking-tighter mb-12 text-center">
                Projects
            </h1>
            <div className="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto">
                {projects.map((project, index) => (
                    <Card key={index} className="overflow-hidden">
                        <div className="relative w-full h-48">
                            <Image
                                src={project.image || "/placeholder.svg"}
                                alt={project.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold">{project.title}</h2>
                            <p className="text-muted-foreground mt-2">
                                {project.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
