"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Download, Share2, Trash2, Loader2, History, RefreshCw, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { ImageEditModal } from "@/components/book-viewer/ImageEditModal"
import { RegenerateImageModal } from "@/components/book-viewer/RegenerateImageModal"
import { EditHistoryPanel } from "@/components/book-viewer/EditHistoryPanel"
import { getIllustrationStyleName } from "@/lib/constants/illustration-styles"

interface Book {
  id: string
  title: string
  theme: string
  illustration_style: string
  language: string
  age_group?: string
  status: string
  cover_image_url?: string
  story_data: {
    title: string
    pages: Array<{
      pageNumber: number
      text: string
      imageUrl?: string
    }>
  }
  edit_quota_used: number
  edit_quota_limit: number
  imageEditQuotaBypass?: boolean
  created_at: string
}

export default function BookSettingsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPage, setEditingPage] = useState<number | null>(null)
  const [showRegenerateModal, setShowRegenerateModal] = useState(false)
  const [regeneratingPage, setRegeneratingPage] = useState<number | null>(null)
  const [showHistoryPanel, setShowHistoryPanel] = useState(false)
  const [illustrationStyleImageError, setIllustrationStyleImageError] = useState(false)
  const [showStyleImageModal, setShowStyleImageModal] = useState(false)

  // Reset illustration style image error when book changes
  useEffect(() => {
    setIllustrationStyleImageError(false)
  }, [book?.id, book?.illustration_style])

  // Fetch book data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/books/${params.id}`)
        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Failed to fetch book')
        }

        setBook(result.data)
      } catch (error) {
        console.error('[Book Settings] Error fetching book:', error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load book",
          variant: "destructive",
        })
        router.push('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBook()
  }, [params.id, router, toast])

  const handleBackToBook = () => {
    router.push(`/books/${params.id}/view`)
  }

  const handleEditImage = (pageNumber: number) => {
    setEditingPage(pageNumber)
    setShowEditModal(true)
  }

  const handleRegenerateImage = (pageNumber: number) => {
    setRegeneratingPage(pageNumber)
    setShowRegenerateModal(true)
  }

  const handleEditSuccess = (editedImageUrl: string) => {
    if (!book) return
    if (editingPage === 0) {
      setBook({
        ...book,
        cover_image_url: editedImageUrl,
        edit_quota_used: book.edit_quota_used + 1,
      })
      return
    }
    if (book.story_data && editingPage) {
      const updatedPages = [...book.story_data.pages]
      const pageIndex = editingPage - 1
      if (updatedPages[pageIndex]) {
        updatedPages[pageIndex] = {
          ...updatedPages[pageIndex],
          imageUrl: editedImageUrl,
        }
        setBook({
          ...book,
          story_data: {
            ...book.story_data,
            pages: updatedPages,
          },
          edit_quota_used: book.edit_quota_used + 1,
        })
      }
    }
  }

  const handleRegenerateSuccess = (editedImageUrl: string) => {
    if (!book) return
    if (regeneratingPage === 0) {
      setBook({
        ...book,
        cover_image_url: editedImageUrl,
        edit_quota_used: book.edit_quota_used + 1,
      })
      return
    }
    if (book.story_data && regeneratingPage) {
      const updatedPages = [...book.story_data.pages]
      const pageIndex = regeneratingPage - 1
      if (updatedPages[pageIndex]) {
        updatedPages[pageIndex] = {
          ...updatedPages[pageIndex],
          imageUrl: editedImageUrl,
        }
        setBook({
          ...book,
          story_data: {
            ...book.story_data,
            pages: updatedPages,
          },
          edit_quota_used: book.edit_quota_used + 1,
        })
      }
    }
  }

  const handleRevert = (pageNumber: number, version: number) => {
    // Refresh book data after revert
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${params.id}`)
        const result = await response.json()
        if (result.success) {
          setBook(result.data)
        }
      } catch (error) {
        console.error('[Book Settings] Error refreshing book:', error)
      }
    }
    fetchBook()
  }

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true)
      const response = await fetch(`/api/books/${params.id}/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate PDF')
      }

      const pdfUrl = result.data?.pdfUrl
      if (!pdfUrl) {
        throw new Error('PDF URL not found')
      }

      // Download PDF
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `${book?.title || 'book'}.pdf`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Success",
        description: "PDF downloaded successfully",
      })
    } catch (error) {
      console.error('[Book Settings] Error downloading PDF:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to download PDF",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShareBook = () => {
    // ROADMAP: Share functionality (kitap paylaşımı)
    toast({
      title: "Coming Soon",
      description: "Share functionality will be available soon",
    })
  }

  const handleDeleteBook = async () => {
    if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/books/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete book')
      }

      toast({
        title: "Success",
        description: "Book deleted successfully",
      })

      router.push('/dashboard')
    } catch (error) {
      console.error('[Book Settings] Error deleting book:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete book",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto" />
          <p className="text-gray-600 dark:text-slate-400">Loading book settings...</p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Book not found</p>
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const quotaRemaining = book.edit_quota_limit - book.edit_quota_used
  const isQuotaBypass = book.imageEditQuotaBypass === true

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-background dark:from-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={handleBackToBook}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Book
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Book Settings</h1>
            <p className="text-muted-foreground">{book.title}</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {isQuotaBypass ? 'Unlimited (Admin)' : `${quotaRemaining}/${book.edit_quota_limit} Changes Left`}
          </Badge>
        </div>

        {/* Book Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>📖 Book Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium">{book.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Theme</p>
                <p className="font-medium capitalize">{book.theme}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Illustration Style</p>
                <div className="flex items-center gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => !illustrationStyleImageError && setShowStyleImageModal(true)}
                    className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:opacity-90 transition-opacity disabled:pointer-events-none"
                    disabled={illustrationStyleImageError}
                    aria-label={`View ${getIllustrationStyleName(book.illustration_style)} style example`}
                  >
                    {!illustrationStyleImageError ? (
                      <Image
                        src={`/illustration-styles/${book.illustration_style}.jpg`}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                        onError={() => setIllustrationStyleImageError(true)}
                      />
                    ) : (
                      <Palette className="h-6 w-6 text-muted-foreground" />
                    )}
                  </button>
                  <p className="font-medium">{getIllustrationStyleName(book.illustration_style)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Language</p>
                <p className="font-medium uppercase">{book.language}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={book.status === 'completed' ? 'default' : 'secondary'}>
                  {book.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pages</p>
                <p className="font-medium">{book.story_data?.pages?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Images Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🎨 Edit Images</CardTitle>
            <p className="text-sm text-muted-foreground">
              Fix or regenerate page images.{' '}
            {isQuotaBypass
              ? 'Unlimited changes (admin).'
              : `You have ${quotaRemaining} change${quotaRemaining !== 1 ? 's' : ''} remaining (edit or regenerate).`}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Cover card when book has separate cover image */}
              {book.cover_image_url && (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cover</span>
                    <Badge variant="outline" className="text-xs">Cover</Badge>
                  </div>
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-muted">
                    <Image
                      src={book.cover_image_url}
                      alt="Cover"
                      fill
                      sizes="(max-width: 768px) 50vw, 200px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <Button
                    onClick={() => handleEditImage(0)}
                    disabled={(!isQuotaBypass && quotaRemaining === 0)}
                    className="w-full"
                    size="sm"
                    variant="outline"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Image
                  </Button>
                  <Button
                    onClick={() => handleRegenerateImage(0)}
                    disabled={(!isQuotaBypass && quotaRemaining === 0)}
                    className="w-full"
                    size="sm"
                    variant="outline"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              )}
              {book.story_data?.pages?.map((page) => (
                <div key={page.pageNumber} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Page {page.pageNumber}</span>
                    <Badge variant="outline" className="text-xs">Story</Badge>
                  </div>
                  
                  {page.imageUrl && (
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-muted">
                      <Image
                        src={page.imageUrl}
                        alt={`Page ${page.pageNumber}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 200px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  <Button
                    onClick={() => handleEditImage(page.pageNumber)}
                    disabled={(!isQuotaBypass && quotaRemaining === 0) || !page.imageUrl}
                    className="w-full"
                    size="sm"
                    variant="outline"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Image
                  </Button>
                  <Button
                    onClick={() => handleRegenerateImage(page.pageNumber)}
                    disabled={(!isQuotaBypass && quotaRemaining === 0) || !page.imageUrl}
                    className="w-full"
                    size="sm"
                    variant="outline"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit History */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>📋 Edit History</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => setShowHistoryPanel(true)}>
              <History className="mr-2 h-4 w-4" />
              View All Versions
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading || book.status !== 'completed'}
              variant="outline"
            >
              {isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download PDF
            </Button>

            <Button
              onClick={handleShareBook}
              variant="outline"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Book
            </Button>

            <Button
              onClick={handleDeleteBook}
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete Book
            </Button>
          </CardContent>
        </Card>

        {/* Image Edit Modal */}
        {showEditModal && editingPage !== null && editingPage !== undefined && book && (
          <ImageEditModal
            bookId={book.id}
            pageNumber={editingPage}
            currentImageUrl={editingPage === 0 ? (book.cover_image_url || '') : (book.story_data.pages[editingPage - 1]?.imageUrl || '')}
            onClose={() => {
              setShowEditModal(false)
              setEditingPage(null)
            }}
            onSuccess={handleEditSuccess}
          />
        )}

        {/* Edit History Panel */}
        {showHistoryPanel && book && (
          <EditHistoryPanel
            bookId={book.id}
            onClose={() => setShowHistoryPanel(false)}
            onRevert={handleRevert}
          />
        )}

        {/* Regenerate Image Modal */}
        {showRegenerateModal && regeneratingPage !== null && regeneratingPage !== undefined && book && (
          <RegenerateImageModal
            bookId={book.id}
            pageNumber={regeneratingPage}
            pageText={regeneratingPage === 0 ? (book.story_data.pages[0]?.text ?? "") : (book.story_data.pages[regeneratingPage - 1]?.text ?? "")}
            onClose={() => {
              setShowRegenerateModal(false)
              setRegeneratingPage(null)
            }}
            onSuccess={handleRegenerateSuccess}
          />
        )}

        {/* Illustration Style image enlarge modal */}
        <Dialog open={showStyleImageModal} onOpenChange={setShowStyleImageModal}>
          <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
            <DialogHeader className="p-4 pb-0">
              <DialogTitle>{getIllustrationStyleName(book.illustration_style)}</DialogTitle>
            </DialogHeader>
            <div className="relative aspect-[2/3] w-full max-h-[80vh] bg-muted">
              <Image
                src={`/illustration-styles/${book.illustration_style}.jpg`}
                alt={`${getIllustrationStyleName(book.illustration_style)} style example`}
                fill
                sizes="(max-width: 672px) 100vw, 672px"
                className="object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
