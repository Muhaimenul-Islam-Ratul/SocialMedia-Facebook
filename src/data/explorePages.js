export const explorePages = [
  {
    id: 'learning',
    label: 'Learning',
    path: '/learning',
    badge: 'New',
    icon: 'GraduationCap',
    hero: {
      eyebrow: 'Grow your network and skill set',
      title: 'Learning Hub',
      description:
        'Discover short lessons, creator workshops, and practical social media playbooks tailored for people who want to build a stronger presence.',
      ctaPrimary: 'Start a lesson',
      ctaSecondary: 'Browse saved courses',
    },
    stats: [
      { label: 'Lessons this week', value: '24', hint: 'Design, marketing, creator growth' },
      { label: 'Friends learning', value: '186', hint: 'People from your network enrolled' },
      { label: 'Completion streak', value: '8 days', hint: 'Keep the momentum going' },
    ],
    highlights: [
      {
        title: 'Creator Branding Basics',
        description: 'Build a profile people trust with a cleaner story, better cover image, and stronger intro.',
        meta: '12 min lesson',
      },
      {
        title: 'Short-Form Video Strategy',
        description: 'Learn how top creators structure posts, reels, and captions to keep engagement moving.',
        meta: 'Live session tonight',
      },
      {
        title: 'Community Management',
        description: 'Reply faster, moderate smarter, and turn your comment section into a loyal circle.',
        meta: 'Recommended for page admins',
      },
    ],
    sidePanel: {
      title: 'Suggested tracks',
      items: [
        'Facebook Ads Essentials',
        'Community storytelling',
        'Post analytics for beginners',
        'How to launch a group',
      ],
    },
  },
  {
    id: 'insights',
    label: 'Insights',
    path: '/insights',
    icon: 'ChartColumnBig',
    hero: {
      eyebrow: 'See what is working',
      title: 'Audience Insights',
      description:
        'Track reach, reactions, watch time, and post performance with a dashboard that feels familiar to modern social platforms.',
      ctaPrimary: 'View report',
      ctaSecondary: 'Export summary',
    },
    stats: [
      { label: 'Profile visits', value: '18.4K', hint: '+14% from last week' },
      { label: 'Post engagement', value: '6.2%', hint: 'Above your peer average' },
      { label: 'Top audience age', value: '24-34', hint: 'Most active after 8 PM' },
    ],
    highlights: [
      {
        title: 'Best posting window',
        description: 'Your audience reacts fastest between 8:00 PM and 10:00 PM, especially to image-first posts.',
        meta: 'Updated 2 hours ago',
      },
      {
        title: 'Top content theme',
        description: 'Behind-the-scenes posts drove the most shares this month across your feed and stories.',
        meta: 'Strongest share rate',
      },
      {
        title: 'Watchlist',
        description: 'Carousel posts are underperforming. Try shorter captions and stronger lead images next week.',
        meta: 'Action recommended',
      },
    ],
    sidePanel: {
      title: 'Quick filters',
      items: ['Last 7 days', 'Followers only', 'Video posts', 'Top performing content'],
    },
  },
  {
    id: 'find-friends',
    label: 'Find friends',
    path: '/find-friends',
    icon: 'UserPlus',
    hero: {
      eyebrow: 'Reconnect with people',
      title: 'Find Friends',
      description:
        'Browse suggested people, classmates, coworkers, and mutual friends to build a more active social feed.',
      ctaPrimary: 'See suggestions',
      ctaSecondary: 'Import contacts',
    },
    stats: [
      { label: 'People you may know', value: '92', hint: 'Based on work, school, and groups' },
      { label: 'Mutual connections', value: '1.8K', hint: 'Across your closest circles' },
      { label: 'Pending requests', value: '14', hint: 'Some are waiting for your reply' },
    ],
    highlights: [
      {
        title: 'Coworkers from Appifylab',
        description: 'People who share recent team updates, product launches, and company milestones.',
        meta: '18 suggestions',
      },
      {
        title: 'Friends from design groups',
        description: 'Members you interact with often in comments, reactions, and shared event spaces.',
        meta: 'High match quality',
      },
      {
        title: 'Reconnect from university',
        description: 'Former classmates who recently became active again and are sharing job and life updates.',
        meta: 'Fresh activity',
      },
    ],
    sidePanel: {
      title: 'Connection tips',
      items: ['Add a note to requests', 'Follow before sending', 'Prioritize mutual groups', 'Keep your profile updated'],
    },
  },
  {
    id: 'bookmarks',
    label: 'Bookmarks',
    path: '/bookmarks',
    icon: 'Bookmark',
    hero: {
      eyebrow: 'Keep the good stuff close',
      title: 'Bookmarks',
      description:
        'Collect articles, videos, reels, and helpful posts so you can come back when you are ready to read or share.',
      ctaPrimary: 'Open collection',
      ctaSecondary: 'Create folder',
    },
    stats: [
      { label: 'Saved reads', value: '47', hint: 'News, guides, and creator threads' },
      { label: 'Video ideas', value: '13', hint: 'Clips worth revisiting' },
      { label: 'Unread items', value: '21', hint: 'Catch up this evening' },
    ],
    highlights: [
      {
        title: 'Marketing swipe file',
        description: 'Posts and ad examples you saved because the hook, copy, or layout stood out.',
        meta: 'Updated yesterday',
      },
      {
        title: 'Watch later collection',
        description: 'A tidy queue of social video explainers and creator interviews for your downtime.',
        meta: '9 new videos',
      },
      {
        title: 'Research for your next post',
        description: 'Posts, screenshots, and case studies that can inspire your next community update.',
        meta: 'Ready to organize',
      },
    ],
    sidePanel: {
      title: 'Bookmark folders',
      items: ['Inspiration', 'Read later', 'Ad references', 'Career posts'],
    },
  },
  {
    id: 'group',
    label: 'Group',
    path: '/group',
    icon: 'Users',
    hero: {
      eyebrow: 'Build communities that stick',
      title: 'Groups',
      description:
        'Manage communities, jump into trending conversations, and discover spaces where your audience is already active.',
      ctaPrimary: 'Create group',
      ctaSecondary: 'Discover groups',
    },
    stats: [
      { label: 'Joined groups', value: '11', hint: 'Tech, local, and creator spaces' },
      { label: 'Unread group posts', value: '36', hint: 'Your communities are active' },
      { label: 'Events this month', value: '7', hint: 'Online and in-person meetups' },
    ],
    highlights: [
      {
        title: 'Freelancer USA',
        description: 'A lively community where people share client wins, project leads, and pricing advice.',
        meta: '42 new posts today',
      },
      {
        title: 'Startup Builders Circle',
        description: 'Founders trading launch stories, feedback requests, and lightweight marketing experiments.',
        meta: 'Featured this week',
      },
      {
        title: 'Dhaka Creators Club',
        description: 'Local creators planning meetups, collaborations, and short-form content sessions.',
        meta: 'Event on Friday',
      },
    ],
    sidePanel: {
      title: 'Group tools',
      items: ['Moderation queue', 'Scheduled posts', 'Member requests', 'Rules and guidelines'],
    },
  },
  {
    id: 'gaming',
    label: 'Gaming',
    path: '/gaming',
    badge: 'New',
    icon: 'Gamepad2',
    hero: {
      eyebrow: 'Play, stream, and connect',
      title: 'Gaming Lounge',
      description:
        'Follow streamers, find gaming groups, and keep up with live sessions, highlights, and community challenges.',
      ctaPrimary: 'Watch live',
      ctaSecondary: 'Join a squad',
    },
    stats: [
      { label: 'Live streams', value: '32', hint: 'Across action, sports, and strategy' },
      { label: 'Friends online', value: '9', hint: 'Ready to squad up now' },
      { label: 'Tournaments', value: '4', hint: 'Weekend events available' },
    ],
    highlights: [
      {
        title: 'Tonight’s featured stream',
        description: 'A creator challenge with live chat polls, clips, and back-to-back community matches.',
        meta: 'Starts in 45 minutes',
      },
      {
        title: 'Trending clips',
        description: 'Fast-paced highlights your network is already reacting to and sharing across the platform.',
        meta: 'Most shared in gaming',
      },
      {
        title: 'Join a voice squad',
        description: 'Find players by game, region, or rank and jump into a familiar lobby experience.',
        meta: 'Voice rooms open',
      },
    ],
    sidePanel: {
      title: 'Popular categories',
      items: ['Battle royale', 'Sports games', 'Story adventures', 'Mobile esports'],
    },
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    hero: {
      eyebrow: 'Control your experience',
      title: 'Account Settings',
      description:
        'Update privacy, notifications, profile details, and security preferences in one clean place.',
      ctaPrimary: 'Edit profile',
      ctaSecondary: 'Privacy checkup',
    },
    stats: [
      { label: 'Privacy score', value: '88%', hint: 'A few recommendations left' },
      { label: 'Active sessions', value: '3', hint: 'Desktop and mobile devices' },
      { label: 'Notification rules', value: '12', hint: 'Fine-tuned for focus' },
    ],
    highlights: [
      {
        title: 'Profile and tagging',
        description: 'Choose who can tag you, mention you, and see personal details on your public profile.',
        meta: 'Recommended review',
      },
      {
        title: 'Security center',
        description: 'Refresh your password, monitor sessions, and turn on stronger sign-in protection.',
        meta: 'Last reviewed 3 weeks ago',
      },
      {
        title: 'Notification preferences',
        description: 'Quiet noisy alerts while keeping messages, group invites, and close-friend posts visible.',
        meta: 'Smart digest enabled',
      },
    ],
    sidePanel: {
      title: 'Setting shortcuts',
      items: ['Password and security', 'Privacy center', 'Blocked accounts', 'Notification preferences'],
    },
  },
  {
    id: 'save-post',
    label: 'Save post',
    path: '/save-post',
    icon: 'Archive',
    hero: {
      eyebrow: 'Your private collection',
      title: 'Saved Posts',
      description:
        'Return to important updates, funny clips, and useful references you saved from the feed without losing the original context.',
      ctaPrimary: 'Review saved posts',
      ctaSecondary: 'Sort by recent',
    },
    stats: [
      { label: 'Saved this month', value: '29', hint: 'Mostly tutorials and community posts' },
      { label: 'Shared from saved', value: '8', hint: 'Helpful content you resurfaced' },
      { label: 'Collections', value: '5', hint: 'Neatly sorted by purpose' },
    ],
    highlights: [
      {
        title: 'Posts worth revisiting',
        description: 'A timeline of the updates you saved because they teach, entertain, or inspire a reply later.',
        meta: 'Chronological view',
      },
      {
        title: 'Creator references',
        description: 'Well-designed carousels, strong captions, and community prompts you may want to model.',
        meta: 'Good for planning',
      },
      {
        title: 'Career and opportunity posts',
        description: 'Job leads, collaboration calls, and events that were too useful to leave in the feed.',
        meta: 'Actionable list',
      },
    ],
    sidePanel: {
      title: 'Saved filters',
      items: ['Most recent', 'Most shared', 'Unread first', 'Creator references'],
    },
  },
];

export const explorePagesByPath = Object.fromEntries(explorePages.map((page) => [page.path, page]));
