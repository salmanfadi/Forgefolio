import { processScoreRecomputeJob } from './jobs/score-recompute'
import { processAiVerificationJob } from './jobs/ai-verification'
import { processEmailDispatchJob } from './jobs/email-dispatch'
import { processGithubSyncJob } from './jobs/github-sync'

console.log('🚀 SkillPath Background Worker started...')
console.log('Registered background queue listeners:')
console.log(' - score-recompute')
console.log(' - ai-verification')
console.log(' - email-dispatch')
console.log(' - github-sync')
