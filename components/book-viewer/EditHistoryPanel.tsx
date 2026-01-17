"use client"

import { useState, useEffect } from "react"
import { X, RotateCcw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface EditHistoryItem {
  version: number
  imageUrl: string
  editPrompt: string
  createdAt: string
}

interface PageEditHistory {
  currentVersion: number
  versions: EditHistoryItem[]
}

interface EditHistoryPanelProps {
  bookId: string
  onClose: () => void
  onRevert?: (pageNumber: number, version: number) => void
}

export function EditHistoryPanel({ bookId, onClose, onRevert }: EditHistoryPanelProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [pages, setPages] = useState<{ [pageNumber: number]: PageEditHistory }>({})
  const [quotaUsed, setQuotaUsed] = useState(0)
  const [quotaLimit, setQuotaLimit] = useState(3)
  const [isReverting, setIsReverting] = useState<string | null>(null)

  useEffect(() => {
    fetchEditHistory()
  }, [bookId])

  const fetchEditHistory = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/books/${bookId}/edit-history`)
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch edit history')
      }

      setPages(result.data.pages || {})
      setQuotaUsed(result.data.quotaUsed)
      setQuotaLimit(result.data.quotaLimit)
    } catch (error) {
      console.error('[Edit History Panel] Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load edit history",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRevert = async (pageNumber: number, version: number) => {
    try {
      setIsReverting(`${pageNumber}-${version}`)

      const response = await fetch(`/api/books/${bookId}/revert-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageNumber,
          targetVersion: version,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to revert image')
      }

      toast({
        title: "Success",
        description: `Page ${pageNumber} reverted to version ${version}`,
      })

      if (onRevert) {
        onRevert(pageNumber, version)
      }

      // Refresh history
      await fetchEditHistory()
    } catch (error) {
      console.error('[Edit History Panel] Revert error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to revert image",
        variant: "destructive",
      })
    } finally {
      setIsReverting(null)
    }
  }

  const pageNumbers = Object.keys(pages).map(Number).sort((a, b) => a - b)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-auto">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Edit History</h2>
            <p className="text-sm text-muted-foreground mt-1">
              View all versions and restore previous edits
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : pageNumbers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No edit history yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Edited images will appear here with version history
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Quota Display */}
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Total Edits Used</p>
                  <p className="text-sm text-muted-foreground">
                    {quotaUsed} of {quotaLimit} edits used
                  </p>
                </div>
                <Badge variant={quotaUsed >= quotaLimit ? 'destructive' : 'default'}>
                  {quotaLimit - quotaUsed} edits remaining
                </Badge>
              </div>

              {/* Pages with History */}
              {pageNumbers.map((pageNumber) => {
                const pageHistory = pages[pageNumber]
                const sortedVersions = [...pageHistory.versions].sort((a, b) => b.version - a.version)

                return (
                  <div key={pageNumber} className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Page {pageNumber} {pageNumber === 1 ? '(Cover)' : ''}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sortedVersions.map((item) => {
                        const isCurrent = item.version === pageHistory.currentVersion
                        const revertKey = `${pageNumber}-${item.version}`

                        return (
                          <div
                            key={item.version}
                            className={`border rounded-lg p-4 space-y-3 ${
                              isCurrent ? 'ring-2 ring-purple-500' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant={isCurrent ? 'default' : 'secondary'}>
                                  Version {item.version}
                                </Badge>
                                {isCurrent && (
                                  <Badge variant="default" className="bg-purple-500">
                                    Current
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-muted">
                              <Image
                                src={item.imageUrl}
                                alt={`Page ${pageNumber} - Version ${item.version}`}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>

                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">
                                <strong>Edit:</strong> {item.editPrompt}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(item.createdAt).toLocaleString()}
                              </p>
                            </div>

                            {!isCurrent && (
                              <Button
                                onClick={() => handleRevert(pageNumber, item.version)}
                                disabled={isReverting === revertKey}
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                {isReverting === revertKey ? (
                                  <>
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                    Reverting...
                                  </>
                                ) : (
                                  <>
                                    <RotateCcw className="mr-2 h-3 w-3" />
                                    Restore This Version
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
