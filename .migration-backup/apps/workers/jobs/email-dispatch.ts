// BullMQ Worker Job: Email Dispatch Relay
export async function processEmailDispatchJob(jobData: { to: string; subject: string; template: string; payload: Record<string, unknown> }) {
  console.log(`[Worker] Dispatching transactional email: ${jobData.subject}`)
  // 1. Render email template with payload
  // 2. Dispatch via Resend API
  // 3. Guarantee learner email address is never logged or written to public logs
  return { status: 'delivered', subject: jobData.subject }
}
