"use client"

import { BookViewer } from "@/components/book-viewer/book-viewer"
import { useRouter } from "next/navigation"

/**
 * Example Book Viewer Page
 * 
 * Route: /examples/[id]
 * Purpose: View public example books (no login required)
 * 
 * @see docs/strategies/EXAMPLES_REAL_BOOKS_AND_CREATE_YOUR_OWN.md
 */
export default function ExampleBookViewPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const router = useRouter()

  const handleClose = () => {
    // Redirect back to examples page
    router.push("/examples")
  }

  return (
    <BookViewer 
      bookId={params.id} 
      onClose={handleClose}
      // Note: BookViewer fetches book via API; RLS allows reading example books
      // ROADMAP: 2.7.8 - isExample prop to conditionally hide edit/settings UI
    />
  )
}
