import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database connection validation with retry logic
export async function connectDatabase(maxRetries = 5, retryDelay = 2000): Promise<void> {
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            await prisma.$connect();
            await prisma.$queryRaw`SELECT 1`; // Test query
            console.log('✅ Database connected successfully');
            return;
        } catch (error: any) {
            attempt++;
            console.error(`❌ Database connection attempt ${attempt}/${maxRetries} failed:`, error.message);

            if (attempt >= maxRetries) {
                console.error('\n🔥 FATAL: Could not connect to database after', maxRetries, 'attempts');
                console.error('💡 Check your DATABASE_URL and ensure PostgreSQL is running\n');
                process.exit(1);
            }

            console.log(`⏳ Retrying in ${retryDelay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
}

// Graceful shutdown
export async function disconnectDatabase(): Promise<void> {
    try {
        await prisma.$disconnect();
        console.log('✅ Database disconnected gracefully');
    } catch (error: any) {
        console.error('❌ Error disconnecting database:', error.message);
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    await disconnectDatabase();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await disconnectDatabase();
    process.exit(0);
});
