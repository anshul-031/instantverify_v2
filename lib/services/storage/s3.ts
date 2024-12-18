import { 
  S3Client, 
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageService, UploadResult, StorageError } from './types';
import { S3Config } from '@/lib/config/s3';
import { generateUniqueFilename } from './utils';
import logger from '@/lib/utils/logger';

export class S3StorageService implements StorageService {
  private s3Client: S3Client;

  constructor(private config: S3Config) {
    this.s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.credentials.accessKeyId,
        secretAccessKey: config.credentials.secretAccessKey,
      }
    });
  }

  async uploadFile(file: File, path: string): Promise<UploadResult> {
    try {
      logger.debug('Starting S3 upload', { path, fileName: file.name });

      const filename = generateUniqueFilename(file.name);
      const key = `${path}/${filename}`;

      // Convert File to Buffer for S3
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const command = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        Metadata: {
          originalname: file.name,
          timestamp: new Date().toISOString(),
        },
      });

      await this.s3Client.send(command);

      // Generate URL based on CloudFront or direct S3
      const url = this.config.cloudfrontUrl
        ? `${this.config.cloudfrontUrl}/${key}`
        : `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${key}`;

      logger.info('File uploaded successfully to S3', { 
        key,
        size: file.size,
        type: file.type 
      });

      return {
        url,
        key,
        filename,
        size: file.size,
        type: file.type,
      };
    } catch (error) {
      logger.error('S3 upload error:', error);
      throw new StorageError(
        'Failed to upload file to S3',
        'UPLOAD_FAILED',
        error as Error
      );
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      logger.debug('Deleting file from S3', { key });

      const command = new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      logger.info('File deleted successfully from S3', { key });
    } catch (error) {
      logger.error('S3 delete error:', error);
      throw new StorageError(
        'Failed to delete file from S3',
        'DELETE_FAILED',
        error as Error
      );
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      logger.debug('Generating signed URL for S3 object', { key, expiresIn });

      const command = new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      logger.debug('Generated signed URL', { key, expiresIn });
      
      return url;
    } catch (error) {
      logger.error('Failed to generate signed URL:', error);
      throw new StorageError(
        'Failed to generate signed URL',
        'URL_GENERATION_FAILED',
        error as Error
      );
    }
  }
}