// All dates relative to today: 2026-04-07
// published: true  → past events shown in Recent Events / Events grid
// published: false → upcoming events shown in UpcomingStrip

export const EVENTS = [
  // ── PAST / PUBLISHED ──────────────────────────────────────────────
  {
    id: 'evt-001',
    title: 'Saraswati Puja & Vidyarambha',
    titleKn: 'ಸರಸ್ವತಿ ಪೂಜೆ ಮತ್ತು ವಿದ್ಯಾರಂಭ',
    category: 'puja',
    date: '2025-10-02',
    location: 'Lagwankar Nilaya, Malleshwaram, Bengaluru',
    description:
      'Annual Saraswati Puja conducted at the family home with great devotion. Children performed Vidyarambha — their first formal writing initiation on palm leaves — overseen by Pandit Ramakrishna Bhat. The event was attended by more than thirty family members across three generations.',
    descriptionKn:
      'ಕುಟುಂಬದ ಮನೆಯಲ್ಲಿ ವಾರ್ಷಿಕ ಸರಸ್ವತಿ ಪೂಜೆ ನಡೆಯಿತು. ಮಕ್ಕಳು ತಾಳೆ ಎಲೆಯ ಮೇಲೆ ವಿದ್ಯಾರಂಭ ಮಾಡಿದರು. ಮೂರು ತಲೆಮಾರಿನ ಮೂವತ್ತಕ್ಕೂ ಹೆಚ್ಚು ಸದಸ್ಯರು ಭಾಗವಹಿಸಿದರು.',
    coverPhoto: 'https://picsum.photos/seed/saraswati-cover/800/450',
    photos: [
      { id: 'p1', url: 'https://picsum.photos/seed/saraswati1/800/600', alt: 'Saraswati idol decorated with marigolds' },
      { id: 'p2', url: 'https://picsum.photos/seed/saraswati2/800/600', alt: 'Children writing on slate during Vidyarambha' },
      { id: 'p3', url: 'https://picsum.photos/seed/saraswati3/800/600', alt: 'Family gathered around the puja mandap' },
    ],
    published: true,
    attendeeCount: 34,
    createdAt: '2025-10-03T08:00:00Z',
  },
  {
    id: 'evt-002',
    title: "Karthik's Upanayana (Thread Ceremony)",
    titleKn: 'ಕಾರ್ತಿಕ್ ಉಪನಯನ (ಮುಂಜಿ)',
    category: 'ceremony',
    date: '2025-12-14',
    location: 'Shankara Mutt, Shankarapuram, Bengaluru',
    description:
      "Thread ceremony (Upanayana) for Karthik, son of Prasanna and Vidya Lagwankar. The ceremony was performed by Pandit Subrahmanya Bhat over two auspicious days. Karthik received the sacred thread and began his Vedic studies. Over sixty family members and friends attended the celebration.",
    descriptionKn:
      'ಪ್ರಸನ್ನ ಮತ್ತು ವಿದ್ಯಾ ಲಗ್ವಾಂಕರ್ ಅವರ ಮಗ ಕಾರ್ತಿಕ್‌ನ ಉಪನಯನ ಶಂಕರ ಮಠದಲ್ಲಿ ನಡೆಯಿತು. ಪಂಡಿತ್ ಸುಬ್ರಹ್ಮಣ್ಯ ಭಟ್ ಅವರು ಎರಡು ದಿನ ಸಂಸ್ಕಾರ ನಡೆಸಿದರು.',
    coverPhoto: 'https://picsum.photos/seed/upanayana-cover/800/450',
    photos: [
      { id: 'p1', url: 'https://picsum.photos/seed/upanayana1/800/600', alt: 'Karthik in traditional attire during ceremony' },
      { id: 'p2', url: 'https://picsum.photos/seed/upanayana2/800/600', alt: 'Family elders blessing Karthik' },
      { id: 'p3', url: 'https://picsum.photos/seed/upanayana3/800/600', alt: 'Havan kund with sacred fire' },
      { id: 'p4', url: 'https://picsum.photos/seed/upanayana4/800/600', alt: 'Post-ceremony family photograph' },
    ],
    published: true,
    attendeeCount: 62,
    createdAt: '2025-12-15T10:00:00Z',
  },
  {
    id: 'evt-003',
    title: 'Family Reunion — Dasara Holidays',
    titleKn: 'ಕುಟುಂಬ ಮಿಲನ — ದಸರಾ ರಜೆ',
    category: 'reunion',
    date: '2025-10-12',
    location: 'Lagwankar ancestral home, Mysuru',
    description:
      'The annual Dasara family reunion at the ancestral home in Mysuru. Three generations gathered for traditional Brahmin lunch, cultural programs by the children, and an evening of carrom and family games in the courtyard. The occasion also marked the completion of restoration work on the 80-year-old heritage home.',
    descriptionKn:
      'ಮೈಸೂರಿನ ಪಿತೃಕ ಮನೆಯಲ್ಲಿ ವಾರ್ಷಿಕ ದಸರಾ ಕುಟುಂಬ ಮಿಲನ. ಮೂರು ತಲೆಮಾರಿನ ಸದಸ್ಯರು ಸಾಂಪ್ರದಾಯಿಕ ಊಟ, ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮ ಮತ್ತು ಆಟಗಳಲ್ಲಿ ಪಾಲ್ಗೊಂಡರು.',
    coverPhoto: 'https://picsum.photos/seed/dasara-cover/800/450',
    photos: [
      { id: 'p1', url: 'https://picsum.photos/seed/dasara1/800/600', alt: 'Three generations seated for traditional lunch' },
      { id: 'p2', url: 'https://picsum.photos/seed/dasara2/800/600', alt: 'Children performing a cultural skit' },
      { id: 'p3', url: 'https://picsum.photos/seed/dasara3/800/600', alt: 'Elders playing carrom in the courtyard' },
    ],
    published: true,
    attendeeCount: 47,
    createdAt: '2025-10-13T09:00:00Z',
  },
  {
    id: 'evt-004',
    title: 'Satyanarayan Puja — Griha Pravesh',
    titleKn: 'ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ — ಗೃಹಪ್ರವೇಶ',
    category: 'puja',
    date: '2026-01-18',
    location: "Ravi & Meena Lagwankar's new apartment, Whitefield, Bengaluru",
    description:
      "Griha Pravesh and Satyanarayan Puja at Ravi and Meena's newly purchased apartment in Whitefield. The puja was performed before the family moved in, as per the Lagwankar tradition. Priest chanted Satyanarayan Katha and family members prepared prasad together. A joyful housewarming followed with homemade Kannadiga food.",
    descriptionKn:
      'ರವಿ ಮತ್ತು ಮೀನಾ ಲಗ್ವಾಂಕರ್ ಅವರ ಹೊಸ ಅಪಾರ್ಟ್‌ಮೆಂಟ್‌ನಲ್ಲಿ ಗೃಹಪ್ರವೇಶ ಮತ್ತು ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ ನಡೆಯಿತು.',
    coverPhoto: 'https://picsum.photos/seed/satya-cover/800/450',
    photos: [
      { id: 'p1', url: 'https://picsum.photos/seed/satya1/800/600', alt: 'Decorated entrance of the new home' },
      { id: 'p2', url: 'https://picsum.photos/seed/satya2/800/600', alt: 'Priest conducting Satyanarayan puja' },
      { id: 'p3', url: 'https://picsum.photos/seed/satya3/800/600', alt: 'Family receiving prasad' },
      { id: 'p4', url: 'https://picsum.photos/seed/satya4/800/600', alt: 'Children at the decorated entrance' },
      { id: 'p5', url: 'https://picsum.photos/seed/satya5/800/600', alt: 'Group photo in front of new home' },
    ],
    published: true,
    attendeeCount: 28,
    createdAt: '2026-01-19T11:00:00Z',
  },
  {
    id: 'evt-005',
    title: 'Shivaratri Abhishek',
    titleKn: 'ಶಿವರಾತ್ರಿ ಅಭಿಷೇಕ',
    category: 'puja',
    date: '2026-02-26',
    location: 'Kashi Vishweshwara Temple, Jayanagar, Bengaluru',
    description:
      'Family Shivaratri night vigil and Abhishek at the local Kashi Vishweshwara temple. The family participated in all four prahars of the night. Special panchamrita abhishek was performed and prasad of thadambattu and fruits was distributed. This has been a Lagwankar family tradition for over three generations.',
    descriptionKn:
      'ಜಯನಗರದ ಕಾಶಿ ವಿಶ್ವೇಶ್ವರ ದೇವಾಲಯದಲ್ಲಿ ಶಿವರಾತ್ರಿ ಅಭಿಷೇಕ ಮತ್ತು ರಾತ್ರಿ ಜಾಗರಣೆ ನಡೆಯಿತು.',
    coverPhoto: 'https://picsum.photos/seed/shiva-cover/800/450',
    photos: [
      { id: 'p1', url: 'https://picsum.photos/seed/shiva1/800/600', alt: 'Shiva linga decorated with bilva leaves' },
      { id: 'p2', url: 'https://picsum.photos/seed/shiva2/800/600', alt: 'Family members doing abhishek' },
      { id: 'p3', url: 'https://picsum.photos/seed/shiva3/800/600', alt: 'Midnight aarti at the temple' },
    ],
    published: true,
    attendeeCount: 22,
    createdAt: '2026-02-27T07:00:00Z',
  },

  // ── UPCOMING (published: false, dates within 30 days of 2026-04-07) ─
  {
    id: 'evt-006',
    title: 'Silver Anniversary Celebration — Venkatesh & Sunita',
    titleKn: 'ರಜತ ಮಹೋತ್ಸವ — ವೆಂಕಟೇಶ ಮತ್ತು ಸುನೀತಾ',
    category: 'celebration',
    date: '2026-04-20',
    location: 'Kaveri Kalyana Mantapa, Jayanagar, Bengaluru',
    description:
      '25th (Silver) wedding anniversary celebration for Venkatesh and Sunita Lagwankar. The entire family is invited for an evening of traditional music, dinner, and blessings. Children are preparing a special cultural programme.',
    descriptionKn:
      'ವೆಂಕಟೇಶ ಮತ್ತು ಸುನೀತಾ ಲಗ್ವಾಂಕರ್ ಅವರ ರಜತ ವಿವಾಹ ಮಹೋತ್ಸವ. ಕುಟುಂಬದ ಎಲ್ಲರೂ ಆಮಂತ್ರಿಸಲ್ಪಟ್ಟಿದ್ದಾರೆ.',
    coverPhoto: 'https://picsum.photos/seed/anniversary-cover/800/450',
    photos: [],
    published: false,
    attendeeCount: 0,
    createdAt: '2026-04-05T10:00:00Z',
  },
  {
    id: 'evt-007',
    title: 'Akshaya Tritiya Puja',
    titleKn: 'ಅಕ್ಷಯ ತೃತೀಯಾ ಪೂಜೆ',
    category: 'puja',
    date: '2026-04-29',
    location: 'Narayana Bhavan, Basavanagudi, Bengaluru',
    description:
      'Akshaya Tritiya Lakshmi Puja and gold purchase blessing organised at Narayana Bhavan. All family members invited. Priests will conduct Lakshmi Kubera puja followed by a traditional lunch.',
    descriptionKn:
      'ಬಸವನಗುಡಿಯ ನಾರಾಯಣ ಭವನದಲ್ಲಿ ಅಕ್ಷಯ ತೃತೀಯಾ ಲಕ್ಷ್ಮೀ ಪೂಜೆ. ಕುಟುಂಬ ಸದಸ್ಯರೆಲ್ಲರೂ ಆಮಂತ್ರಿತರು.',
    coverPhoto: 'https://picsum.photos/seed/akshaya-cover/800/450',
    photos: [],
    published: false,
    attendeeCount: 0,
    createdAt: '2026-04-06T09:00:00Z',
  },
  {
    id: 'evt-008',
    title: 'Annaprasana — Baby Arjun',
    titleKn: 'ಅನ್ನಪ್ರಾಶನ — ಶಿಶು ಅರ್ಜುನ',
    category: 'ceremony',
    date: '2026-05-03',
    location: 'Prasanna & Vidya Lagwankar residence, Malleshwaram',
    description:
      'Rice-feeding ceremony (Annaprasana) for baby Arjun, infant son of Aditya and Pooja Murthy. Family elders will bless the child during this traditional first-food ceremony. Lunch will be served to all attendees.',
    descriptionKn:
      'ಆದಿತ್ಯ ಮತ್ತು ಪೂಜಾ ಮೂರ್ತಿ ಅವರ ಮಗ ಅರ್ಜುನ್‌ನ ಅನ್ನಪ್ರಾಶನ ಮಲ್ಲೇಶ್ವರದ ಮನೆಯಲ್ಲಿ ನಡೆಯಲಿದೆ.',
    coverPhoto: 'https://picsum.photos/seed/annaprasana-cover/800/450',
    photos: [],
    published: false,
    attendeeCount: 0,
    createdAt: '2026-04-06T11:00:00Z',
  },
]
