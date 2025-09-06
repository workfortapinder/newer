import type { Mission } from '@/lib/types';

export const mockMissions: Mission[] = [
  {
    id: '1',
    title: 'Morning Routine Mastery',
    reward: 'Artisan Coffee Beans',
    rewardImage: 'https://picsum.photos/400/300',
    timeFrame: 'daily',
    tasks: [
      { id: '1-1', text: 'Wake up at 6 AM', completions: 1, target: 1, icon: 'Coffee' },
      { id: '1-2', text: 'Meditate for 10 minutes', completions: 1, target: 1, icon: 'Leaf' },
      { id: '1-3', text: 'Read 10 pages of a book', completions: 0, target: 1, icon: 'Book' },
    ],
    motivation: 'To start my day with intention and clarity, earning a truly special cup of coffee.',
  },
  {
    id: '2',
    title: 'Weekly Fitness Push',
    reward: 'High-Quality Protein Powder',
    rewardImage: 'https://picsum.photos/400/300',
    timeFrame: 'weekly',
    tasks: [
      { id: '2-1', text: 'Complete 3 gym sessions', completions: 1, target: 3, icon: 'Dumbbell' },
      { id: '2-2', text: 'Go for a 5km run', completions: 0, target: 1, icon: 'Repeat' },
      { id: '2-3', text: 'Stretch for 15 mins post-workout', completions: 0, target: 3, icon: 'Feather' },
      { id: '2-4', text: 'Hit daily protein goals', completions: 2, target: 7, icon: 'Leaf' },
    ],
    motivation: 'Fuel my body with the best to see the results of my hard work.',
  },
  {
    id: '3',
    title: 'Deep Work Wednesdays',
    reward: 'New Mechanical Keyboard',
    rewardImage: 'https://picsum.photos/400/300',
    timeFrame: 'weekly',
    tasks: [
        { id: '3-1', text: 'Finish project proposal', completions: 1, target: 1, icon: 'Book' },
        { id: '3-2', text: 'Clear inbox to zero', completions: 1, target: 1, icon: 'Feather' },
        { id: '3-3', text: 'Plan next week\'s tasks', completions: 1, target: 1, icon: 'Repeat' },
        { id: '3-4', text: 'Review quarterly goals', completions: 1, target: 1, icon: 'Leaf' },
    ],
    motivation: 'A satisfying and productive week deserves a tool that makes work feel amazing.',
  },
  {
    id: '4',
    title: 'Mindful Monthly Reading',
    reward: 'Limited Edition Hardcover Book',
    rewardImage: 'https://picsum.photos/400/300',
    timeFrame: 'monthly',
    tasks: [
        { id: '4-1', text: 'Read 4 books this month', completions: 0, target: 4, icon: 'Book' },
        { id: '4-2', text: 'Write a summary for each book', completions: 0, target: 4, icon: 'Feather' },
    ],
    motivation: 'To expand my knowledge and reward my intellectual curiosity with a beautiful collector\'s item.',
  },
];
