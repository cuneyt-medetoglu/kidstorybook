/**
 * Examples Sayfası - Type Definitions
 * Mock data yapısı ve type'lar
 */

export type AgeGroup = '0-2' | '3-5' | '6-9' | '10+'

export interface UsedPhoto {
  id: string
  originalPhoto: string
  characterName: string
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
  usedPhotos: UsedPhoto[]
  storyDetails: StoryDetails
}

/**
 * Mock Data - Örnek kitaplar
 * Gelecekte API'den gelecek
 */
export const mockExampleBooks: ExampleBook[] = [
  {
    id: '1',
    title: 'Luna\'s Magical Forest',
    description: 'Little Luna meets talking animals in a hidden forest and embarks on an unforgettable adventure.',
    coverImage: '/children-s-book-cover-with-enchanted-forest-theme.jpg',
    ageGroup: '3-5',
    theme: 'Adventure',
    usedPhotos: [
      {
        id: '1-1',
        originalPhoto: '/girl-with-brown-hair.jpg',
        characterName: 'Luna',
        transformedImage: '/little-girl-with-backpack-exploring-enchanted-fore.jpg'
      },
      {
        id: '1-2',
        originalPhoto: '/girl-with-blonde-hair.jpg',
        characterName: 'Friend Maya',
        transformedImage: '/little-girl-reading-glowing-book-surrounded-by-for.jpg'
      }
    ],
    storyDetails: {
      style: 'Fantasy',
      font: 'Playful',
      characterCount: 2
    }
  },
  {
    id: '2',
    title: 'Journey to the Stars',
    description: 'Brave astronaut Alex explores new planets in the depths of space.',
    coverImage: '/children-s-book-cover-with-space-theme.jpg',
    ageGroup: '6-9',
    theme: 'Science Fiction',
    usedPhotos: [
      {
        id: '2-1',
        originalPhoto: '/boy-with-dark-hair.jpg',
        characterName: 'Alex',
        transformedImage: '/wise-owl-with-glasses-reading-book-to-forest-anima.jpg'
      }
    ],
    storyDetails: {
      style: 'Scientific',
      font: 'Modern',
      characterCount: 1
    }
  },
  {
    id: '3',
    title: 'The Underwater Secret',
    description: 'Mermaid Emma searches for lost treasure in the ocean depths.',
    coverImage: '/children-s-book-cover-with-magical-adventure-theme.jpg',
    ageGroup: '3-5',
    theme: 'Fantasy',
    usedPhotos: [
      {
        id: '3-1',
        originalPhoto: '/girl-with-blonde-hair.jpg',
        characterName: 'Emma',
        transformedImage: '/colorful-butterflies-leading-path-through-magical-.jpg'
      },
      {
        id: '3-2',
        originalPhoto: '/girl-with-brown-hair.jpg',
        characterName: 'Helper Coral'
      },
      {
        id: '3-3',
        originalPhoto: '/boy-with-dark-hair.jpg',
        characterName: 'Captain Dolphin'
      }
    ],
    storyDetails: {
      style: 'Fairy Tale',
      font: 'Whimsical',
      characterCount: 3
    }
  },
  {
    id: '4',
    title: 'Baby Bear and Friends',
    description: 'Adorable baby bear has fun with friends in the forest throughout the seasons.',
    coverImage: '/magical-forest-entrance-with-glowing-pathway-child.jpg',
    ageGroup: '0-2',
    theme: 'Friendship',
    usedPhotos: [
      {
        id: '4-1',
        originalPhoto: '/girl-with-brown-hair.jpg',
        characterName: 'Baby',
        transformedImage: '/cozy-room-inside-tree-with-tiny-furniture-and-book.jpg'
      }
    ],
    storyDetails: {
      style: 'Cute',
      font: 'Rounded',
      characterCount: 1
    }
  },
  {
    id: '5',
    title: 'Digital Heroes',
    description: 'Tech-savvy kids battle evil software in the virtual world.',
    coverImage: '/children-s-book-cover-with-space-theme.jpg',
    ageGroup: '10+',
    theme: 'Technology',
    usedPhotos: [
      {
        id: '5-1',
        originalPhoto: '/boy-with-dark-hair.jpg',
        characterName: 'Alex',
        transformedImage: '/ancient-tree-with-door-carved-into-trunk-magical-f.jpg'
      },
      {
        id: '5-2',
        originalPhoto: '/girl-with-blonde-hair.jpg',
        characterName: 'Zoe'
      }
    ],
    storyDetails: {
      style: 'Modern',
      font: 'Tech',
      characterCount: 2
    }
  },
  {
    id: '6',
    title: 'The Princess and the Dragon',
    description: 'Brave princess befriends the dragon instead of defeating it.',
    coverImage: '/children-s-book-cover-with-enchanted-forest-theme.jpg',
    ageGroup: '6-9',
    theme: 'Fantasy',
    usedPhotos: [
      {
        id: '6-1',
        originalPhoto: '/girl-with-brown-hair.jpg',
        characterName: 'Princess Aria',
        transformedImage: '/talking-rabbit-with-colorful-vest-in-forest-cleari.jpg'
      }
    ],
    storyDetails: {
      style: 'Classic',
      font: 'Elegant',
      characterCount: 1
    }
  },
  // Duplicate books for pagination testing (will be replaced with real examples later)
  {
    id: '7',
    title: 'Luna\'s Magical Forest',
    description: 'Little Luna meets talking animals in a hidden forest and embarks on an unforgettable adventure.',
    coverImage: '/children-s-book-cover-with-enchanted-forest-theme.jpg',
    ageGroup: '3-5',
    theme: 'Adventure',
    usedPhotos: [
      {
        id: '7-1',
        originalPhoto: '/girl-with-brown-hair.jpg',
        characterName: 'Luna',
        transformedImage: '/little-girl-with-backpack-exploring-enchanted-fore.jpg'
      }
    ],
    storyDetails: {
      style: 'Fantasy',
      font: 'Playful',
      characterCount: 1
    }
  },
  {
    id: '8',
    title: 'Journey to the Stars',
    description: 'Brave astronaut Alex explores new planets in the depths of space.',
    coverImage: '/children-s-book-cover-with-space-theme.jpg',
    ageGroup: '6-9',
    theme: 'Science Fiction',
    usedPhotos: [
      {
        id: '8-1',
        originalPhoto: '/boy-with-dark-hair.jpg',
        characterName: 'Alex',
        transformedImage: '/wise-owl-with-glasses-reading-book-to-forest-anima.jpg'
      }
    ],
    storyDetails: {
      style: 'Scientific',
      font: 'Modern',
      characterCount: 1
    }
  },
  {
    id: '9',
    title: 'The Underwater Secret',
    description: 'Mermaid Emma searches for lost treasure in the ocean depths.',
    coverImage: '/children-s-book-cover-with-magical-adventure-theme.jpg',
    ageGroup: '3-5',
    theme: 'Fantasy',
    usedPhotos: [
      {
        id: '9-1',
        originalPhoto: '/girl-with-blonde-hair.jpg',
        characterName: 'Emma',
        transformedImage: '/colorful-butterflies-leading-path-through-magical-.jpg'
      }
    ],
    storyDetails: {
      style: 'Fairy Tale',
      font: 'Whimsical',
      characterCount: 1
    }
  },
  {
    id: '10',
    title: 'Baby Bear and Friends',
    description: 'Adorable baby bear has fun with friends in the forest throughout the seasons.',
    coverImage: '/magical-forest-entrance-with-glowing-pathway-child.jpg',
    ageGroup: '0-2',
    theme: 'Friendship',
    usedPhotos: [
      {
        id: '10-1',
        originalPhoto: '/girl-with-brown-hair.jpg',
        characterName: 'Baby',
        transformedImage: '/cozy-room-inside-tree-with-tiny-furniture-and-book.jpg'
      }
    ],
    storyDetails: {
      style: 'Cute',
      font: 'Rounded',
      characterCount: 1
    }
  },
  {
    id: '11',
    title: 'Digital Heroes',
    description: 'Tech-savvy kids battle evil software in the virtual world.',
    coverImage: '/children-s-book-cover-with-space-theme.jpg',
    ageGroup: '10+',
    theme: 'Technology',
    usedPhotos: [
      {
        id: '11-1',
        originalPhoto: '/boy-with-dark-hair.jpg',
        characterName: 'Alex',
        transformedImage: '/ancient-tree-with-door-carved-into-trunk-magical-f.jpg'
      }
    ],
    storyDetails: {
      style: 'Modern',
      font: 'Tech',
      characterCount: 1
    }
  },
  {
    id: '12',
    title: 'The Princess and the Dragon',
    description: 'Brave princess befriends the dragon instead of defeating it.',
    coverImage: '/children-s-book-cover-with-enchanted-forest-theme.jpg',
    ageGroup: '6-9',
    theme: 'Fantasy',
    usedPhotos: [
      {
        id: '12-1',
        originalPhoto: '/girl-with-brown-hair.jpg',
        characterName: 'Princess Aria',
        transformedImage: '/talking-rabbit-with-colorful-vest-in-forest-cleari.jpg'
      }
    ],
    storyDetails: {
      style: 'Classic',
      font: 'Elegant',
      characterCount: 1
    }
  },
  {
    id: '13',
    title: 'Luna\'s Magical Forest',
    description: 'Little Luna meets talking animals in a hidden forest and embarks on an unforgettable adventure.',
    coverImage: '/children-s-book-cover-with-enchanted-forest-theme.jpg',
    ageGroup: '3-5',
    theme: 'Adventure',
    usedPhotos: [
      {
        id: '13-1',
        originalPhoto: '/girl-with-brown-hair.jpg',
        characterName: 'Luna',
        transformedImage: '/little-girl-with-backpack-exploring-enchanted-fore.jpg'
      }
    ],
    storyDetails: {
      style: 'Fantasy',
      font: 'Playful',
      characterCount: 1
    }
  },
  {
    id: '14',
    title: 'Journey to the Stars',
    description: 'Brave astronaut Alex explores new planets in the depths of space.',
    coverImage: '/children-s-book-cover-with-space-theme.jpg',
    ageGroup: '6-9',
    theme: 'Science Fiction',
    usedPhotos: [
      {
        id: '14-1',
        originalPhoto: '/boy-with-dark-hair.jpg',
        characterName: 'Alex',
        transformedImage: '/wise-owl-with-glasses-reading-book-to-forest-anima.jpg'
      }
    ],
    storyDetails: {
      style: 'Scientific',
      font: 'Modern',
      characterCount: 1
    }
  },
  {
    id: '15',
    title: 'The Underwater Secret',
    description: 'Mermaid Emma searches for lost treasure in the ocean depths.',
    coverImage: '/children-s-book-cover-with-magical-adventure-theme.jpg',
    ageGroup: '3-5',
    theme: 'Fantasy',
    usedPhotos: [
      {
        id: '15-1',
        originalPhoto: '/girl-with-blonde-hair.jpg',
        characterName: 'Emma',
        transformedImage: '/colorful-butterflies-leading-path-through-magical-.jpg'
      }
    ],
    storyDetails: {
      style: 'Fairy Tale',
      font: 'Whimsical',
      characterCount: 1
    }
  },
  {
    id: '16',
    title: 'Baby Bear and Friends',
    description: 'Adorable baby bear has fun with friends in the forest throughout the seasons.',
    coverImage: '/magical-forest-entrance-with-glowing-pathway-child.jpg',
    ageGroup: '0-2',
    theme: 'Friendship',
    usedPhotos: [
      {
        id: '16-1',
        originalPhoto: '/girl-with-brown-hair.jpg',
        characterName: 'Baby',
        transformedImage: '/cozy-room-inside-tree-with-tiny-furniture-and-book.jpg'
      }
    ],
    storyDetails: {
      style: 'Cute',
      font: 'Rounded',
      characterCount: 1
    }
  },
  {
    id: '17',
    title: 'Digital Heroes',
    description: 'Tech-savvy kids battle evil software in the virtual world.',
    coverImage: '/children-s-book-cover-with-space-theme.jpg',
    ageGroup: '10+',
    theme: 'Technology',
    usedPhotos: [
      {
        id: '17-1',
        originalPhoto: '/boy-with-dark-hair.jpg',
        characterName: 'Alex',
        transformedImage: '/ancient-tree-with-door-carved-into-trunk-magical-f.jpg'
      }
    ],
    storyDetails: {
      style: 'Modern',
      font: 'Tech',
      characterCount: 1
    }
  },
  {
    id: '18',
    title: 'The Princess and the Dragon',
    description: 'Brave princess befriends the dragon instead of defeating it.',
    coverImage: '/children-s-book-cover-with-enchanted-forest-theme.jpg',
    ageGroup: '6-9',
    theme: 'Fantasy',
    usedPhotos: [
      {
        id: '18-1',
        originalPhoto: '/girl-with-brown-hair.jpg',
        characterName: 'Princess Aria',
        transformedImage: '/talking-rabbit-with-colorful-vest-in-forest-cleari.jpg'
      }
    ],
    storyDetails: {
      style: 'Classic',
      font: 'Elegant',
      characterCount: 1
    }
  },
  {
    id: '19',
    title: 'Luna\'s Magical Forest',
    description: 'Little Luna meets talking animals in a hidden forest and embarks on an unforgettable adventure.',
    coverImage: '/children-s-book-cover-with-enchanted-forest-theme.jpg',
    ageGroup: '3-5',
    theme: 'Adventure',
    usedPhotos: [
      {
        id: '19-1',
        originalPhoto: '/girl-with-brown-hair.jpg',
        characterName: 'Luna',
        transformedImage: '/little-girl-with-backpack-exploring-enchanted-fore.jpg'
      }
    ],
    storyDetails: {
      style: 'Fantasy',
      font: 'Playful',
      characterCount: 1
    }
  },
  {
    id: '20',
    title: 'Journey to the Stars',
    description: 'Brave astronaut Alex explores new planets in the depths of space.',
    coverImage: '/children-s-book-cover-with-space-theme.jpg',
    ageGroup: '6-9',
    theme: 'Science Fiction',
    usedPhotos: [
      {
        id: '20-1',
        originalPhoto: '/boy-with-dark-hair.jpg',
        characterName: 'Alex',
        transformedImage: '/wise-owl-with-glasses-reading-book-to-forest-anima.jpg'
      }
    ],
    storyDetails: {
      style: 'Scientific',
      font: 'Modern',
      characterCount: 1
    }
  },
  {
    id: '21',
    title: 'The Underwater Secret',
    description: 'Mermaid Emma searches for lost treasure in the ocean depths.',
    coverImage: '/children-s-book-cover-with-magical-adventure-theme.jpg',
    ageGroup: '3-5',
    theme: 'Fantasy',
    usedPhotos: [
      {
        id: '21-1',
        originalPhoto: '/girl-with-blonde-hair.jpg',
        characterName: 'Emma',
        transformedImage: '/colorful-butterflies-leading-path-through-magical-.jpg'
      }
    ],
    storyDetails: {
      style: 'Fairy Tale',
      font: 'Whimsical',
      characterCount: 1
    }
  },
  {
    id: '22',
    title: 'Baby Bear and Friends',
    description: 'Adorable baby bear has fun with friends in the forest throughout the seasons.',
    coverImage: '/magical-forest-entrance-with-glowing-pathway-child.jpg',
    ageGroup: '0-2',
    theme: 'Friendship',
    usedPhotos: [
      {
        id: '22-1',
        originalPhoto: '/girl-with-brown-hair.jpg',
        characterName: 'Baby',
        transformedImage: '/cozy-room-inside-tree-with-tiny-furniture-and-book.jpg'
      }
    ],
    storyDetails: {
      style: 'Cute',
      font: 'Rounded',
      characterCount: 1
    }
  },
  {
    id: '23',
    title: 'Digital Heroes',
    description: 'Tech-savvy kids battle evil software in the virtual world.',
    coverImage: '/children-s-book-cover-with-space-theme.jpg',
    ageGroup: '10+',
    theme: 'Technology',
    usedPhotos: [
      {
        id: '23-1',
        originalPhoto: '/boy-with-dark-hair.jpg',
        characterName: 'Alex',
        transformedImage: '/ancient-tree-with-door-carved-into-trunk-magical-f.jpg'
      }
    ],
    storyDetails: {
      style: 'Modern',
      font: 'Tech',
      characterCount: 1
    }
  },
  {
    id: '24',
    title: 'The Princess and the Dragon',
    description: 'Brave princess befriends the dragon instead of defeating it.',
    coverImage: '/children-s-book-cover-with-enchanted-forest-theme.jpg',
    ageGroup: '6-9',
    theme: 'Fantasy',
    usedPhotos: [
      {
        id: '24-1',
        originalPhoto: '/girl-with-brown-hair.jpg',
        characterName: 'Princess Aria',
        transformedImage: '/talking-rabbit-with-colorful-vest-in-forest-cleari.jpg'
      }
    ],
    storyDetails: {
      style: 'Classic',
      font: 'Elegant',
      characterCount: 1
    }
  }
]
