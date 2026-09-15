import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

function passwordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${key}`;
}

async function main() {
  const demoPassword = passwordHash("TaskPayDemo123!");

  const admin = await prisma.user.upsert({
    where: { email: "admin@taskpay.local" },
    update: {},
    create: {
      email: "admin@taskpay.local",
      name: "TaskPay Admin",
      passwordHash: demoPassword,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      verificationStatus: "VERIFIED",
      trustScore: 100,
    },
  });

  const worker = await prisma.user.upsert({
    where: { email: "worker@taskpay.local" },
    update: {},
    create: {
      email: "worker@taskpay.local",
      name: "Demo Worker",
      passwordHash: demoPassword,
      role: "WORKER",
      status: "ACTIVE",
      verificationStatus: "VERIFIED",
      trustScore: 92,
      workerProfile: { create: { countryCode: "GH", currentLevel: 2, completedTasks: 14 } },
    },
  });

  const business = await prisma.user.upsert({
    where: { email: "business@taskpay.local" },
    update: {},
    create: {
      email: "business@taskpay.local",
      name: "Demo Business Owner",
      passwordHash: demoPassword,
      role: "BUSINESS",
      status: "ACTIVE",
      verificationStatus: "VERIFIED",
      trustScore: 90,
      businessProfile: {
        create: {
          companyName: "TaskPay Demo Ltd",
          countryCode: "GH",
          verificationStatus: "VERIFIED",
        },
      },
    },
  });

  const businessProfile = await prisma.businessProfile.findUniqueOrThrow({ where: { userId: business.id } });

  const existingCampaign = await prisma.campaign.findFirst({ where: { businessProfileId: businessProfile.id, name: "Demo Mobile Banking Survey" } });
  if (!existingCampaign) {
    await prisma.campaign.create({
      data: {
        businessProfileId: businessProfile.id,
        name: "Demo Mobile Banking Survey",
        description: "A local demo campaign for testing the worker survey flow.",
        status: "PUBLISHED",
        currency: "GHS",
        budgetMinor: 50000n,
        platformFeeMinor: 12500n,
        totalCostMinor: 62500n,
        targetCountryCode: "GH",
        fundedAt: new Date(),
        reviewedAt: new Date(),
        publishedAt: new Date(),
        tasks: {
          create: {
            title: "Mobile Banking Habits Survey",
            description: "Answer a short demo survey about mobile banking habits.",
            category: "SURVEY",
            status: "PUBLISHED",
            rewardMinor: 500n,
            currency: "GHS",
            countryCode: "GH",
            minimumLevel: 0,
            capacity: 100,
            configuration: {
              questions: [
                { id: "q1", prompt: "How often do you use mobile banking?", type: "text", required: true },
                { id: "q2", prompt: "Which feature matters most to you?", type: "textarea", required: true },
              ],
            },
          },
        },
      },
    });
  }

  const existingWalletEntry = await prisma.ledgerEntry.findFirst({ where: { userId: worker.id, reference: "demo-seed" } });
  if (!existingWalletEntry) {
    await prisma.ledgerEntry.create({
      data: {
        userId: worker.id,
        type: "TASK_REWARD",
        status: "AVAILABLE",
        amountMinor: 25000n,
        currency: "GHS",
        reference: "demo-seed",
        idempotencyKey: "demo:worker:wallet:seed",
        metadata: { source: "local-demo" },
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      actorUserId: admin.id,
      action: "DEMO_SEED_CREATED",
      targetType: "SYSTEM",
      metadata: { workerId: worker.id, businessId: business.id },
    },
  });

  console.log("TaskPay demo data ready.");
  console.log("admin@taskpay.local / TaskPayDemo123!");
  console.log("worker@taskpay.local / TaskPayDemo123!");
  console.log("business@taskpay.local / TaskPayDemo123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
