import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from 'src/pipe/file-size-validation.pip';

@Controller('file')
export class FileController {
  constructor() {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(new FileSizeValidationPipe()) file: Express.Multer.File,
  ) {
    console.log(file);
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files'))
  uploadMultipleFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }
}
