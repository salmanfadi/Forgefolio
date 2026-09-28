import { Router, type IRouter } from "express";
import { promises as fs } from "node:fs";
import path from "node:path";

type ApiError = { error: { code: string; message: string } };

const router: IRouter = Router();

const candidates = [
  {
    id: "usr-1",
    username: "alex_dev",
    name: "Alex Sharma",
    role: "Frontend Developer",
    domain: "Frontend Development",
    score: 78.5,
    roadmapPercent: 60,
    topSkills: ["JavaScript ES6+", "React.js", "TypeScript"],
    isPublic: true,
  },
  {
    id: "usr-2",
    username: "priya_backend",
    name: "Priya Verma",
    role: "Backend Systems Engineer",
    domain: "Backend Development",
    score: 84,
    roadmapPercent: 85,
    topSkills: ["Node.js", "PostgreSQL", "Prisma ORM", "Redis"],
    isPublic: true,
  },
];

const scoreBreakdown = {
  roadmapCompletion: 80,
  verifiedSkills: 75,
  githubActivity: 85,
  leetcodeStats: 60,
  mentorRatings: 90,
  projectQuality: 70,
};

function roadmapRoot() {
  return [
    path.resolve(process.cwd(), "content/roadmaps"),
    path.resolve(process.cwd(), "../../content/roadmaps"),
  ];
}

async function readRoadmap(slug: string) {
  for (const root of roadmapRoot()) {
    try {
      const raw = await fs.readFile(path.join(root, slug, "roadmap.json"), "utf8");
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      // Try the second supported working directory.
    }
  }
  return null;
}

async function readRoadmaps() {
  for (const root of roadmapRoot()) {
    try {
      const entries = await fs.readdir(root, { withFileTypes: true });
      const roadmaps = await Promise.all(
        entries
          .filter((entry) => entry.isDirectory())
          .map((entry) => readRoadmap(entry.name)),
      );
      return roadmaps
        .filter((roadmap): roadmap is Record<string, unknown> => Boolean(roadmap))
        .filter((roadmap) => roadmap.isPublished === true)
        .sort((first, second) =>
          String(first.title).localeCompare(String(second.title)),
        );
    } catch {
      // Try the second supported working directory.
    }
  }
  return [];
}

router.get("/roadmaps", async (_req, res) => {
  const roadmaps = await readRoadmaps();
  res.json({ data: roadmaps });
});

router.get("/roadmaps/:slug", async (req, res) => {
  const slug = req.params.slug;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    const body: ApiError = {
      error: { code: "INVALID_INPUT", message: "Invalid roadmap identifier." },
    };
    res.status(400).json(body);
    return;
  }

  const roadmap = await readRoadmap(slug);
  if (!roadmap || roadmap.isPublished !== true) {
    const body: ApiError = {
      error: { code: "NOT_FOUND", message: "Roadmap not found." },
    };
    res.status(404).json(body);
    return;
  }
  res.json({ data: roadmap });
});

router.get("/directory", (req, res) => {
  const domain = typeof req.query.domain === "string" ? req.query.domain : undefined;
  const parsedMinScore = Number(req.query.minScore ?? 0);
  const minScore = Number.isFinite(parsedMinScore) ? parsedMinScore : 0;
  const filtered = candidates.filter((candidate) => {
    const domainMatches = !domain || domain === "All" || candidate.domain === domain;
    return domainMatches && candidate.score >= minScore;
  });
  res.json({ data: filtered });
});

router.get("/score/:userId", (req, res) => {
  const totalScore = Math.round(
    Object.entries({
      roadmapCompletion: 0.2,
      verifiedSkills: 0.25,
      githubActivity: 0.15,
      leetcodeStats: 0.1,
      mentorRatings: 0.2,
      projectQuality: 0.1,
    }).reduce(
      (total, [key, weight]) =>
        total +
        Math.min(100, Math.max(0, scoreBreakdown[key as keyof typeof scoreBreakdown])) *
          weight,
      0,
    ) * 10,
  ) / 10;
  res.json({
    data: {
      id: `score-${req.params.userId}`,
      userId: req.params.userId,
      totalScore,
      breakdown: scoreBreakdown,
      computedAt: new Date().toISOString(),
    },
  });
});

router.post("/contact/:learnerId", (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (message.length < 10 || message.length > 500) {
    const body: ApiError = {
      error: {
        code: "INVALID_INPUT",
        message: "Message must be between 10 and 500 characters.",
      },
    };
    res.status(400).json(body);
    return;
  }

  res.json({ data: { success: true } });
});

export default router;