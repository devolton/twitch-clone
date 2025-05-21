import {ArgumentMetadata, BadRequestException, Injectable, type PipeTransform} from "@nestjs/common";
import {ReadStream} from "fs";
import {validateFileFormat, validateFileSize} from "../utils/file.util";

@Injectable()
export class FileValidationPipe implements PipeTransform {
    private allowedFormats: string[] = ['jpg', 'png', 'jpeg', 'gif', 'webp'];
    private maxFileSize: number = 10 * 1024 * 1024;

    async transform(value: any, metadata: ArgumentMetadata) {
        if (!value.filename) {
            throw new BadRequestException(`File name ${value.filename} does not exist`);
        }
        const {filename, createReadStream} = value;
        const fileStream = createReadStream() as ReadStream;
        const isFileFormatValid = validateFileFormat(filename, this.allowedFormats);
        if (!isFileFormatValid) {
            throw new BadRequestException(`Invalid file format for ${filename}`);
        }
        const isFileSizeValid = await validateFileSize(fileStream, this.maxFileSize);
        if (!isFileSizeValid) {
            throw new BadRequestException(`File size exceeds 10 MB`);
        }
        return value;

    }
}