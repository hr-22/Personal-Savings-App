export const QUOTES = [
  "A goal without a plan is just a wish \u2014 you've got the plan.",
  "Small deposits, big destinations.",
  "Every rupee saved today is a choice made for future-you.",
  "Progress, not perfection \u2014 keep the streak alive.",
  "The best time to save was yesterday. The second best time is now.",
  "You don't have to see the whole staircase, just the next step.",
  "Discipline is choosing between what you want now and what you want most.",
  "Consistency compounds \u2014 in money and in habits.",
  "Your goals are closer than they were yesterday.",
  "Saving is a form of self-respect.",
];

export function quoteOfTheDay() {
  const d = new Date();
  const dayIndex = Math.floor(d.getTime() / 86400000);
  return QUOTES[dayIndex % QUOTES.length];
}
