"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/contexts/CartContext"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

// Base form validation schema
const createCheckoutSchema = (hasHardcopy: boolean) =>
  z.object({
    email: z.string().email("Please enter a valid email address"),
    name: z.string().optional(),
    // Address fields (required for hardcopy)
    address: hasHardcopy
      ? z.string().min(1, "Street address is required for hardcopy orders")
      : z.string().optional(),
    city: hasHardcopy
      ? z.string().min(1, "City is required for hardcopy orders")
      : z.string().optional(),
    state: hasHardcopy
      ? z.string().min(1, "State/Province is required for hardcopy orders")
      : z.string().optional(),
    zipCode: hasHardcopy
      ? z.string().min(1, "ZIP/Postal code is required for hardcopy orders")
      : z.string().optional(),
    phone: hasHardcopy
      ? z.string().min(1, "Phone number is required for hardcopy orders")
      : z.string().optional(),
  })

type CheckoutFormData = z.infer<ReturnType<typeof createCheckoutSchema>>

interface CheckoutFormProps {
  hasHardcopy: boolean
  hasEbook: boolean
}

export function CheckoutForm({ hasHardcopy, hasEbook }: CheckoutFormProps) {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const checkoutSchema = createCheckoutSchema(hasHardcopy)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    try {
      // TODO: Payment integration will be added later (Faz 4.1 and 4.2)
      // For now, mock the payment process
      console.log("[Checkout] Form submitted:", data)
      console.log("[Checkout] Cart items:", items)

      // Check if there's a draftId in cart items (for draft-to-purchase flow)
      const ebookPlanItem = items.find((item) => item.type === "ebook_plan" && item.draftId)
      const draftId = ebookPlanItem?.draftId

      // Mock order creation
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Clear cart
      clearCart()

      // If draftId exists, redirect to wizard to continue from draft
      if (draftId) {
        // Redirect to wizard step1 with draftId
        router.push(`/create/step1?draftId=${draftId}`)
      } else {
        // Otherwise, redirect to success page
        router.push(`/checkout/success?orderId=${orderId}`)
      }
    } catch (error) {
      console.error("[Checkout] Error:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          Customer Information
        </h3>

        {/* Email */}
        <div className="mb-4">
          <Label htmlFor="email" className="mb-2">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Name */}
        <div className="mb-4">
          <Label htmlFor="name" className="mb-2">
            Full Name (Optional)
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register("name")}
          />
        </div>
      </div>

      {/* Shipping Address (only for hardcopy) */}
      {hasHardcopy && (
        <div>
          <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
            Shipping Address
          </h3>

          <div className="mb-4">
            <Label htmlFor="address" className="mb-2">
              Street Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="123 Main St"
              {...register("address")}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="city" className="mb-2">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="Istanbul"
                {...register("city")}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="state" className="mb-2">
                State/Province <span className="text-red-500">*</span>
              </Label>
              <Input
                id="state"
                type="text"
                placeholder="Istanbul"
                {...register("state")}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="zipCode" className="mb-2">
              ZIP/Postal Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="zipCode"
              type="text"
              placeholder="34000"
              {...register("zipCode")}
              className={errors.zipCode ? "border-red-500" : ""}
            />
            {errors.zipCode && (
              <p className="mt-1 text-sm text-red-500">{errors.zipCode.message}</p>
            )}
          </div>

          <div className="mb-4">
            <Label htmlFor="phone" className="mb-2">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+90 555 123 4567"
              {...register("phone")}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Payment Method (placeholder for future integration) */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          Payment Method
        </h3>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Payment integration will be added in Faz 4.1 (Stripe) and Faz 4.2 (İyzico).
            For now, this is a mock checkout flow.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-6 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:from-purple-600 dark:to-pink-600"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          "Complete Purchase"
        )}
      </Button>
    </form>
  )
}
