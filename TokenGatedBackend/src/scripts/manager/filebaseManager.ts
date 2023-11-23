import path from 'path';
import fs from 'fs';

export const getFileList = async (dir: string) => {
    const files = fs.readdirSync(dir);
    return files.map((file) => path.join(dir, file));
};
