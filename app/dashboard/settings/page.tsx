"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Settings,
  ShoppingBag,
  Gift,
  Bell,
  CreditCard,
  Menu,
  X,
  Camera,
  Check,
  AlertTriangle,
  Download,
  Eye,
  Trash2,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { ToastProvider } from "@/components/providers/ToastProvider"

type Section = "profile" | "account" | "orders" | "free-cover" | "notifications" | "billing"

const sidebarItems = [
  { id: "profile" as Section, label: "Profile", icon: User },
  { id: "account" as Section, label: "Account Settings", icon: Settings },
  { id: "orders" as Section, label: "Order History", icon: ShoppingBag },
  { id: "free-cover" as Section, label: "Free Cover Status", icon: Gift },
  { id: "notifications" as Section, label: "Notifications", icon: Bell },
  { id: "billing" as Section, label: "Billing", icon: CreditCard },
]

const mockOrders = [
  {
    id: "ORD-001",
    title: "Luna's Magical Adventure",
    date: "2026-01-05",
    type: "E-book",
    status: "completed",
  },
  {
    id: "ORD-002",
    title: "Space Explorer Tommy",
    date: "2025-12-20",
    type: "Print",
    status: "shipped",
  },
]

const mockPaymentMethods = [{ id: "1", last4: "1234", expiry: "12/25", brand: "Visa" }]

const mockBillingHistory = [
  {
    id: "1",
    date: "2026-01-05",
    description: "Luna's Magical Adventure - E-book",
    amount: "$19.99",
    status: "paid",
  },
  {
    id: "2",
    date: "2025-12-20",
    description: "Space Explorer Tommy - Print Book",
    amount: "$34.99",
    status: "paid",
  },
]

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<Section>("profile")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [name, setName] = useState("John Doe")
  const [bio, setBio] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [orderUpdates, setOrderUpdates] = useState(true)
  const [newFeatures, setNewFeatures] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const { toast } = useToast()

  const handleSaveProfile = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast({
      title: "Success",
      description: "Profile updated successfully",
    })
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast({
      title: "Success",
      description: "Notification preferences saved",
    })
  }

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="size-[120px] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-semibold">
                      {name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <button className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="size-6 text-white" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{name}</h3>
                    <p className="text-muted-foreground text-sm">john@example.com</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex gap-2 items-center">
                      <Input id="email" value="john@example.com" disabled className="flex-1" />
                      <Badge variant="secondary" className="shrink-0">
                        <Check className="size-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio (Optional)</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => {
                        if (e.target.value.length <= 200) {
                          setBio(e.target.value)
                        }
                      }}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground text-right">{bio.length}/200 characters</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button variant="ghost" onClick={() => setBio("")}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      case "account":
        return (
          <motion.div
            key="account"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account security and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-email">Email Address</Label>
                    <div className="flex gap-2 items-center">
                      <Input id="account-email" value="john@example.com" disabled className="flex-1" />
                      <Badge variant="secondary" className="shrink-0">
                        <Check className="size-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="flex gap-2 items-center">
                      <Input id="password" type="password" value="••••••••" disabled className="flex-1" />
                      <Button variant="outline" className="shrink-0 bg-transparent">
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-4">Connected Accounts</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold">
                          G
                        </div>
                        <div>
                          <p className="font-medium">Google</p>
                          <p className="text-sm text-muted-foreground">Connected</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          f
                        </div>
                        <div>
                          <p className="font-medium">Facebook</p>
                          <p className="text-sm text-muted-foreground">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Permanently delete your account and all data</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)} className="w-full sm:w-auto">
                  <Trash2 className="size-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )

      case "orders":
        return (
          <motion.div
            key="orders"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View and manage your book orders</CardDescription>
              </CardHeader>
              <CardContent>
                {mockOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="size-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No orders yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Book Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">{order.id}</TableCell>
                          <TableCell className="font-medium">{order.title}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.type}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "default"
                                  : order.status === "shipped"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {order.type === "E-book" ? (
                                <Button variant="outline" size="sm">
                                  <Download className="size-4 mr-1" />
                                  Download
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm">
                                  <Eye className="size-4 mr-1" />
                                  View
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )

      case "free-cover":
        return (
          <motion.div
            key="free-cover"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Free Cover Status</CardTitle>
                <CardDescription>Track your free book cover benefit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center size-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
                    <Gift className="size-12 text-white" />
                  </div>
                  <Badge variant="secondary" className="mb-4">
                    Used
                  </Badge>
                  <h3 className="text-xl font-semibold mb-2">You've used your free cover</h3>
                  <p className="text-muted-foreground mb-4">Used on: Jan 5, 2026</p>
                </div>

                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base">How Free Cover Works</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• Every user receives one free custom book cover</p>
                    <p>• Use it for any book project you create</p>
                    <p>• Additional covers can be purchased at $9.99 each</p>
                    <p>• Your free cover never expires until used</p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </motion.div>
        )

      case "notifications":
        return (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex-1">
                      <Label htmlFor="email-notifications" className="text-base">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex-1">
                      <Label htmlFor="order-updates" className="text-base">
                        Order Updates
                      </Label>
                      <p className="text-sm text-muted-foreground">Get notified about your order status and shipping</p>
                    </div>
                    <Switch id="order-updates" checked={orderUpdates} onCheckedChange={setOrderUpdates} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex-1">
                      <Label htmlFor="new-features" className="text-base">
                        New Features
                      </Label>
                      <p className="text-sm text-muted-foreground">Learn about new features and product updates</p>
                    </div>
                    <Switch id="new-features" checked={newFeatures} onCheckedChange={setNewFeatures} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex-1">
                      <Label htmlFor="marketing-emails" className="text-base">
                        Marketing Emails
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive promotional offers and special deals</p>
                    </div>
                    <Switch id="marketing-emails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button
                    onClick={handleSaveNotifications}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                  >
                    {isSaving ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      case "billing":
        return (
          <motion.div
            key="billing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockPaymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <CreditCard className="size-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {method.brand} ending in {method.last4}
                        </p>
                        <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent">
                  <Plus className="size-4 mr-2" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View your past transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBillingHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="font-medium">{item.amount}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Download className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )
    }
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <Button variant="outline" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-full">
              {mobileMenuOpen ? <X className="size-4 mr-2" /> : <Menu className="size-4 mr-2" />}
              {mobileMenuOpen ? "Close Menu" : "Open Menu"}
            </Button>
          </div>

          {/* Sidebar */}
          <aside
            className={`
              ${mobileMenuOpen ? "block" : "hidden"} lg:block
              lg:w-64 shrink-0
            `}
          >
            <Card>
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id)
                          setMobileMenuOpen(false)
                        }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                          ${
                            activeSection === item.id
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                              : "hover:bg-muted"
                          }
                        `}
                      >
                        <Icon className="size-5 shrink-0" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data from our
              servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteDialogOpen(false)
                toast({
                  title: "Account Deleted",
                  description: "Your account has been permanently deleted",
                  variant: "destructive",
                })
              }}
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </ToastProvider>
  )
}

