/**
 * Examples Sayfası - Type Definitions
 * Mock data yapısı ve type'lar
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
  style: string // Illustration style (watercolor, 3D, cartoon, vb.)
  font: string // Font adı
  characterCount: number // Kaç karakter var
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

/**
 * Mock Data - Örnek kitaplar
 * Gelecekte API'den gelecek
 */
/**
 * Locale key → book and character name translation keys
 * Pattern: examples.books.{localeKey}.{title|description|theme}
 *          examples.characterNames.{characterNameKey}
 */
const BOOK_BASE_DATA: Pick<ExampleBook, 'localeKey' | 'coverImage' | 'ageGroup' | 'storyDetails'>[] = [
  { localeKey: 'lunas-forest', coverImage: '/test-images/books/children-s-book-cover-with-enchanted-forest-theme.jpg', ageGroup: '3-5', storyDetails: { style: 'Fantasy', font: 'Playful', characterCount: 2 } },
  { localeKey: 'journey-stars', coverImage: '/test-images/books/children-s-book-cover-with-space-theme.jpg', ageGroup: '6-9', storyDetails: { style: 'Scientific', font: 'Modern', characterCount: 1 } },
  { localeKey: 'underwater-secret', coverImage: '/test-images/books/children-s-book-cover-with-magical-adventure-theme.jpg', ageGroup: '3-5', storyDetails: { style: 'Fairy Tale', font: 'Whimsical', characterCount: 3 } },
  { localeKey: 'baby-bear', coverImage: '/magical-forest-entrance-with-glowing-pathway-child.jpg', ageGroup: '0-2', storyDetails: { style: 'Cute', font: 'Rounded', characterCount: 1 } },
  { localeKey: 'digital-heroes', coverImage: '/test-images/books/children-s-book-cover-with-space-theme.jpg', ageGroup: '10+', storyDetails: { style: 'Modern', font: 'Tech', characterCount: 2 } },
  { localeKey: 'princess-dragon', coverImage: '/test-images/books/children-s-book-cover-with-enchanted-forest-theme.jpg', ageGroup: '6-9', storyDetails: { style: 'Classic', font: 'Elegant', characterCount: 1 } },
]

const BOOK_PHOTOS: Record<string, UsedPhoto[]> = {
  'lunas-forest': [
    { id: 'p-luna', originalPhoto: '/test-images/characters/girl-with-brown-hair.jpg', characterName: 'Luna', characterNameKey: 'Luna', transformedImage: '/little-girl-with-backpack-exploring-enchanted-fore.jpg' },
    { id: 'p-maya', originalPhoto: '/test-images/characters/girl-with-blonde-hair.jpg', characterName: 'Friend Maya', characterNameKey: 'FriendMaya', transformedImage: '/little-girl-reading-glowing-book-surrounded-by-for.jpg' },
  ],
  'journey-stars': [
    { id: 'p-alex', originalPhoto: '/test-images/characters/boy-with-dark-hair.jpg', characterName: 'Alex', characterNameKey: 'Alex', transformedImage: '/wise-owl-with-glasses-reading-book-to-forest-anima.jpg' },
  ],
  'underwater-secret': [
    { id: 'p-emma', originalPhoto: '/test-images/characters/girl-with-blonde-hair.jpg', characterName: 'Emma', characterNameKey: 'Emma', transformedImage: '/colorful-butterflies-leading-path-through-magical-.jpg' },
    { id: 'p-coral', originalPhoto: '/test-images/characters/girl-with-brown-hair.jpg', characterName: 'Helper Coral', characterNameKey: 'HelperCoral' },
    { id: 'p-dolphin', originalPhoto: '/test-images/characters/boy-with-dark-hair.jpg', characterName: 'Captain Dolphin', characterNameKey: 'CaptainDolphin' },
  ],
  'baby-bear': [
    { id: 'p-baby', originalPhoto: '/test-images/characters/girl-with-brown-hair.jpg', characterName: 'Baby', characterNameKey: 'Baby', transformedImage: '/cozy-room-inside-tree-with-tiny-furniture-and-book.jpg' },
  ],
  'digital-heroes': [
    { id: 'p-alex2', originalPhoto: '/test-images/characters/boy-with-dark-hair.jpg', characterName: 'Alex', characterNameKey: 'Alex', transformedImage: '/ancient-tree-with-door-carved-into-trunk-magical-f.jpg' },
    { id: 'p-zoe', originalPhoto: '/test-images/characters/girl-with-blonde-hair.jpg', characterName: 'Zoe', characterNameKey: 'Zoe' },
  ],
  'princess-dragon': [
    { id: 'p-aria', originalPhoto: '/test-images/characters/girl-with-brown-hair.jpg', characterName: 'Princess Aria', characterNameKey: 'PrincessAria', transformedImage: '/talking-rabbit-with-colorful-vest-in-forest-cleari.jpg' },
  ],
}

// EN fallback titles/descriptions for SSR / non-client contexts
const BOOK_EN_DATA: Record<string, Pick<ExampleBook, 'title' | 'description' | 'theme'>> = {
  'lunas-forest': { title: "Luna's Magical Forest", description: 'Little Luna meets talking animals in a hidden forest and embarks on an unforgettable adventure.', theme: 'Adventure' },
  'journey-stars': { title: 'Journey to the Stars', description: 'Brave astronaut Alex explores new planets in the depths of space.', theme: 'Science Fiction' },
  'underwater-secret': { title: 'The Underwater Secret', description: 'Mermaid Emma searches for lost treasure in the ocean depths.', theme: 'Fantasy' },
  'baby-bear': { title: 'Baby Bear and Friends', description: 'Adorable baby bear has fun with friends in the forest throughout the seasons.', theme: 'Friendship' },
  'digital-heroes': { title: 'Digital Heroes', description: 'Tech-savvy kids battle evil software in the virtual world.', theme: 'Technology' },
  'princess-dragon': { title: 'The Princess and the Dragon', description: 'Brave princess befriends the dragon instead of defeating it.', theme: 'Fantasy' },
}

export const mockExampleBooks: ExampleBook[] = Array.from({ length: 24 }, (_, i) => {
  const baseIndex = i % 6
  const base = BOOK_BASE_DATA[baseIndex]
  const localeKey = base.localeKey as string
  const enData = BOOK_EN_DATA[localeKey]
  const photos = BOOK_PHOTOS[localeKey].map((p, pi) => ({ ...p, id: `${i + 1}-${pi + 1}` }))
  return {
    id: String(i + 1),
    ...enData,
    ...base,
    usedPhotos: photos,
  }
})
