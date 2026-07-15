export interface Exercise {
  n: string
  m: string
  s: number
}

export interface LiftDay {
  id: string
  d: string
  t: string
  type: 'lift'
  title: string
  sub: string
  ex: Exercise[]
  note: string
}

export interface CheckDay {
  id: string
  d: string
  t: string
  type: 'check'
  title: string
  sub: string
  items: string[]
  note: string
}

export type Day = LiftDay | CheckDay

export const DAYS: Day[] = [
  {
    id: 'mon', d: 'Mon', t: 'Lift A', type: 'lift', title: 'Workout A',
    sub: 'Warm up 5 min: easy row or incline walk, arm circles, bodyweight squats.',
    ex: [
      { n: 'Barbell Back Squat', m: '3 × 5–8 · rest 2–3 min', s: 3 },
      { n: 'Bench Press', m: '3 × 5–8 · rest 2–3 min', s: 3 },
      { n: 'Seated Cable Row', m: '3 × 8–12 · rest 90 sec', s: 3 },
      { n: 'Dumbbell Shoulder Press', m: '2 × 8–12 · rest 90 sec', s: 2 },
      { n: 'Plank', m: '3 × 30–45 sec', s: 3 },
      { n: 'Finisher: incline walk or bike', m: '15 min steady — can talk, breathing noticeably', s: 1 },
    ],
    note: '<b>Progression:</b> hit the top of every rep range with good form → add 2.5 kg upper / 5 kg lower next session.',
  },
  {
    id: 'tue', d: 'Tue', t: 'Rest', type: 'check', title: 'Rest Day', sub: 'Recovery is where strength is built.',
    items: ['8,000–10,000 steps', 'Protein at every meal', '7–9 hours of sleep tonight'],
    note: 'Rest-day eating: drop the pre-workout snack, halve one carb portion, add vegetables.',
  },
  {
    id: 'wed', d: 'Wed', t: 'Lift B', type: 'lift', title: 'Workout B', sub: 'Warm up 5 min as usual.',
    ex: [
      { n: 'Romanian Deadlift', m: '3 × 6–10 · rest 2–3 min', s: 3 },
      { n: 'Lat Pulldown', m: '3 × 8–12 · rest 90 sec', s: 3 },
      { n: 'Incline Dumbbell Press', m: '3 × 8–12 · rest 90 sec', s: 3 },
      { n: 'Leg Press', m: '2 × 10–15 · rest 90 sec', s: 2 },
      { n: 'Cable Woodchop or Hanging Knee Raise', m: '3 × 10–12 per side', s: 3 },
      { n: 'Finisher: intervals (bike/rower)', m: '30 sec hard / 90 sec easy × 6–8 rounds', s: 1 },
    ],
    note: '<b>Stalled twice in a row?</b> Drop the weight ~10% and build back up.',
  },
  {
    id: 'thu', d: 'Thu', t: 'Rest', type: 'check', title: 'Rest Day', sub: 'Same as Tuesday — move, eat, sleep.',
    items: ['8,000–10,000 steps', 'Protein at every meal', '7–9 hours of sleep tonight'],
    note: 'Soreness in weeks 1–2 is normal. Sharp joint pain is not — reduce weight and check form.',
  },
  {
    id: 'fri', d: 'Fri', t: 'Lift C', type: 'lift', title: 'Workout C', sub: 'Warm up 5 min as usual.',
    ex: [
      { n: 'Deadlift (conventional or trap bar)', m: '3 × 5 · rest 3 min', s: 3 },
      { n: 'Overhead Barbell Press', m: '3 × 5–8 · rest 2–3 min', s: 3 },
      { n: 'Chest-Supported or 1-Arm DB Row', m: '3 × 8–12 · rest 90 sec', s: 3 },
      { n: 'Walking Lunges or Split Squats', m: '2 × 10 per leg', s: 2 },
      { n: "Farmer's Carry", m: '3 × 30–40 m, heavy dumbbells', s: 3 },
      { n: 'Finisher: steady cardio of choice', m: '15 min', s: 1 },
    ],
    note: '<b>First 2 weeks:</b> start lighter than feels necessary — they are for learning form.',
  },
  {
    id: 'sat', d: 'Sat', t: 'Endure', type: 'lift', title: 'Endurance & Conditioning',
    sub: 'No barbell work — legs and back recover for Monday. Pick ONE option.',
    ex: [
      { n: 'Option 1 · Zone 2 cardio (default)', m: '40–60 min walk / cycle / row / swim / hike — conversational pace', s: 1 },
      { n: 'Option 2 · Circuit (from week 3+): Kettlebell Swings ×15 → Push-ups ×10–15 → Goblet Squats ×12 → Row 250 m → Carry 30 m', m: '3–4 rounds · minimal rest inside, 2 min between rounds — mark each round', s: 4 },
    ],
    note: 'Alternate options week to week. If Friday deadlifts left you sore, take Option 1.',
  },
  {
    id: 'sun', d: 'Sun', t: 'Recover', type: 'check', title: 'Active Recovery',
    sub: 'Move blood, not build fatigue. Sunday should leave you feeling better.',
    items: [
      '30–45 min easy walk, outdoors if possible',
      '10–15 min stretching: hip flexors, hamstrings, chest, cat-cow',
      'Optional: light swim or easy bike',
      'Plan next week’s meals',
    ],
    note: 'Wiped out from the week? A walk and stretching is plenty.',
  },
]

