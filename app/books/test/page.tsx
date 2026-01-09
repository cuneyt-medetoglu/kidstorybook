"use client"

import { BookViewer } from "@/components/book-viewer/book-viewer"
import { useRouter } from "next/navigation"

export default function TestBookViewPage() {
  const router = useRouter()

  const handleClose = () => {
    router.push("/")
  }

  return <BookViewer onClose={handleClose} />
}

