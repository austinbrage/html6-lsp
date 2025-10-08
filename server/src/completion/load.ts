import * as fs from 'fs';
import * as path from 'path';

export function loadTemplateTags(dir: string): string[] {
    const tags: string[] = [];

    function walk(currentDir: string) {
        let files: string[];
        try {
            files = fs.readdirSync(currentDir);
        } catch (err) {
            console.warn(`Failed to read the directory on "${currentDir}":`, err);
            return;
        }

        for (const file of files) {
            if (file.startsWith('.')) {
                continue;
            }

            const fullPath = path.join(currentDir, file);
            let stat: fs.Stats;
            try {
                stat = fs.statSync(fullPath);
            } catch {
                continue;
            }

            if (stat.isDirectory()) {
                const baseName = path.basename(fullPath);
                if (baseName === 'node_modules' || baseName === 'dist' || baseName === 'out') {
                    continue;
                }
                walk(fullPath);
            } else if (stat.isFile() && file.endsWith('.html')) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    const regex = /<template\s+[^>]*\bis\s*=\s*"(.*?)"[^>]*>/g;
                    let match: RegExpExecArray | null;
                    while ((match = regex.exec(content)) !== null) {
                        if (match[1]) {
                            tags.push(match[1]);
                        }
                    }
                } catch (err) {
                    console.warn(`Failed to read the file on "${fullPath}":`, err);
                }
            }
        }
    }

    walk(dir);
    return tags;
}
