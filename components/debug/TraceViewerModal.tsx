"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Download, Copy } from "lucide-react"
import JsonView from "@uiw/react-json-view"

export interface DebugTraceEntry {
  step: string
  request: unknown
  response: unknown
}

interface TraceViewerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trace: DebugTraceEntry[]
  title?: string
}

/** Tek dosyada GPT'ye göndermek için tüm trace (request/response) objesi */
export function buildFullTraceExport(trace: DebugTraceEntry[]) {
  return {
    exportedAt: new Date().toISOString(),
    source: "KidStoryBook create-book (debugTrace: true)",
    stepCount: trace.length,
    steps: trace.map((e) => ({
      step: e.step,
      request: e.request,
      response: e.response,
    })),
  }
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function TraceViewerModal({
  open,
  onOpenChange,
  trace,
  title = "Create Book – Tüm adımlar (request/response)",
}: TraceViewerModalProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [copied, setCopied] = useState(false)

  const toggle = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const handleDownload = () => {
    const payload = buildFullTraceExport(trace)
    const filename = `kidstorybook-trace-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.json`
    downloadJson(filename, payload)
  }

  const handleCopy = async () => {
    const payload = buildFullTraceExport(trace)
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: trigger download instead
      handleDownload()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto space-y-2">
          {trace.map((entry, index) => (
            <div key={entry.step} className="border rounded-lg overflow-hidden bg-slate-50">
              <button
                type="button"
                className="w-full flex items-center gap-2 p-3 text-left font-medium hover:bg-slate-100"
                onClick={() => toggle(index)}
              >
                {expanded[index] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="text-sm font-mono">{entry.step}</span>
              </button>
              {expanded[index] && (
                <div className="p-4 pt-0 space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-600 mb-1">Request</div>
                    <div className="border rounded p-3 bg-white text-sm overflow-auto max-h-96">
                      <JsonView
                        value={
                          entry.request !== null && typeof entry.request === "object"
                            ? entry.request
                            : undefined
                        }
                        collapsed={2}
                        displayDataTypes={false}
                        style={{ backgroundColor: "transparent", fontSize: "12px" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-600 mb-1">Response</div>
                    <div className="border rounded p-3 bg-white text-sm overflow-auto max-h-96">
                      <JsonView
                        value={
                          entry.response !== null && typeof entry.response === "object"
                            ? entry.response
                            : undefined
                        }
                        collapsed={2}
                        displayDataTypes={false}
                        style={{ backgroundColor: "transparent", fontSize: "12px" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 border-t gap-2 flex-wrap">
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Tüm trace'i indir (JSON)
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" />
              {copied ? "Kopyalandı" : "Panoya kopyala"}
            </Button>
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Kapat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
