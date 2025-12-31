import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDir = join(__dirname, '..', '..', 'docs');
const targetDir = join(__dirname, '..', 'static', 'docs');

// Copy function
function copyRecursive(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }
  
  const entries = readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// Copy docs folder
try {
  if (existsSync(sourceDir)) {
    copyRecursive(sourceDir, targetDir);
    console.log('✅ Documentation copied to static/docs');
  } else {
    console.log('⚠️  Source docs folder not found');
  }
} catch (error) {
  console.error('❌ Error copying docs:', error.message);
}