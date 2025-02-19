import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function EducationPage() {
  return (
    <div className="container py-12 md:py-24">
      <h1 className="text-4xl font-bold tracking-tighter mb-12 text-center">Education</h1>
      <Card className="overflow-hidden max-w-4xl mx-auto">
        <div className="md:grid md:grid-cols-3 md:gap-8">
          <div className="relative h-64 md:h-full flex items-center justify-center bg-white p-4">
            <Image
              src="/icons/msoe.png"
              alt="MSOE Logo"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
          <CardContent className="p-6 md:col-span-2">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">Milwaukee School of Engineering</h2>
                <p className="text-muted-foreground">Bachelor of Science in Software Engineering</p>
              </div>
              <div>
                <p className="font-medium">September 2021 - December 2024</p>
              </div>
              <div className="prose prose-gray dark:prose-invert">
                <p>
                  Completed a comprehensive Software Engineering program focusing on software design, development
                  methodologies, and practical application of engineering principles to software systems. Gained
                  extensive experience in both theoretical concepts and hands-on development across multiple platforms
                  and technologies.
                </p>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
      <div className="mt-12 text-center">
        <Link href="/certifications">
          <Button size="lg">
            View My Certifications
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

