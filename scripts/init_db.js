#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔗 Connecting to PostgreSQL database...');
    await client.connect();

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'migrations', '001_optimized_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('🚀 Running database optimizations...');
    console.log('   ✓ Adding UUID columns for stable IDs');
    console.log('   ✓ Creating voice search indexes');
    console.log('   ✓ Setting up full-text search with trigrams');
    console.log('   ✓ Building materialized search view');
    console.log('   ✓ Optimizing performance indexes');

    // Execute the migration
    await client.query(migrationSQL);

    console.log('✅ Database optimization completed successfully!');
    console.log('');
    console.log('🎯 Performance improvements:');
    console.log('   • Voice search: Lightning-fast JSONB + GIN indexes');
    console.log('   • Full-text search: tsvector with trigram fuzzy matching');
    console.log('   • Stable UUIDs: Future-proof item identification');
    console.log('   • Materialized views: Instant unified search');
    console.log('   • Covering indexes: Optimized for hot query paths');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

export { initializeDatabase };