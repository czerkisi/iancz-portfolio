import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const certifications = [
    {
        title: "AWS Certified Cloud Practitioner",
        subtitle: "Issued in August 2023 by Amazon Web Services",
        description:
            "Gained a solid foundation in AWS Cloud concepts, covering cloud computing principles, essential AWS services, security best practices, architectural principles, pricing models, and support options.",
        image: "/icons/cloudpractitioner.png",
    },
    {
        title: "AWS Certified Developer - Associate",
        subtitle: "Issued in August 2024 by Amazon Web Services",
        description:
            "Developed a strong grasp of core AWS services, architectural best practices, and development tools, while mastering techniques for building secure, scalable, and robust cloud applications.",
        image: "/icons/associatedeveloper.png",
    },
]

export default function CertificationsPage() {
    return (
        <div className="container py-12 md:py-24">
            <h1 className="text-4xl font-bold tracking-tighter mb-12 text-center">
                Certifications
            </h1>
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                {certifications.map((cert, index) => (
                    <Card key={index} className="overflow-hidden">
                        <CardContent className="p-6">
                            {/* Row with image and text */}
                            <div className="flex items-center">
                                <div className="relative w-24 h-24 mr-4">
                                    <Image
                                        src={cert.image || "/placeholder.svg"}
                                        alt={cert.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{cert.title}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {cert.subtitle}
                                    </p>
                                </div>
                            </div>
                            {/* Description below */}
                            <div className="mt-4">
                                <p className="text-muted-foreground">{cert.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
