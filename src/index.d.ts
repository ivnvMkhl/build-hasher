/**
 * Configuration options for hashAssets function
 */
export interface HashAssetsOptions {
  /** Directory to search for files to hash */
  outputDir: string;
  /** File extensions to hash (e.g., ['.js', '.css']) */
  extensions: string[];
  /** Files to ignore during hashing */
  ignoredFiles?: string[];
}

/**
 * Configuration options for updateHashedLinks function
 */
export interface UpdateHashedLinksOptions {
  /** Manifest of original to hashed file mappings */
  hashManifest: Record<string, string>;
  /** Directory containing files to update */
  outputDir: string;
  /** File extensions to search for updates (default: ['.html']) */
  extensions?: string[];
  /** Additional files to update (by path) */
  files?: string[];
  /** Rules for replacing file paths in different file types */
  replaceRule?: Record<string, [string, string]>;
}

/**
 * Hashes files in the specified directory and returns a manifest of mappings
 * 
 * @param options - Configuration options
 * @returns Object mapping original filenames to hashed filenames
 * 
 * @example
 * ```javascript
 * const manifest = hashAssets({
 *   outputDir: './dist',
 *   extensions: ['.js', '.css'],
 *   ignoredFiles: ['vendor.js']
 * });
 * ```
 */
export function hashAssets(options: HashAssetsOptions): Record<string, string>;

/**
 * Updates file references in HTML and other files to use hashed filenames
 * 
 * @param options - Configuration options
 * 
 * @example
 * ```javascript
 * updateHashedLinks({
 *   hashManifest,
 *   outputDir: './dist',
 *   extensions: ['.html'],
 *   replaceRule: {
 *     '.html': ['src="', 'src="']
 *   }
 * });
 * ```
 */
export function updateHashedLinks(options: UpdateHashedLinksOptions): void;
