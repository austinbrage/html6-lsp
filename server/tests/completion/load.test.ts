import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { loadTemplateTags } from '../../src/completion/load';

vi.mock('fs');
vi.mock('path');

describe('loadTemplateTags', () => {
    const mockFs = fs as unknown as {
        readdirSync: ReturnType<typeof vi.fn>;
        statSync: ReturnType<typeof vi.fn>;
        readFileSync: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should collect template "is" attributes from .html files', () => {
        // 1. Mock directory structure (avoid infinite recursion)
        (fs.readdirSync as any).mockImplementation((dir: string) => {
            if (dir === '/root') {
                return ['file1.html', 'subdir'];
            }
            if (dir === '/root/subdir') {
                return ['nested.html'];
            }
            return [];
        });

        // 2. Mock file and directory stats
        (fs.statSync as any).mockImplementation((p: string) => {
            if (p.endsWith('.html')) {
                return { isDirectory: () => false, isFile: () => true };
            }
            return { isDirectory: () => true, isFile: () => false };
        });

        // 3. Mock file contents for .html files
        (fs.readFileSync as any).mockImplementation((file: string) => {
            if (file.endsWith('.html')) {
                return `
          <template is="custom-tag"></template>
          <template is="another-tag"></template>
        `;
            }
            throw new Error('Not an HTML file');
        });

        // 4. Mock path helpers (simplify path joining and basename)
        vi.spyOn(path, 'join').mockImplementation((...args) => args.join('/'));
        vi.spyOn(path, 'basename').mockImplementation((p) => p.split('/').pop() || '');

        // 5. Execute and verify result
        const tags = loadTemplateTags('/root');

        expect(tags).toEqual(['custom-tag', 'another-tag', 'custom-tag', 'another-tag']);
    });

    it('should skip node_modules, dist, and out directories', () => {
        mockFs.readdirSync.mockReturnValue(['node_modules', 'dist', 'out']);
        mockFs.statSync.mockReturnValue({ isDirectory: () => true } as any);

        const tags = loadTemplateTags('/root');
        expect(tags).toEqual([]);
    });

    it('should handle unreadable directories gracefully', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        mockFs.readdirSync.mockImplementation(() => {
            throw new Error('Permission denied');
        });

        expect(() => loadTemplateTags('/restricted')).not.toThrow();

        warnSpy.mockRestore();
    });
});
