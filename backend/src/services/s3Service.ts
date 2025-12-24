import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const REGION = process.env.S3_REGION || "";
const BUCKET = process.env.S3_BUCKET || "";
const PUBLIC_BASE_URL = process.env.S3_PUBLIC_BASE_URL || "";
const ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || "";
const SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || "";

// Only create S3 client if credentials are provided
let s3Client: S3Client | null = null;

if (REGION && BUCKET && ACCESS_KEY_ID && SECRET_ACCESS_KEY) {
    s3Client = new S3Client({
        region: REGION,
        credentials: {
            accessKeyId: ACCESS_KEY_ID,
            secretAccessKey: SECRET_ACCESS_KEY,
        },
    });
    console.log("✅ S3 client initialized");
} else {
    console.warn("⚠️  S3 not configured - file uploads will not work");
}

export const s3 = s3Client;

export function buildCvKey(userId: string, originalName: string) {
    const safe = originalName.replace(/[^\w.\-]+/g, "_");
    return `cv/${userId}/${Date.now()}_${safe}`;
}

export async function uploadToS3(opts: {
    key: string;
    body: Buffer;
    contentType: string;
}) {
    if (!s3 || !BUCKET || !PUBLIC_BASE_URL) {
        throw new Error("S3 is not configured. Please set S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, and S3_PUBLIC_BASE_URL environment variables.");
    }

    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: opts.key,
            Body: opts.body,
            ContentType: opts.contentType,
        })
    );

    return {
        key: opts.key,
        url: `${PUBLIC_BASE_URL}/${opts.key}`,
    };
}
