"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('🌱 Starting database seed...');
    await prisma.comment.deleteMany();
    await prisma.task.deleteMany();
    await prisma.label.deleteMany();
    await prisma.project.deleteMany();
    await prisma.workspaceMember.deleteMany();
    await prisma.workspace.deleteMany();
    await prisma.user.deleteMany();
    const dexter = await prisma.user.create({
        data: {
            email: 'dexter@gmail.com',
            fullName: 'Dexter',
            username: 'Dexuser',
            title: 'Designer',
            isGuest: false,
            theme: 'light',
            colorMode: 'blue',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        },
    });
    const guestUser = await prisma.user.create({
        data: {
            email: 'guest@ablespace.io',
            fullName: 'Guest User',
            username: 'guest',
            title: 'Member',
            isGuest: true,
            theme: 'light',
            colorMode: 'blue',
        },
    });
    const workspace = await prisma.workspace.create({
        data: {
            name: 'Workspace',
            members: {
                create: [
                    { userId: dexter.id, role: 'owner' },
                    { userId: guestUser.id, role: 'member' },
                ],
            },
        },
    });
    const labelResearch = await prisma.label.create({ data: { name: 'Research', color: '#6366F1' } });
    const labelDesign = await prisma.label.create({ data: { name: 'Design', color: '#EC4899' } });
    const labelDev = await prisma.label.create({ data: { name: 'Development', color: '#3B82F6' } });
    const labelTesting = await prisma.label.create({ data: { name: 'Testing', color: '#F59E0B' } });
    const labelDeployment = await prisma.label.create({ data: { name: 'Deployment', color: '#10B981' } });
    const labelAudit = await prisma.label.create({ data: { name: 'Audit', color: '#8B5CF6' } });
    const labelScheduled = await prisma.label.create({ data: { name: 'Scheduled', color: '#06B6D4' } });
    const project1 = await prisma.project.create({
        data: {
            name: 'Design Homepage',
            description: 'Revamp and design the main landing page',
            priority: 'high',
            dueDate: new Date('2026-09-12'),
            workspaceId: workspace.id,
            leadId: dexter.id,
        },
    });
    const project2 = await prisma.project.create({
        data: {
            name: 'Develop Login Feature',
            description: 'Implement secure guest and Google auth',
            priority: 'low',
            dueDate: new Date('2026-09-15'),
            workspaceId: workspace.id,
            leadId: dexter.id,
        },
    });
    const project3 = await prisma.project.create({
        data: {
            name: 'Test Payment Gateway',
            description: 'End-to-end integration testing for checkout',
            priority: 'medium',
            dueDate: new Date('2026-09-18'),
            workspaceId: workspace.id,
            leadId: dexter.id,
        },
    });
    const task1 = await prisma.task.create({
        data: {
            title: 'Write API Documentation',
            description: 'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.',
            status: 'todo',
            priority: 'high',
            dueDate: new Date('2026-07-29'),
            userId: dexter.id,
            creatorId: dexter.id,
            projectId: project1.id,
            labels: {
                connect: [
                    { id: labelResearch.id },
                    { id: labelDesign.id },
                    { id: labelDev.id },
                    { id: labelTesting.id },
                    { id: labelDeployment.id },
                ],
            },
            subtasks: {
                create: [
                    {
                        title: 'Subtask 1',
                        priority: 'high',
                        status: 'todo',
                        dueDate: new Date('2026-09-12'),
                        userId: dexter.id,
                    },
                    {
                        title: 'Subtask 2',
                        priority: 'low',
                        status: 'todo',
                        dueDate: new Date('2026-09-15'),
                        userId: dexter.id,
                    },
                    {
                        title: 'Subtask 3',
                        priority: 'medium',
                        status: 'todo',
                        dueDate: new Date('2026-09-18'),
                        userId: dexter.id,
                    },
                ],
            },
        },
    });
    await prisma.comment.create({
        data: {
            content: 'dsds',
            taskId: task1.id,
            userId: dexter.id,
        },
    });
    await prisma.task.create({
        data: {
            title: 'Implement Search Function',
            status: 'todo',
            priority: 'medium',
            dueDate: new Date('2026-07-29'),
            userId: dexter.id,
            labels: { connect: [{ id: labelDeployment.id }] },
        },
    });
    await prisma.task.create({
        data: {
            title: 'Deploy to Production',
            status: 'todo',
            priority: 'high',
            dueDate: new Date('2026-07-29'),
            userId: dexter.id,
            labels: { connect: [{ id: labelDeployment.id }] },
        },
    });
    await prisma.task.create({
        data: {
            title: 'Code Review Completed',
            status: 'doing',
            priority: 'high',
            dueDate: new Date('2026-07-29'),
            userId: dexter.id,
            labels: { connect: [{ id: labelDeployment.id }] },
        },
    });
    await prisma.task.create({
        data: {
            title: 'Design Mockups Finalized',
            status: 'doing',
            priority: 'high',
            dueDate: new Date('2026-07-29'),
            userId: dexter.id,
            labels: { connect: [{ id: labelDeployment.id }] },
        },
    });
    await prisma.task.create({
        data: {
            title: 'Feature Testing Passed',
            status: 'completed',
            priority: 'medium',
            dueDate: new Date('2026-07-30'),
            userId: dexter.id,
            labels: { connect: [{ id: labelTesting.id }] },
        },
    });
    await prisma.task.create({
        data: {
            title: 'UI Design Updated',
            status: 'completed',
            priority: 'high',
            dueDate: new Date('2026-07-31'),
            userId: dexter.id,
            labels: { connect: [{ id: labelDesign.id }] },
        },
    });
    await prisma.task.create({
        data: {
            title: 'Security Audit Scheduled',
            status: 'completed',
            priority: 'high',
            dueDate: new Date('2026-08-01'),
            userId: dexter.id,
            labels: { connect: [{ id: labelAudit.id }, { id: labelScheduled.id }] },
        },
    });
    console.log('✅ Database seeded successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map