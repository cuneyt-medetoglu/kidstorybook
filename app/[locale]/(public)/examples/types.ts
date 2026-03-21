/**
 * Examples Sayfası - Type Definitions
 */

export type AgeGroup = '0-2' | '3-5' | '6-9' | '10+'

export interface UsedPhoto {
  id: string
  originalPhoto: string
  characterName: string
  characterNameKey?: string // i18n: examples.characterNames.{key}
  transformedImage?: string // Kitaptaki görsel (opsiyonel)
}

export interface StoryDetails {
  style: string
  font: string
  characterCount: number
}

export interface ExampleBook {
  id: string
  title: string
  description: string
  coverImage: string
  ageGroup: AgeGroup
  theme: string
  localeKey?: string // i18n: examples.books.{localeKey}.{title|description|theme}
  usedPhotos: UsedPhoto[]
  storyDetails: StoryDetails
}
