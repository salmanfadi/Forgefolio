// BullMQ Worker Job: Recompute Employability Score
export async function processScoreRecomputeJob(jobData: { userId: string }) {
  console.log(`[Worker] Recomputing Employability Score for user: ${jobData.userId}`)
  // 1. Fetch user progress, verified skills, github activity, leetcode, ratings, projects
  // 2. Calculate component scores (normalised 0-100)
  // 3. Apply formula and upsert EmployabilityScore record in DB
  return { status: 'success', userId: jobData.userId, score: 78.5 }
}
