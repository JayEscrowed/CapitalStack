/**
 * CAPITALSTACK Data Import Script
 * 
 * Imports buyer and contact data from CSV files into the database.
 * 
 * Usage:
 *   npx tsx scripts/import-data.ts --buyers ./data/hedgefunds.csv --contacts ./data/contacts.csv
 *   
 * Options:
 *   --buyers    Path to buyers CSV file
 *   --contacts  Path to contacts CSV file
 *   --clear     Clear existing data before import (default: false)
 *   --dry-run   Preview import without saving (default: false)
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface BuyerRow {
  company: string;
  category?: string;
  buyBox?: string;
  markets?: string;
  dealSize?: string;
  submitDeal?: string;
  email?: string;
  phone?: string;
  hq?: string;
  sourceUrl?: string;
}

interface ContactRow {
  linkedin?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  title?: string;
  company?: string;
}

function parseCSV<T>(content: string): T[] {
  const lines = content.split('\n');
  if (lines.length < 2) return [];

  // Parse header
  const headers = parseCSVLine(lines[0]);
  const rows: T[] = [];

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const row: any = {};

    headers.forEach((header, index) => {
      const key = header.trim().replace(/\s+/g, '');
      // Convert to camelCase
      const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
      row[camelKey] = values[index]?.trim() || null;
    });

    rows.push(row as T);
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);

  return values;
}

async function importBuyers(filePath: string, clearExisting: boolean, dryRun: boolean) {
  console.log(`\n📦 Importing buyers from: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const rows = parseCSV<BuyerRow>(content);
  
  console.log(`   Found ${rows.length} buyer records`);
  
  if (dryRun) {
    console.log('   [DRY RUN] Would import:');
    rows.slice(0, 5).forEach((row, i) => {
      console.log(`     ${i + 1}. ${row.company} (${row.category || 'No category'})`);
    });
    if (rows.length > 5) {
      console.log(`     ... and ${rows.length - 5} more`);
    }
    return rows.length;
  }

  if (clearExisting) {
    console.log('   Clearing existing buyers...');
    await prisma.savedBuyer.deleteMany();
    await prisma.buyer.deleteMany();
  }

  let imported = 0;
  let skipped = 0;

  for (const row of rows) {
    if (!row.company) {
      skipped++;
      continue;
    }

    try {
      await prisma.buyer.upsert({
        where: { 
          id: row.company.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 50)
        },
        update: {
          category: row.category || null,
          buyBox: row.buyBox || null,
          markets: row.markets || null,
          dealSize: row.dealSize || null,
          submitDeal: row.submitDeal || null,
          email: row.email || null,
          phone: row.phone || null,
          hq: row.hq || null,
          sourceUrl: row.sourceUrl || null,
          verified: true,
        },
        create: {
          company: row.company,
          category: row.category || null,
          buyBox: row.buyBox || null,
          markets: row.markets || null,
          dealSize: row.dealSize || null,
          submitDeal: row.submitDeal || null,
          email: row.email || null,
          phone: row.phone || null,
          hq: row.hq || null,
          sourceUrl: row.sourceUrl || null,
          verified: true,
        },
      });
      imported++;
    } catch (error) {
      console.error(`   Failed to import: ${row.company}`, error);
      skipped++;
    }
  }

  console.log(`   ✓ Imported: ${imported}, Skipped: ${skipped}`);
  return imported;
}

async function importContacts(filePath: string, clearExisting: boolean, dryRun: boolean) {
  console.log(`\n👥 Importing contacts from: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const rows = parseCSV<ContactRow>(content);
  
  console.log(`   Found ${rows.length} contact records`);
  
  if (dryRun) {
    console.log('   [DRY RUN] Would import:');
    rows.slice(0, 5).forEach((row, i) => {
      const name = `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'Unknown';
      console.log(`     ${i + 1}. ${name} at ${row.company || 'Unknown company'}`);
    });
    if (rows.length > 5) {
      console.log(`     ... and ${rows.length - 5} more`);
    }
    return rows.length;
  }

  if (clearExisting) {
    console.log('   Clearing existing contacts...');
    await prisma.savedContact.deleteMany();
    await prisma.contact.deleteMany();
  }

  // Get all buyers for linking
  const buyers = await prisma.buyer.findMany();
  const buyerMap = new Map(buyers.map(b => [b.company.toLowerCase(), b.id]));

  let imported = 0;
  let skipped = 0;
  let linked = 0;

  for (const row of rows) {
    if (!row.firstName && !row.lastName && !row.email) {
      skipped++;
      continue;
    }

    try {
      // Find matching buyer
      let buyerId: string | null = null;
      if (row.company) {
        const companyLower = row.company.toLowerCase();
        for (const [buyerCompany, id] of buyerMap) {
          if (companyLower.includes(buyerCompany) || buyerCompany.includes(companyLower)) {
            buyerId = id;
            linked++;
            break;
          }
        }
      }

      await prisma.contact.create({
        data: {
          firstName: row.firstName || null,
          lastName: row.lastName || null,
          fullName: `${row.firstName || ''} ${row.lastName || ''}`.trim() || null,
          email: row.email || null,
          title: row.title || null,
          linkedin: row.linkedin || null,
          company: row.company || null,
          buyerId,
          verified: true,
        },
      });
      imported++;
    } catch (error) {
      console.error(`   Failed to import: ${row.firstName} ${row.lastName}`, error);
      skipped++;
    }
  }

  console.log(`   ✓ Imported: ${imported}, Linked: ${linked}, Skipped: ${skipped}`);
  return imported;
}

async function main() {
  const args = process.argv.slice(2);
  
  const buyersFile = args[args.indexOf('--buyers') + 1];
  const contactsFile = args[args.indexOf('--contacts') + 1];
  const clearExisting = args.includes('--clear');
  const dryRun = args.includes('--dry-run');

  console.log('='.repeat(50));
  console.log('CAPITALSTACK Data Import');
  console.log('='.repeat(50));
  
  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - No data will be saved');
  }
  
  if (clearExisting && !dryRun) {
    console.log('⚠️  CLEAR MODE - Existing data will be removed');
  }

  let totalBuyers = 0;
  let totalContacts = 0;

  if (buyersFile && fs.existsSync(buyersFile)) {
    totalBuyers = await importBuyers(buyersFile, clearExisting, dryRun);
  } else if (buyersFile) {
    console.error(`\n❌ Buyers file not found: ${buyersFile}`);
  }

  if (contactsFile && fs.existsSync(contactsFile)) {
    totalContacts = await importContacts(contactsFile, clearExisting, dryRun);
  } else if (contactsFile) {
    console.error(`\n❌ Contacts file not found: ${contactsFile}`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Import Summary');
  console.log('='.repeat(50));
  console.log(`   Buyers: ${totalBuyers}`);
  console.log(`   Contacts: ${totalContacts}`);
  console.log('='.repeat(50));

  if (!buyersFile && !contactsFile) {
    console.log('\nUsage:');
    console.log('  npx tsx scripts/import-data.ts --buyers ./data/buyers.csv --contacts ./data/contacts.csv');
    console.log('\nOptions:');
    console.log('  --buyers    Path to buyers CSV file');
    console.log('  --contacts  Path to contacts CSV file');
    console.log('  --clear     Clear existing data before import');
    console.log('  --dry-run   Preview import without saving');
  }
}

main()
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
