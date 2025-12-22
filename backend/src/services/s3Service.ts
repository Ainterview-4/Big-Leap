import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const REGION = process.env.S3_REGION!;
const BUCKET = process.env.S3_BUCKET!;
const PUBLIC_BASE_URL = process.env.S3_PUBLIC_BASE_URL!;

if (!REGION || !BUCKET || !PUBLIC_BASE_URL) {
    throw new Error("Missing S3 env vars");
}

export const s3 = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
});

export function buildCvKey(userId: string, originalName: string) {
    const safe = originalName.replace(/[^\w.\-]+/g, "_");
    return `cv/${userId}/${Date.now()}_${safe}`;
}

export async function uploadToS3(opts: {
    key: string;
    body: Buffer;
    contentType: string;
}) {
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
