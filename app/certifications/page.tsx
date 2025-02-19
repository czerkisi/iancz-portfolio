import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const certifications = [
  {
    title: "AWS Certified Cloud Practitioner",
    issueDate: "2023",
    description:
      "Comprehensive understanding of AWS Cloud concepts, services, security, architecture, pricing, and support",
    image: "/placeholder.svg",
  },
  {
    title: "AWS Certified Developer - Associate",
    issueDate: "2023",
    description:
      "Demonstrated knowledge of core AWS services, uses, and best practices for developing secure AWS Cloud applications",
    image: "/placeholder.svg",
  },
]

export default function CertificationsPage() {
  return (
    <div className="container py-12 md:py-24">
      <h1 className="text-4xl font-bold tracking-tighter mb-12 text-center">Certifications</h1>
      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {certifications.map((cert, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="relative h-48 p-0">
              <Image src={cert.image || "/placeholder.svg"} alt={cert.title} fill className="object-cover" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold">{cert.title}</h2>
                  <p className="text-sm text-muted-foreground">Issued: {cert.issueDate}</p>
                </div>
                <p className="text-muted-foreground">{cert.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

