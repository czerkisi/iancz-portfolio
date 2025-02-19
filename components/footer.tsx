import { Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center gap-4 py-6 md:h-16 md:flex-row md:justify-between md:py-0">
        <div className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Ian Czerkis. All rights reserved.
        </div>
        <div className="flex gap-4">
          <Link
            href="https://github.com/czerkisi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="https://www.linkedin.com/in/ian-czerkis/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <a href="mailto:ian.se.inbound@proton.me" className="text-muted-foreground hover:text-foreground">
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

