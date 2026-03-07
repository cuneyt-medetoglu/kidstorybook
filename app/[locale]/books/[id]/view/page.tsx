"use client"

import { BookViewer } from "@/components/book-viewer/book-viewer"
import { useRouter } from "@/i18n/navigation"

export default function BookViewPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const handleClose = () => {
    // ROADMAP: Redirect to /books list if needed
    // For now, redirect to dashboard
    router.push("/dashboard")
  }

  return <BookViewer bookId={params.id} onClose={handleClose} />
}

