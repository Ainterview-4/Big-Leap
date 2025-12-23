import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    CORS_ORIGIN: string;

    // S3/R2 - optional for local dev
    S3_REGION?: string;
    S3_BUCKET?: string;
    S3_ACCESS_KEY_ID?: string;
    S3_SECRET_ACCESS_KEY?: string;
    S3_PUBLIC_BASE_URL?: string;
}

function validateEnv(): EnvConfig {
    const errors: string[] = [];

    // Required variables
    const required = {
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        CORS_ORIGIN: process.env.CORS_ORIGIN,
    };

    for (const [key, value] of Object.entries(required)) {
        if (!value) {
            errors.push(`❌ Missing required environment variable: ${key}`);
        }
    }

    // Validate JWT_SECRET strength in production
    if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET) {
        if (process.env.JWT_SECRET.length < 32) {
            errors.push('❌ JWT_SECRET must be at least 32 characters in production');
        }
    }

    // Validate DATABASE_URL format
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgresql://')) {
        errors.push('❌ DATABASE_URL must be a valid PostgreSQL connection string');
    }

    // Validate PORT
    const port = Number(process.env.PORT);
    if (isNaN(port) || port < 1 || port > 65535) {
        errors.push('❌ PORT must be a valid number between 1-65535');
    }

    if (errors.length > 0) {
        console.error('\n🔥 ENVIRONMENT VALIDATION FAILED:\n');
        errors.forEach(err => console.error(err));
        console.error('\n💡 Check your .env file and ensure all required variables are set.\n');
        process.exit(1);
    }

    console.log('✅ Environment variables validated successfully');

    return {
        NODE_ENV: (process.env.NODE_ENV as any) || 'development',
        PORT: port,
        DATABASE_URL: process.env.DATABASE_URL!,
        JWT_SECRET: process.env.JWT_SECRET!,
        CORS_ORIGIN: process.env.CORS_ORIGIN!,
        S3_REGION: process.env.S3_REGION,
        S3_BUCKET: process.env.S3_BUCKET,
        S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
        S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
        S3_PUBLIC_BASE_URL: process.env.S3_PUBLIC_BASE_URL,
    };
}

export const env = validateEnv();
