# v0.app Prompt - Profile Settings Page

## Prompt (Kopyala ve v0.app'e yapıştır)

```
Create a modern profile settings page for a children's storybook platform.

Page title: "Profile Settings"

Layout: Sidebar navigation + Content area (two-column on desktop, stacked on mobile)

**Sidebar Navigation (Left):**
- Profile (user icon)
- Account Settings (settings icon)
- Order History (shopping bag icon)
- Free Cover Status (gift icon)
- Notifications (bell icon)
- Billing (credit card icon)

**Content Area Sections:**

**1. Profile Section (default active):**
- Profile photo uploader (circular, 120px, with camera icon overlay on hover)
- Name input field
- Email input field (disabled, read-only)
- Bio textarea (optional, max 200 chars, char counter)
- "Save Changes" button (gradient purple-to-pink)
- "Cancel" button (ghost)

**2. Account Settings:**
- Email (read-only, verified badge)
- Password: "••••••••" with "Change Password" button
- Delete Account button (red, requires confirmation modal)
- Connected Accounts: Google, Facebook icons with "Connected" or "Connect" status

**3. Order History:**
- Table/list of orders:
  - Order ID
  - Book title
  - Order date
  - Type (E-book / Print)
  - Status badge (Completed, Processing, Shipped)
  - Download/View button
- Empty state: "No orders yet"

**4. Free Cover Status:**
- Large icon/illustration
- Status badge: "Available" (green) or "Used" (gray)
- Description text: "You have 1 free book cover available!" or "You've used your free cover"
- Date info: "Used on: Jan 5, 2026" (if used)
- Info box: How free cover works

**5. Notifications:**
- Toggle switches for:
  - Email notifications (On/Off)
  - Order updates
  - New features
  - Marketing emails
- "Save Preferences" button

**6. Billing:**
- Payment methods list (card ending in 1234, Expiry: 12/25)
- "Add Payment Method" button
- Billing history table (Date, Description, Amount, Status, Invoice link)

**Design:**
- Clean, modern design with cards for each section
- Smooth transitions between sections
- Form validation states (error, success)
- Loading states for save actions
- Confirmation modals for destructive actions (delete account, remove payment method)
- Framer Motion animations:
  - Slide in/out for section changes
  - Fade for form validations
  - Scale for buttons
- Use shadcn/ui: Form, Input, Button, Switch, Card, Badge, Table, Dialog components
- Tailwind CSS styling
- English text only
- Responsive design (sidebar collapses on mobile, hamburger menu)

Mock Data:
- User: "John Doe", "john@example.com"
- Free cover: Used on Jan 5, 2026
- 2 orders, 1 payment method
```

## Kullanım Talimatları

1. v0.app'i aç
2. Prompt'u yapıştır
3. Generate
4. `app/dashboard/settings/page.tsx` oluştur
5. Entegre et

