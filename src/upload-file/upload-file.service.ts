
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { extname, parse } from 'path';

import { createWriteStream, existsSync, mkdirSync } from 'fs';


@Injectable()
export class UploadFileService {

  saveImage(file: any, path: string) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    const { originalname, buffer } = file;
    if (!buffer || buffer.length === 0) {
      throw new Error('Empty file buffer');
    }
    const fileName = parse(originalname).name.replace(/\s/g, '_') + "_" + Date.now() + extname(file.originalname);
    
    const filePath =`${path}/${fileName}`;
    if (!existsSync(`./${path}`)) {
      mkdirSync(`./${path}`);
    }
    const fileStream = createWriteStream(filePath);
    fileStream.on('error', (error) => {
      throw error;
    });
    fileStream.write(buffer);
    fileStream.end();
    return filePath;
  }

  // delete file
  deleteFile(path: string) {
    try {
      fs.unlinkSync(path);
    } catch(err) {
      console.error(err)
    }
  }

  // replace file
  deleteAndAdd(oldFilePath: string, newFile: any, newPath: string) {
    this.deleteFile(oldFilePath);
    return this.saveImage(newFile, newPath);
  }
}
