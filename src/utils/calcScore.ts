export default function calculateStars(score: {
  total_points: number
  total_users: number
}): number {
  return Number(score.total_points / score.total_users)
}
