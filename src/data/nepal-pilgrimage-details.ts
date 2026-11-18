export interface PilgrimageDetailItem {
  title: string;
  note?: string;
}

export const includedItems: PilgrimageDetailItem[] = [
  { title: 'Comfortable twin-shared accommodation' },
  { title: 'Daily vegetarian meals' },
  {
    title: 'Domestic transportation (Kathmandu – Pokhara – Kathmandu)',
    note: 'If you prefer to travel by flight, please arrange your own flight tickets. Airfare is not included.',
  },
  { title: 'Local transportation' },
  { title: 'Guided trekking & excursions' },
  { title: 'Yoga, meditation & pranayama' },
  { title: 'Kirtan & devotional music' },
  { title: 'Lectures on philosophy' },
  { title: 'Emergency support' },
];

export const notIncludedItems = [
  'International flights to and from India',
  'Travel and health insurance',
  'Tips and personal offerings at temples, including donations to priests (pandits), workers and local helpers',
];

export const packingItems = [
  'Passport and travel documents',
  'Warm layers and comfortable clothing',
  'Sun protection and sunscreen',
  'Sunglasses',
  'Comfortable walking shoes or trekking boots',
  'Waterproof jacket and rain gear',
  'Personal medications and basic toiletries',
  'Reusable water bottle',
  'Small day backpack',
  'Personal first-aid essentials',
  'Spiritual journal and a pen',
  'Personal yoga or meditation accessories (if preferred)',
];
