import * as fs from 'fs';
import * as path from 'path';

export class FileUtil {
  static ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  static getUploadPath(subfolder: string): string {
    const basePath = process.env.UPLOAD_PATH || './uploads';
    const fullPath = path.join(basePath, subfolder);
    this.ensureDirectoryExists(fullPath);
    return fullPath;
  }

  static saveFile(buffer: Buffer, filePath: string): void {
    this.ensureDirectoryExists(path.dirname(filePath));
    fs.writeFileSync(filePath, buffer);
  }

  static deleteFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  static getFileExtension(fileName: string): string {
    return path.extname(fileName).toLowerCase();
  }
}
