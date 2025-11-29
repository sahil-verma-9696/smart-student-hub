import { BadRequestException } from '@nestjs/common';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import * as multer from 'multer';

export const multerOptions = {
  storage: memoryStorage(), // Use memory storage for processing in memory
  fileFilter: (req: any, file: multer.File, callback: any) => {
    // Accept only Excel files
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      return callback(
        new BadRequestException('Only Excel files (.xlsx, .xls) are allowed'),
        false,
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
};

export const multerDiskOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
    },
  }),
  fileFilter: (req: any, file: multer.File, callback: any) => {
    // Accept only Excel files
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      return callback(
        new BadRequestException('Only Excel files (.xlsx, .xls) are allowed'),
        false,
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
};
