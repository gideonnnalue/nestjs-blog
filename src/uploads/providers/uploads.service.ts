import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Upload } from '../upload.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { ConfigService } from '@nestjs/config';
import { UploadFile } from '../interfaces/upload-file.interface';
import { FileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,
  ) {}

  public async uploadFile(file: Express.Multer.File) {
    // throw error for unsupported MIME types
    if (
      !['image/jpg', 'image/png', 'image/jpeg', 'image/gif'].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException('Mime type not supported!');
    }

    try {
      // Upload the file to AWS S3
      const name = await this.uploadToAwsProvider.fileUpload(file);
      console.log(
        `${this.configService.get('appConfig.awsCloudfrontUrl')}/${name}`,
      );
      // Generate a new entry to the database
      const uploadFile: UploadFile = {
        name: name,
        path: `${this.configService.get('appConfig.awsCloudfrontUrl')}/${name}`,
        type: FileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };

      const upload = this.uploadsRepository.create(uploadFile);

      return await this.uploadsRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
