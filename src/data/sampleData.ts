import { Author, Story } from '../types';

export const sampleAuthors: Author[] = [
  {
    id: 'author-1',
    name: 'MiddleEarth_Dreamer',
    socials: [
      {
        id: 'social-1',
        authorId: 'author-1',
        platform: 'ao3',
        handle: 'MiddleEarth_Dreamer',
        link: 'https://archiveofourown.org/users/MiddleEarth_Dreamer'
      },
      {
        id: 'social-2',
        authorId: 'author-1',
        platform: 'twitter',
        handle: 'MEDreamer',
        link: 'https://twitter.com/MEDreamer'
      }
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'user-1'
  },
  {
    id: 'author-2',
    name: 'StarshipCaptain',
    socials: [
      {
        id: 'social-3',
        authorId: 'author-2',
        platform: 'ao3',
        handle: 'StarshipCaptain',
        link: 'https://archiveofourown.org/users/StarshipCaptain'
      },
      {
        id: 'social-4',
        authorId: 'author-2',
        platform: 'tumblr',
        handle: 'starship-captain',
        link: 'https://starship-captain.tumblr.com'
      }
    ],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    createdBy: 'user-1'
  },
  {
    id: 'author-3',
    name: 'WizardingWorld_Fan',
    socials: [
      {
        id: 'social-5',
        authorId: 'author-3',
        platform: 'wattpad',
        handle: 'WizardingWorldFan',
        link: 'https://www.wattpad.com/user/WizardingWorldFan'
      },
      {
        id: 'social-6',
        authorId: 'author-3',
        platform: 'tiktok',
        handle: 'wwfan23',
        link: 'https://tiktok.com/@wwfan23'
      }
    ],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'user-1'
  },
  {
    id: 'author-4',
    name: 'MarvelousWriter',
    socials: [
      {
        id: 'social-7',
        authorId: 'author-4',
        platform: 'ao3',
        handle: 'MarvelousWriter',
        link: 'https://archiveofourown.org/users/MarvelousWriter'
      }
    ],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    createdBy: 'user-1'
  },
  {
    id: 'author-5',
    name: 'FantasyQueen',
    socials: [
      {
        id: 'social-8',
        authorId: 'author-5',
        platform: 'twitter',
        handle: 'FantasyQueen',
        link: 'https://twitter.com/FantasyQueen'
      },
      {
        id: 'social-9',
        authorId: 'author-5',
        platform: 'instagram',
        handle: 'fantasy.queen',
        link: 'https://instagram.com/fantasy.queen'
      }
    ],
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30'),
    createdBy: 'user-1'
  }
];

export const sampleStories: Story[] = [
  {
    id: 'story-1',
    title: 'The Prince\'s Shadow',
    authorId: 'author-1',
    author: sampleAuthors[0],
    source: 'ao3',
    ships: ['Drarry', 'Hermione/Ron'],
    type: ['Angst', 'Romance', 'Hurt/Comfort'],
    category: 'full-length',
    chaptersCount: 24,
    status: 'completed',
    summary: 'In their eighth year at Hogwarts, Harry discovers that Draco has been hiding more than just his family\'s dark secrets. A story of redemption, love, and finding light in the darkest places.',
    link: 'https://archiveofourown.org/works/example1',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    createdBy: 'user-1'
  },
  {
    id: 'story-2',
    title: 'Coffee Shop Chronicles',
    authorId: 'author-1',
    author: sampleAuthors[0],
    source: 'ao3',
    ships: ['Drarry'],
    type: ['Fluff', 'Coffee Shop AU', 'Muggle AU'],
    category: 'one-shot',
    chaptersCount: 3,
    status: 'completed',
    summary: 'Harry works at a small coffee shop in London when a familiar platinum blonde walks in. Modern AU where magic doesn\'t exist, but the chemistry definitely does.',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    createdBy: 'user-1'
  },
  {
    id: 'story-3',
    title: 'Starfleet Academy Roommates',
    authorId: 'author-2',
    author: sampleAuthors[1],
    source: 'ao3',
    ships: ['Spirk', 'McCoy/Chapel'],
    type: ['Fluff', 'Academy Era', 'Friends to Lovers'],
    category: 'full-length',
    chaptersCount: 18,
    status: 'ongoing',
    summary: 'Jim Kirk and Spock are assigned as roommates at Starfleet Academy. What starts as a clash of personalities slowly develops into something deeper as they navigate their studies and growing feelings.',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-08-15'),
    createdBy: 'user-1'
  },
  {
    id: 'story-4',
    title: 'The Winter Soldier\'s Heart',
    authorId: 'author-4',
    author: sampleAuthors[3],
    source: 'ao3',
    ships: ['Stucky'],
    type: ['Angst', 'Hurt/Comfort', 'Recovery'],
    category: 'full-length',
    chaptersCount: 31,
    status: 'completed',
    summary: 'After the events of Civil War, Steve and Bucky find refuge in Wakanda. As Bucky recovers from his programming, they must also navigate the complicated feelings that have always existed between them.',
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12'),
    createdBy: 'user-1'
  },
  {
    id: 'story-5',
    title: 'Marauders\' Map to Love',
    authorId: 'author-3',
    author: sampleAuthors[2],
    source: 'wattpad',
    ships: ['Jegulus', 'Wolfstar'],
    type: ['Fluff', 'Marauders Era', 'Secret Relationship'],
    category: 'full-length',
    chaptersCount: 22,
    status: 'on-hold',
    summary: 'James Potter never expected to fall for his best friend\'s younger brother. Set during the Marauders\' seventh year, this is a story of forbidden love, family loyalty, and choosing your own path.',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-06-10'),
    createdBy: 'user-1'
  },
  {
    id: 'story-6',
    title: 'Dragon\'s Heart',
    authorId: 'author-5',
    author: sampleAuthors[4],
    source: 'twitter',
    ships: ['Original Characters'],
    type: ['Fantasy', 'Adventure', 'Found Family'],
    category: 'short',
    chaptersCount: 8,
    status: 'completed',
    summary: 'A young dragon rider discovers she\'s the last of her kind and must unite the scattered clans to face an ancient evil. A Twitter thread that became an epic fantasy tale.',
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-08'),
    createdBy: 'user-1'
  },
  {
    id: 'story-7',
    title: 'Midnight Potions',
    authorId: 'author-1',
    author: sampleAuthors[0],
    source: 'ao3',
    ships: ['Drarry'],
    type: ['Smut', 'PWP', 'Post-War'],
    category: 'one-shot',
    chaptersCount: 1,
    status: 'completed',
    summary: 'Harry stumbles upon Draco brewing illegal potions in the Room of Requirement. What starts as confrontation quickly turns into something much more heated.',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    createdBy: 'user-1'
  },
  {
    id: 'story-8',
    title: 'Beyond the Stars',
    authorId: 'author-2',
    author: sampleAuthors[1],
    source: 'tumblr',
    ships: ['Spirk'],
    type: ['Sci-Fi', 'Hurt/Comfort', 'Telepathic Bond'],
    category: 'short',
    chaptersCount: 5,
    status: 'discontinued',
    summary: 'When Spock is injured during an away mission, an accidental mind meld reveals feelings both he and Kirk have been hiding. A story that was unfortunately never finished.',
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-03-01'),
    createdBy: 'user-1'
  },
  {
    id: 'story-9',
    title: 'College Rivals',
    authorId: 'author-4',
    author: sampleAuthors[3],
    source: 'ao3',
    ships: ['Stucky'],
    type: ['College AU', 'Enemies to Lovers', 'Sports'],
    category: 'full-length',
    chaptersCount: 15,
    status: 'long-time-no-update',
    summary: 'Steve Rogers and Bucky Barnes are captains of rival college hockey teams. Their rivalry on the ice is legendary, but what happens when they\'re forced to work together off the ice?',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-04-20'),
    createdBy: 'user-1'
  },
  {
    id: 'story-10',
    title: 'The Prophecy\'s Child',
    authorId: 'author-5',
    author: sampleAuthors[4],
    source: 'ao3',
    ships: ['Harry/Original Character'],
    type: ['Adventure', 'Magic', 'Prophecy'],
    category: 'full-length',
    chaptersCount: 42,
    status: 'ongoing',
    summary: 'An alternative take on Harry\'s journey where he discovers a different prophecy that changes everything he thought he knew about his destiny. Currently updating weekly.',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-08-30'),
    createdBy: 'user-1'
  }
];