export interface Meal {
  h: string
  k: string
  li: string[]
}

export const MEALS: Record<'train' | 'rest', Meal[]> = {
  train: [
    { h: 'Breakfast', k: '~450 kcal · 35 g protein', li: ['3 eggs (or 2 eggs + 100 g Greek yogurt)', '1 slice whole grain bread or ½ cup oats', '1 piece of fruit', 'Coffee/tea — no sugar, milk fine'] },
    { h: 'Lunch', k: '~600 kcal · 40 g protein', li: ['Palm of chicken, fish or lean beef (150–180 g cooked) — or 1½ cups beans/lentils', '1 fist of rice, sweet potato, potatoes, ugali or plantain', '2 fists of vegetables', 'Thumb of fat: ¼ avocado, oil drizzle, or small handful of nuts'] },
    { h: 'Pre-workout snack', k: '~200 kcal · 60–90 min before', li: ['Banana + small handful of peanuts', 'or bread with peanut butter', 'or yogurt with fruit'] },
    { h: 'Dinner', k: '~650 kcal · 40 g protein', li: ['Same structure as lunch', 'Slightly larger carb portion today'] },
    { h: 'Evening (optional)', k: '~200 kcal · 20 g protein', li: ['Greek yogurt, cottage cheese, 1–2 boiled eggs, or a protein shake', 'Use it to hit the protein target'] },
  ],
  rest: [
    { h: 'Breakfast', k: '~450 kcal · 35 g protein', li: ['3 eggs (or 2 eggs + 100 g Greek yogurt)', '1 slice whole grain bread or ½ cup oats', '1 piece of fruit', 'Coffee/tea — no sugar, milk fine'] },
    { h: 'Lunch', k: '~600 kcal · 40 g protein', li: ['Palm of protein as usual', '½ fist of starchy carbs (halved today)', 'Extra vegetables to fill the plate', 'Thumb of fat'] },
    { h: 'Dinner', k: '~600 kcal · 40 g protein', li: ['Palm of protein', '½–1 fist of carbs', '2+ fists of vegetables', 'Thumb of fat'] },
    { h: 'Evening (optional)', k: '~200 kcal · 20 g protein', li: ['Greek yogurt, cottage cheese, eggs, or a shake', 'No pre-workout snack on rest days'] },
  ],
}

export const RULES: string[] = [
  'Protein at every meal — priority #1',
  'Half the plate vegetables at lunch & dinner',
  "Don't drink calories",
  'Cook most meals; grilled over fried when out',
  'One planned flexible meal per week — one',
  'Weigh 3–4 mornings/week, judge the weekly average',
  'Eat slowly, stop at ~80% full',
  'Sleep 7–9 hours',
  'Hungry between meals: water → fruit/veg → protein',
  'Consistency over perfection',
]
