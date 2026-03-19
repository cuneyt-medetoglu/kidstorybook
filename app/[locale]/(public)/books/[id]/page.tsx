import { redirect } from 'next/navigation'

/**
 * Eski veya kısa link: /[locale]/books/:id → viewer'a yönlendir (Faz 1 — §9).
 */
export default function BookIdPage({
  params,
}: {
  params: { locale: string; id: string }
}) {
  redirect(`/${params.locale}/books/${params.id}/view`)
}
