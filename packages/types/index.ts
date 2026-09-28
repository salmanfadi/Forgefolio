// Shared TypeScript types for Forgefolio

export type UserRole =
  | 'LEARNER'
  | 'CONTRIBUTOR'
  | 'MENTOR'
  | 'SENIOR_MENTOR'
  | 'DOMAIN_EXPERT'
  | 'WORKING_PROFESSIONAL'
  | 'ADMIN';

export type VerificationLevel = 'NONE' | 'AI_VERIFIED' | 'MENTOR_VERIFIED';

export type VerificationStatus =
  | 'PENDING'
  | 'AI_REVIEW'
  | 'MENTOR_ASSIGNED'
  | 'CHALLENGE_ISSUED'
  | 'COMPLETED'
  | 'REJECTED';

export type ContributionStatus = 'OPEN' | 'APPROVED' | 'REJECTED';

export interface ScoreBreakdown {
  roadmapCompletion: number; // weight: 0.20
  verifiedSkills: number;    // weight: 0.25
  githubActivity: number;    // weight: 0.15
  leetcodeStats: number;     // weight: 0.10
  mentorRatings: number;     // weight: 0.20
  projectQuality: number;    // weight: 0.10
}

export interface EmployabilityScoreData {
  id: string;
  userId: string;
  totalScore: number;
  breakdown: ScoreBreakdown;
  computedAt: string | Date;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  bio?: string | null;
  role: UserRole;
  isPublic: boolean;
  showReferralTab: boolean;
  createdAt: string | Date;
  githubId?: string | null;
}

export interface TheoryResource {
  type: 'video' | 'docs' | 'article';
  title: string;
  url: string;
  description: string;
}

export interface PracticalExercise {
  type: 'theory' | 'build' | 'practice';
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface StepData {
  id: string;
  moduleId: string;
  title: string;
  theoryContent: TheoryResource[];
  practicalContent: PracticalExercise[];
  orderIndex: number;
  isCompleted?: boolean;
}

export interface ModuleData {
  id: string;
  roadmapId: string;
  title: string;
  orderIndex: number;
  steps: StepData[];
  completedStepCount?: number;
  totalStepCount?: number;
}

export interface RoadmapData {
  id: string;
  slug: string;
  title: string;
  domain: string;
  description: string;
  version: string;
  isPublished: boolean;
  modules: ModuleData[];
  completionPercentage?: number;
}

export interface SkillData {
  id: string;
  name: string;
  domain: string;
  description: string;
}

export interface UserSkillData {
  id: string;
  userId: string;
  skillId: string;
  verificationLevel: VerificationLevel;
  verifiedAt?: string | Date | null;
  skill: SkillData;
}

export interface ProjectData {
  id: string;
  userId: string;
  title: string;
  description: string;
  repoUrl?: string | null;
  liveUrl?: string | null;
  aiQualityScore?: number | null;
  aiReport?: Record<string, unknown> | null;
  screenshotUrl?: string | null;
  createdAt: string | Date;
}

export interface BadgeData {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  criteria: Record<string, unknown>;
}

export interface UserBadgeData {
  userId: string;
  badgeId: string;
  earnedAt: string | Date;
  badge: BadgeData;
}

export interface StreakData {
  id: string;
  userId: string;
  date: string | Date;
  activity: string;
}

export interface VerificationRequestData {
  id: string;
  learnerId: string;
  skillId: string;
  mentorId?: string | null;
  status: VerificationStatus;
  githubRepoUrl?: string | null;
  liveProjectUrl?: string | null;
  leetcodeUsername?: string | null;
  aiReport?: Record<string, unknown> | null;
  challengeDescription?: string | null;
  challengeDeadline?: string | Date | null;
  submittedAt: string | Date;
  skill?: SkillData;
  learnerName?: string;
  learnerUsername?: string;
}

export interface WorkingProfessionalData {
  id: string;
  userId: string;
  linkedinUrl: string;
  company: string;
  designation: string;
  domain: string;
  verifiedAt: string | Date;
  isActive: boolean;
  name?: string;
  avatarUrl?: string | null;
}

export interface DirectoryCandidate {
  id: string;
  username: string;
  name: string;
  role: string;
  domain: string;
  score: number;
  roadmapPercent: number;
  topSkills: string[];
  verifiedSkillsCount: number;
  isPublic: boolean;
}

export interface DirectoryQuery {
  domain?: string | null;
  minScore?: number;
  skill?: string | null;
  search?: string | null;
  sort?: 'score' | 'completion' | 'verified';
  page?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message?: string;
  };
}
