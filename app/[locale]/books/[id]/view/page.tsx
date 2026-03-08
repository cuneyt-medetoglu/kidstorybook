"use client"

import { BookViewer } from "@/components/book-viewer/book-viewer"
import { useRouter } from "@/i18n/navigation"
import { useSearchParams } from "next/navigation"

export default function BookViewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isExample = searchParams.get("example") === "1"

  const handleClose = () => {
    if (isExample) {
      router.push("/examples")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <BookViewer
      bookId={params.id}
      onClose={handleClose}
      useExampleApi={isExample}
    />
  )
}

