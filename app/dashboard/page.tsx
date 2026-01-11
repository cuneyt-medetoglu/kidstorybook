"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Search, Grid3x3, List, BookOpen, Plus, Download, Share2, Trash2, Edit, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty } from "@/components/ui/empty"
import { useToast } from "@/hooks/use-toast"

type Book = {
  id: string
  title: string
  character: string
  coverImage: string
  status: "completed" | "in-progress" | "draft"
  createdDate: string
}

const mockBooks: Book[] = [
  {
    id: "book-123",
    title: "Arya's Adventure",
    character: "Arya",
    coverImage: "/children-s-book-cover-with-magical-adventure-theme.jpg",
    status: "completed",
    createdDate: "Jan 5, 2026",
  },
  {
    id: "book-456",
    title: "Emma's Space Journey",
    character: "Emma",
    coverImage: "/children-s-book-cover-with-space-theme.jpg",
    status: "in-progress",
    createdDate: "Jan 8, 2026",
  },
  {
    id: "book-789",
    title: "Oliver's Magic Forest",
    character: "Oliver",
    coverImage: "/children-s-book-cover-with-enchanted-forest-theme.jpg",
    status: "draft",
    createdDate: "Jan 10, 2026",
  },
]

const statusConfig = {
  completed: { label: "Completed", color: "bg-green-500/10 text-green-700 dark:text-green-400" },
  "in-progress": { label: "In Progress", color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" },
  draft: { label: "Draft", color: "bg-gray-500/10 text-gray-700 dark:text-gray-400" },
}

export default function LibraryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [books, setBooks] = useState<Book[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<string>("date-newest")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [downloadingBookId, setDownloadingBookId] = useState<string | null>(null)

  // Check authentication and fetch books
  useEffect(() => {
    const checkAuthAndFetchBooks = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          // Not authenticated, redirect to login
          console.log("[Dashboard] Not authenticated, redirecting to login")
          router.push("/auth/login")
          return
        }
        
        // Authenticated, allow access
        console.log("[Dashboard] Authenticated user:", user.email)
        setIsAuthenticated(true)

        // Fetch books from API
        console.log("[Dashboard] Fetching books from API...")
        const response = await fetch('/api/books', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          console.error("[Dashboard] Error fetching books:", result)
          toast({
            title: "Error",
            description: "Failed to load books. Please try again.",
            variant: "destructive",
          })
          setBooks([])
        } else {
          console.log("[Dashboard] Books fetched successfully:", result.data?.length || 0, "books")
          
          // Transform API response to Book type
          const transformedBooks: Book[] = (result.data || []).map((book: any) => ({
            id: book.id,
            title: book.title,
            character: book.character_id ? "Character" : "Unknown", // TODO: Fetch character name
            coverImage: book.cover_image_url || "", // No mock data fallback - empty string if no cover
            status: book.status === 'completed' ? 'completed' : 
                   book.status === 'generating' ? 'in-progress' : 'draft',
            createdDate: new Date(book.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
          }))

          setBooks(transformedBooks)
        }
      } catch (err) {
        console.error("[Dashboard] Error:", err)
        toast({
          title: "Error",
          description: "Failed to load books. Please try again.",
          variant: "destructive",
        })
        setBooks([])
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuthAndFetchBooks()
  }, [router, toast])

  // Filter and search (moved before early return to fix hooks order)
  const filteredBooks = useMemo(() => {
    let result = books.filter((book) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "completed" && book.status === "completed") ||
        (filter === "in-progress" && book.status === "in-progress") ||
        (filter === "drafts" && book.status === "draft")
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "date-newest":
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        case "date-oldest":
          return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
        case "title-az":
          return a.title.localeCompare(b.title)
        case "title-za":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

    return result
  }, [books, filter, searchQuery, sortBy])

  // Show loading state while checking auth (moved after hooks to fix hooks order)
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto" />
          <p className="text-gray-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  const handleCreateBook = () => {
    router.push("/create/step1")
  }

  const handleReadBook = (bookId: string) => {
    router.push(`/books/${bookId}/view`)
  }

  const handleEditBook = (bookId: string) => {
    // TODO: Navigate to edit page (Faz 3'te implement edilecek)
    console.log("Edit book:", bookId)
  }

  const handleDownloadBook = async (bookId: string) => {
    try {
      setDownloadingBookId(bookId)
      console.log("[Dashboard] Downloading book:", bookId)

      // Call PDF generation API
      const response = await fetch(`/api/books/${bookId}/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.details || 'Failed to generate PDF')
      }

      const pdfUrl = result.data?.pdfUrl

      if (!pdfUrl) {
        throw new Error('PDF URL not found in response')
      }

      console.log("[Dashboard] PDF generated successfully:", pdfUrl)

      // Download PDF
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `${bookId}.pdf`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "PDF Downloaded!",
        description: "Your book PDF has been downloaded successfully.",
      })
    } catch (error) {
      console.error("[Dashboard] Error downloading book:", error)
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloadingBookId(null)
    }
  }

  const handleShareBook = (bookId: string) => {
    // TODO: Share functionality (Faz 3'te implement edilecek)
    console.log("Share book:", bookId)
  }

  const handleDeleteBook = async (bookId: string) => {
    try {
      // TODO: Add confirmation modal later
      if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
        return
      }

      console.log("[Dashboard] Deleting book:", bookId)

      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.details || 'Failed to delete book')
      }

      console.log("[Dashboard] Book deleted successfully:", bookId)

      // Remove book from local state
      setBooks(books.filter(book => book.id !== bookId))

      toast({
        title: "Book Deleted",
        description: "The book has been deleted successfully.",
      })
    } catch (error) {
      console.error("[Dashboard] Error deleting book:", error)
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete book. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-background dark:from-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-4xl font-bold text-foreground">My Library</h1>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {books.length}
            </Badge>
          </div>

          {/* Filters and Controls */}
          <div className="space-y-4">
            {/* Top Row: Tabs and Create Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All Books</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="drafts">Drafts</TabsTrigger>
                </TabsList>
              </Tabs>

              <Button
                size="lg"
                onClick={handleCreateBook}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity w-full sm:w-auto text-white"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create New Book
              </Button>
            </div>

            {/* Bottom Row: Search, View Toggle, Sort */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="px-3"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="px-3"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-newest">Date (Newest)</SelectItem>
                    <SelectItem value="date-oldest">Date (Oldest)</SelectItem>
                    <SelectItem value="title-az">Title (A-Z)</SelectItem>
                    <SelectItem value="title-za">Title (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="w-full aspect-[3/4] mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 flex-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <Empty
            icon={BookOpen}
            title="No books yet"
            description="Create your first magical storybook!"
            action={
              <Button
                size="lg"
                onClick={handleCreateBook}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity text-white"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create New Book
              </Button>
            }
          />
        ) : (
          <motion.div
            layout
            className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
          >
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-4">
                    {/* Book Cover */}
                    <div className="relative mb-4 overflow-hidden rounded-lg aspect-[3/4] bg-muted">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600" />
                        </div>
                      )}
                    </div>

                    {/* Book Info */}
                    <div className="space-y-2 mb-4">
                      <h3 className="font-semibold text-lg line-clamp-2 text-foreground">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">Character: {book.character}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Created {book.createdDate}</p>
                        <Badge variant="secondary" className={statusConfig[book.status].color}>
                          {statusConfig[book.status].label}
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleReadBook(book.id)}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity text-white"
                      >
                        Read
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEditBook(book.id)} className="flex-1">
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                    </div>

                    <div className="flex items-center gap-1 mt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownloadBook(book.id)}
                        disabled={downloadingBookId === book.id}
                        className="flex-1"
                        title="Download PDF"
                      >
                        {downloadingBookId === book.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleShareBook(book.id)}
                        className="flex-1"
                        title="Share"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteBook(book.id)}
                        className="flex-1 hover:text-destructive hover:bg-destructive/10"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

