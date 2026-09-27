import { PrismaClient, UserRole, VerificationLevel, VerificationStatus } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed for Forgefolio / SkillPath...')

  // 1. Clean existing records (optional for re-runnable seed)
  console.log('Cleaning existing records...')
  await prisma.contactMessage.deleteMany()
  await prisma.workingProfessional.deleteMany()
  await prisma.roadmapContribution.deleteMany()
  await prisma.streak.deleteMany()
  await prisma.userBadge.deleteMany()
  await prisma.badge.deleteMany()
  await prisma.employabilityScore.deleteMany()
  await prisma.project.deleteMany()
  await prisma.mentorFeedback.deleteMany()
  await prisma.verificationRequest.deleteMany()
  await prisma.userSkill.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.userProgress.deleteMany()
  await prisma.step.deleteMany()
  await prisma.module.deleteMany()
  await prisma.roadmap.deleteMany()
  await prisma.user.deleteMany()

  // 2. Seed Users
  console.log('Seeding users...')
  const admin = await prisma.user.create({
    data: {
      email: 'admin@forgefolio.dev',
      name: 'System Admin',
      username: 'admin_user',
      role: UserRole.ADMIN,
      bio: 'Forgefolio Platform Administrator & Core Maintainer.',
      isPublic: true,
    },
  })

  const seniorMentor = await prisma.user.create({
    data: {
      email: 'sarah@forgefolio.dev',
      name: 'Sarah Chen',
      username: 'sarah_mentor',
      role: UserRole.SENIOR_MENTOR,
      bio: 'Principal Engineer @ TechCorp. 10+ yrs in Frontend & Cloud Architecture.',
      isPublic: true,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  })

  const mentor = await prisma.user.create({
    data: {
      email: 'marcus@forgefolio.dev',
      name: 'Marcus Vance',
      username: 'marcus_dev',
      role: UserRole.MENTOR,
      bio: 'Senior Backend Engineer. Passionate about Go, Node.js & Distributed Systems.',
      isPublic: true,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  })

  const professional = await prisma.user.create({
    data: {
      email: 'david@forgefolio.dev',
      name: 'David Miller',
      username: 'david_pro',
      role: UserRole.WORKING_PROFESSIONAL,
      bio: 'Engineering Lead @ Stripe. Recruiting top talent for backend & devops roles.',
      isPublic: true,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  })

  const learnerAlex = await prisma.user.create({
    data: {
      email: 'alex@forgefolio.dev',
      name: 'Alex Rivera',
      username: 'alex_learner',
      role: UserRole.LEARNER,
      bio: 'Aspiring Full-Stack & Frontend Engineer building accessible web applications.',
      githubId: 'alexrivera-dev',
      isPublic: true,
      showReferralTab: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  })

  const learnerPriya = await prisma.user.create({
    data: {
      email: 'priya@forgefolio.dev',
      name: 'Priya Sharma',
      username: 'priya_code',
      role: UserRole.LEARNER,
      bio: 'Backend & Data Science Enthusiast. Learning Python, System Design & ML Pipelines.',
      githubId: 'priya-sharma',
      isPublic: true,
      showReferralTab: true,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    },
  })

  // 3. Seed Working Professional Profile
  console.log('Seeding working professional profile...')
  await prisma.workingProfessional.create({
    data: {
      userId: professional.id,
      linkedinUrl: 'https://linkedin.com/in/david-miller-tech',
      company: 'Stripe',
      designation: 'Staff Engineering Lead',
      domain: 'Backend Engineering',
      isActive: true,
    },
  })

  // 4. Seed Master Skills Catalog
  console.log('Seeding master skills...')
  const skillData = [
    { name: 'React.js', domain: 'Frontend Development', description: 'Component architecture, hooks, state management, and virtual DOM performance.' },
    { name: 'TypeScript', domain: 'Frontend Development', description: 'Strict typing, generics, utility types, and AST compilation.' },
    { name: 'Next.js 14', domain: 'Frontend Development', description: 'App Router, Server Components, SSR, ISR, and dynamic API routes.' },
    { name: 'HTML5 & CSS3', domain: 'Frontend Development', description: 'Semantic HTML, WCAG accessibility, CSS Flexbox, Grid, and design tokens.' },
    { name: 'Node.js', domain: 'Backend Development', description: 'Event loop, asynchronous I/O, Streams, Buffer, and native modules.' },
    { name: 'Express.js', domain: 'Backend Development', description: 'RESTful API routing, middleware chaining, error handling, and security.' },
    { name: 'PostgreSQL', domain: 'Backend Development', description: 'Relational database schema design, indexing, transactions, and Prisma ORM.' },
    { name: 'Redis', domain: 'Backend Development', description: 'In-memory caching, pub/sub messaging, rate limiting, and session stores.' },
    { name: 'Python', domain: 'Data Science', description: 'Data structures, OOP, functional paradigms, NumPy, Pandas, and async scripting.' },
    { name: 'Docker', domain: 'DevOps & Cloud', description: 'Containerization, multi-stage Dockerfiles, Docker Compose, and image optimization.' },
  ]

  const createdSkills: Record<string, string> = {}
  for (const s of skillData) {
    const created = await prisma.skill.create({ data: s })
    createdSkills[s.name] = created.id
  }

  // 5. Seed Master Badges Catalog
  console.log('Seeding system badges...')
  const badgeData = [
    {
      name: 'First Project',
      description: 'Submitted your first verified portfolio project to your Skill Passport.',
      iconUrl: '🚀',
      criteria: { type: 'project_submission', threshold: 1 },
    },
    {
      name: 'First Verification',
      description: 'Achieved your first AI or Mentor verified skill badge.',
      iconUrl: '🛡️',
      criteria: { type: 'skill_verification', threshold: 1 },
    },
    {
      name: 'Mentor Approved',
      description: 'Successfully completed a live mentor code challenge.',
      iconUrl: '🏅',
      criteria: { type: 'mentor_challenge_pass', threshold: 1 },
    },
    {
      name: 'Open Source Contributor',
      description: 'Had a community roadmap contribution approved by a mentor.',
      iconUrl: '🌟',
      criteria: { type: 'roadmap_contribution', threshold: 1 },
    },
    {
      name: 'Streak Master',
      description: 'Maintained a 7-day continuous learning streak.',
      iconUrl: '🔥',
      criteria: { type: 'streak_days', threshold: 7 },
    },
    {
      name: 'Roadmap Conqueror',
      description: 'Completed 100% of steps in a career roadmap.',
      iconUrl: '🎓',
      criteria: { type: 'roadmap_completion', threshold: 100 },
    },
  ]

  const createdBadges: Record<string, string> = {}
  for (const b of badgeData) {
    const created = await prisma.badge.create({ data: b })
    createdBadges[b.name] = created.id
  }

  // 6. Seed Roadmaps from JSON content files
  console.log('Seeding domain roadmaps from content files...')
  const roadmapDirs = [
    'frontend-developer',
    'backend-developer',
    'data-analyst',
    'data-scientist',
    'devops-engineer',
  ]

  const rootContentPath = path.join(process.cwd(), 'content', 'roadmaps')
  const createdStepIds: string[] = []

  for (const dirName of roadmapDirs) {
    const jsonPath = path.join(rootContentPath, dirName, 'roadmap.json')
    if (!fs.existsSync(jsonPath)) continue

    const content = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    
    const roadmap = await prisma.roadmap.create({
      data: {
        slug: content.slug,
        title: content.title,
        domain: content.domain,
        description: content.description,
        version: content.version || '1.0.0',
        isPublished: content.isPublished ?? true,
        createdById: admin.id,
      },
    })

    if (Array.isArray(content.modules)) {
      for (const mod of content.modules) {
        const moduleRecord = await prisma.module.create({
          data: {
            roadmapId: roadmap.id,
            title: mod.title,
            orderIndex: mod.orderIndex || 1,
          },
        })

        if (Array.isArray(mod.steps)) {
          for (const step of mod.steps) {
            const stepRecord = await prisma.step.create({
              data: {
                moduleId: moduleRecord.id,
                title: step.title,
                theoryContent: step.theoryContent || [],
                practicalContent: step.practicalContent || [],
                orderIndex: step.orderIndex || 1,
              },
            })
            createdStepIds.push(stepRecord.id)
          }
        }
      }
    }
  }

  // 7. Seed Learner User Progress (Alex Rivera)
  console.log('Seeding user progress for Alex Rivera...')
  if (createdStepIds.length >= 2) {
    await prisma.userProgress.createMany({
      data: [
        { userId: learnerAlex.id, stepId: createdStepIds[0] },
        { userId: learnerAlex.id, stepId: createdStepIds[1] },
      ],
    })
  }

  // 8. Seed Learner User Skills & Verifications
  console.log('Seeding skills & verifications for Alex Rivera...')
  if (createdSkills['React.js']) {
    await prisma.userSkill.create({
      data: {
        userId: learnerAlex.id,
        skillId: createdSkills['React.js'],
        verificationLevel: VerificationLevel.MENTOR_VERIFIED,
        verifiedAt: new Date(),
        verifiedById: seniorMentor.id,
      },
    })
  }

  if (createdSkills['TypeScript']) {
    await prisma.userSkill.create({
      data: {
        userId: learnerAlex.id,
        skillId: createdSkills['TypeScript'],
        verificationLevel: VerificationLevel.AI_VERIFIED,
        verifiedAt: new Date(),
      },
    })
  }

  if (createdSkills['Next.js 14']) {
    await prisma.userSkill.create({
      data: {
        userId: learnerAlex.id,
        skillId: createdSkills['Next.js 14'],
        verificationLevel: VerificationLevel.NONE,
      },
    })
  }

  // Verification Request record
  if (createdSkills['React.js']) {
    const vr = await prisma.verificationRequest.create({
      data: {
        learnerId: learnerAlex.id,
        skillId: createdSkills['React.js'],
        mentorId: seniorMentor.id,
        status: VerificationStatus.COMPLETED,
        githubRepoUrl: 'https://github.com/alexrivera-dev/react-component-library',
        liveProjectUrl: 'https://react-lib.alexrivera.dev',
        aiReport: {
          score: 92,
          quality: 'EXCELLENT',
          codeSmells: 0,
          testCoverage: '88%',
          summary: 'High quality React TypeScript project adhering to clean component abstraction.',
        },
      },
    })

    await prisma.mentorFeedback.create({
      data: {
        verificationRequestId: vr.id,
        comment: 'Outstanding modular architecture, custom hooks, and full accessibility compliance.',
        rating: 5,
      },
    })
  }

  // 9. Seed Projects
  console.log('Seeding portfolio projects...')
  await prisma.project.create({
    data: {
      userId: learnerAlex.id,
      title: 'Forgefolio - Career Acceleration Platform',
      description: 'Full-stack open-source platform with interactive roadmaps, verified skill passports, and mentor reviews.',
      repoUrl: 'https://github.com/alexrivera-dev/forgefolio',
      liveUrl: 'https://forgefolio.dev',
      aiQualityScore: 94.5,
      aiReport: {
        architecture: 'Next.js 14 App Router with Turbo monorepo',
        securityScore: 98,
        performanceScore: 95,
      },
    },
  })

  // 10. Seed Employability Score
  console.log('Seeding employability score...')
  await prisma.employabilityScore.create({
    data: {
      userId: learnerAlex.id,
      totalScore: 78.5,
      breakdown: {
        roadmapCompletion: 60.0,
        verifiedSkills: 85.0,
        githubActivity: 80.0,
        leetcode: 65.0,
        mentorRatings: 95.0,
        projectQuality: 92.0,
      },
    },
  })

  await prisma.employabilityScore.create({
    data: {
      userId: learnerPriya.id,
      totalScore: 64.0,
      breakdown: {
        roadmapCompletion: 45.0,
        verifiedSkills: 70.0,
        githubActivity: 60.0,
        leetcode: 80.0,
        mentorRatings: 60.0,
        projectQuality: 70.0,
      },
    },
  })

  // 11. Seed User Badges & Streaks
  console.log('Seeding user badges & streaks...')
  if (createdBadges['First Project']) {
    await prisma.userBadge.create({
      data: { userId: learnerAlex.id, badgeId: createdBadges['First Project'] },
    })
  }
  if (createdBadges['First Verification']) {
    await prisma.userBadge.create({
      data: { userId: learnerAlex.id, badgeId: createdBadges['First Verification'] },
    })
  }

  // Streak
  await prisma.streak.create({
    data: {
      userId: learnerAlex.id,
      date: new Date(),
      activity: 'Completed step: Semantic HTML5 & Accessibility',
    },
  })

  console.log('✅ Database seeding successfully completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
