import {
    PutObjectCommand,
    type PutObjectCommandInput,
    type DeleteObjectCommandInput,
    S3Client, DeleteObjectCommand
} from '@aws-sdk/client-s3';
import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class StorageService {
    private readonly client: S3Client;
    private readonly bucketName: string;

    constructor(private readonly configService: ConfigService) {
        this.client = new S3Client({
            endpoint: this.configService.getOrThrow<string>("S3_ENDPOINT"),
            region: this.configService.getOrThrow<string>("S3_REGION"),
            credentials: {
                accessKeyId: this.configService.getOrThrow<string>("S3_ACCESS_TOKEN"),
                secretAccessKey: this.configService.getOrThrow<string>('S3_SECRET_ACCESS_TOKEN')
            }

        });
        this.bucketName = configService.getOrThrow<string>("S3_BUCKET_NAME");
    }

    async upload(buffer: Buffer, key: string, mimetype: string) {
        const command: PutObjectCommandInput = {
            Bucket: this.bucketName,
            Key: String(key),
            Body: buffer,
            ContentType: mimetype
        };
        try {
            await this.client.send(new PutObjectCommand(command));
        } catch (err) {
            throw new InternalServerErrorException("Error uploading file", err);
        }
    }

    async remove(key: string) {
        const command: DeleteObjectCommandInput = {
            Bucket: this.bucketName,
            Key: String(key)
        };
        try {
            await this.client.send(new DeleteObjectCommand(command));
        } catch (err) {
            throw new InternalServerErrorException("Error deleting file", err);

        }
    }
}
