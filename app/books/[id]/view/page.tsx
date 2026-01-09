"use client"

import { BookViewer } from "@/components/book-viewer/book-viewer"
import { useRouter } from "next/navigation"

export default function BookViewPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const handleClose = () => {
    router.push("/books")
  }

  return <BookViewer bookId={params.id} onClose={handleClose} />
}

