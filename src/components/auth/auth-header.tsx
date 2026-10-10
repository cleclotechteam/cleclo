import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function AuthHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Cleclo Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>
        <Button variant="ghost" className="font-medium">
          Need Help?
        </Button>
      </div>
    </header>
  )
}
