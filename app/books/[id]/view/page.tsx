"use client"

import { BookViewer } from "@/components/book-viewer/book-viewer"
import { useRouter } from "next/navigation"

export default function BookViewPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const handleClose = () => {
    // TODO: After /books route is added, redirect to /books
    // For now, redirect to dashboard
    router.push("/dashboard")
  }

  return <BookViewer bookId={params.id} onClose={handleClose} />
}

