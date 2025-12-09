import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample buyers data (full dataset would be imported from CSV)
const buyers = [
  {
    company: "Invitation Homes (NYSE: INVH)",
    category: "SFR Operator / REIT",
    buyBox: "Single-family rental homes; primarily in growth markets across West, South, Midwest; builder-direct and portfolios.",
    markets: "National (West, South, Midwest), Heavy Sun Belt Presence",
    dealSize: "Varies; builder-direct tranches and portfolios",
    submitDeal: "acquisitions@invitationhomes.com",
    email: "acquisitions@invitationhomes.com",
    phone: "+18773943399",
    hq: "Dallas, TX",
    sourceUrl: "https://www.invitationhomes.com/what-we-do/acquisitions",
    verified: true,
  },
  {
    company: "AMH (American Homes 4 Rent) (NYSE: AMH)",
    category: "SFR Operator / REIT (incl. BTR communities)",
    buyBox: "Purpose-built SFR communities and select acquisitions; Southeast, Midwest, Southwest, Mountain West.",
    markets: "National, Focus In SE, MW, SW, Mountain West",
    dealSize: "Community & portfolio scale",
    email: null,
    phone: "+10675675675",
    hq: "Calabasas, CA",
    sourceUrl: "https://communities.amh.com/",
    verified: true,
  },
  {
    company: "Progress Residential (Pretium)",
    category: "SFR Operator",
    buyBox: "Large-scale SFR acquisitions and operations across multiple states.",
    markets: "National SFR Footprint",
    dealSize: "Portfolios & scattered site",
    email: "govrelations@rentprogress.com",
    phone: "+18555135678",
    hq: "Scottsdale, AZ",
    sourceUrl: "https://rentprogress.com/about-us",
    verified: true,
  },
  {
    company: "Tricon Residential (NYSE: TCN) (Blackstone)",
    category: "SFR Operator",
    buyBox: "SFR acquisitions and operations; consumer programs (incl. HPA transition).",
    markets: "Sun Belt-Focused, National Footprint",
    dealSize: "Portfolios & scattered site",
    phone: "+18448742661",
    hq: "Toronto, ON / Tustin, CA (US HQ)",
    sourceUrl: "https://triconresidential.com/about/our-people/",
    verified: true,
  },
  {
    company: "FirstKey Homes (Cerberus)",
    category: "SFR Operator",
    buyBox: "SFR operations and acquisitions across multiple states.",
    markets: "National SFR Footprint",
    dealSize: "Scattered site & portfolios",
    phone: "+18333333333",
    hq: "Atlanta, GA",
    sourceUrl: "https://www.firstkeyhomes.com/contact-us",
    verified: true,
  },
  {
    company: "VineBrook Homes",
    category: "SFR Operator",
    buyBox: "Workforce SFR; buys single homes and portfolios; midwest-heavy markets.",
    markets: "Midwest & Heartland, Multi-State",
    dealSize: "Single homes to portfolios; all-cash closings",
    phone: "+18555135678",
    hq: "Cincinnati, OH",
    sourceUrl: "https://www2.vinebrookhomes.com/sell-your-home",
    verified: true,
  },
  {
    company: "Main Street Renewal (Amherst)",
    category: "SFR Operator",
    buyBox: "Amherst's SFR operating platform; large-scale SFR acquisitions historically.",
    markets: "Sun Belt & Midwest",
    dealSize: "Scattered site & portfolios",
    hq: "Austin, TX",
    sourceUrl: "https://www.mainstreetrenewal.com/contact",
    verified: true,
  },
  {
    company: "ResiBuilt Homes (BTR)",
    category: "Build-to-Rent (Developer/Operator)",
    buyBox: "BTR communities; actively buys land and partners with sellers/builders.",
    markets: "Southeast (GA And Neighboring States)",
    dealSize: "Land & BTR community-scale",
    email: "acquisitions@resibuilt.com",
    phone: "+16045454545",
    hq: "Atlanta, GA",
    sourceUrl: "https://www.resibuilt.com/",
    verified: true,
  },
  {
    company: "NexMetro (Avilla Homes)",
    category: "BTR Developer",
    buyBox: "BTR single-story Avilla communities; land partnerships.",
    markets: "AZ, TX, CO, FL & Other Growth Markets",
    dealSize: "Land / community scale",
    email: "Info@NexMetro.com",
    phone: "+16025599388",
    hq: "Phoenix, AZ",
    sourceUrl: "https://nexmetro.com/partnerships.php",
    verified: true,
  },
  {
    company: "Haven Realty Capital",
    category: "SFR / BTR Investor-Operator",
    buyBox: "Housing-focused acquisitions including BTR communities.",
    markets: "National, Sun Belt Emphasis",
    dealSize: "Community & portfolio scale",
    email: "info@havenrc.com",
    phone: "+12078947368",
    hq: "Los Angeles, CA",
    sourceUrl: "https://havenrc.com/investments/",
    verified: true,
  },
  {
    company: "Quinn Residences",
    category: "BTR Owner-Operator",
    buyBox: "Newly built SFR communities (BTR).",
    markets: "GA, FL, NC, SC, TN And Southeast",
    dealSize: "Community acquisitions",
    phone: "+13794871794",
    hq: "Atlanta, GA",
    sourceUrl: "https://live-quinn.com/contact/",
    verified: true,
  },
  {
    company: "Christopher Todd Communities",
    category: "BTR Platform",
    buyBox: "Single-story rental home communities; partnerships with builders/operators.",
    markets: "AZ, TX, FL And Other Sun Belt Markets",
    dealSize: "Community-scale",
    phone: "+12244186046",
    hq: "Scottsdale, AZ",
    sourceUrl: "https://www.christophertodd.com/",
    verified: true,
  },
  {
    company: "RangeWater Real Estate (Storia)",
    category: "BTR / Multifamily",
    buyBox: "BTR and multifamily; active land & community acquisitions.",
    markets: "Southeast, Texas, Mountain West",
    dealSize: "Land / community",
    phone: "+12112903225",
    hq: "Atlanta, GA",
    sourceUrl: "https://www.liverangewater.com/",
    verified: true,
  },
  {
    company: "Kairos Investment Management Company (KIMC)",
    category: "Workforce / Multifamily Investor",
    buyBox: "Value-based investments in workforce housing; preferred equity/JV; junior debt.",
    markets: "National",
    dealSize: "Middle-market MF",
    phone: "+15333333333",
    hq: "Newport Beach, CA",
    sourceUrl: "https://kimc.com/investment-criteria/",
    verified: true,
  },
  {
    company: "Morgan Properties",
    category: "Multifamily Owner-Operator",
    buyBox: "Large-scale multifamily acquisitions across US.",
    markets: "National",
    dealSize: "Portfolios & large assets",
    phone: "+18636363636",
    hq: "King of Prussia, PA",
    sourceUrl: "https://www.morganproperties.com/company/contact-us",
    verified: true,
  },
  {
    company: "Waterton",
    category: "Multifamily / Hospitality Investor",
    buyBox: "Value-add/core-plus multifamily acquisitions; nationwide.",
    markets: "National",
    dealSize: "Middle-market to institutional",
    hq: "Chicago, IL",
    sourceUrl: "https://waterton.com/contact/",
    verified: true,
  },
  {
    company: "GID (Windsor Communities)",
    category: "Multifamily Investor-Operator",
    buyBox: "Core/core-plus multifamily investments; select development.",
    markets: "Gateway & Growth Markets",
    dealSize: "Institutional-scale MF",
    phone: "+13410256410",
    hq: "Boston, MA",
    sourceUrl: "https://www.gid.com/",
    verified: true,
  },
  {
    company: "FCP (Federal Capital Partners)",
    category: "Multifamily / Mixed-Use Investor",
    buyBox: "Value-add MF; opportunistic strategies; JV equity.",
    markets: "East Coast & Sun Belt",
    dealSize: "Middle-market to institutional",
    email: "investments@fcpdc.com",
    hq: "Chevy Chase, MD",
    sourceUrl: "https://fcpdc.com/",
    verified: true,
  },
  {
    company: "TruAmerica Multifamily",
    category: "Multifamily Investor",
    buyBox: "Value-add B/C multifamily; institutional JV capital.",
    markets: "West, Southwest, Southeast",
    dealSize: "Middle-market MF (100+ units typical)",
    hq: "Los Angeles, CA",
    sourceUrl: "https://www.truamerica.com/",
    verified: true,
  },
  {
    company: "Bell Partners",
    category: "Multifamily Investor-Operator",
    buyBox: "Core/core-plus/value-add multifamily acquisitions.",
    markets: "National Focus Incl. Southeast, Texas",
    dealSize: "Institutional MF",
    phone: "+13362321900",
    hq: "Greensboro, NC",
    sourceUrl: "https://bellpartnersinc.com/contact/",
    verified: true,
  },
  {
    company: "Cortland",
    category: "Multifamily Investor-Operator",
    buyBox: "Value-add/core-plus MF acquisitions in high-growth metros.",
    markets: "26 US Markets",
    dealSize: "Institutional MF",
    phone: "+14049653988",
    hq: "Atlanta, GA",
    sourceUrl: "https://cortland.com/investors/",
    verified: true,
  },
  {
    company: "Greystar Investment Management",
    category: "Global Multifamily Investor-Operator",
    buyBox: "Acquisition & development of rental housing assets; global.",
    markets: "National & Global",
    dealSize: "Institutional MF & BTR",
    hq: "Charleston, SC",
    sourceUrl: "https://www.greystar.com/business/services/investment-management",
    verified: true,
  },
  {
    company: "Bridge Investment Group (NYSE: BRDG)",
    category: "Multifamily / Industrial / Net Lease",
    buyBox: "Multiple verticals incl. Multifamily WF/Affordable, Logistics, Net Lease.",
    markets: "National",
    dealSize: "Institutional scale; portfolios",
    phone: "+18017164500",
    hq: "Salt Lake City, UT",
    sourceUrl: "https://www.bridgeig.com/contact",
    verified: true,
  },
  {
    company: "RPM Living (Investments)",
    category: "Multifamily Operator / Investor",
    buyBox: "Acquisition & development of multifamily communities.",
    markets: "National",
    dealSize: "Middle-market to institutional",
    email: "investors@rpmliving.com",
    phone: "+12078947368",
    hq: "Austin, TX",
    sourceUrl: "https://rpmliving.com/business-services/investments/",
    verified: true,
  },
  {
    company: "Equity Residential (NYSE: EQR)",
    category: "Multifamily REIT",
    buyBox: "Urban/infill coastal & Sun Belt MF; see Buy/Build/Sell page.",
    markets: "Coastal + Select Sun Belt",
    dealSize: "Institutional MF",
    phone: "+18017164500",
    hq: "Chicago, IL",
    sourceUrl: "https://www.equityapartments.com/buybuildsell",
    verified: true,
  },
  {
    company: "AvalonBay Communities (NYSE: AVB)",
    category: "Multifamily REIT",
    buyBox: "Develop, redevelop and acquire MF communities in selected markets.",
    markets: "Coastal & High Barrier Markets",
    dealSize: "Institutional MF",
    phone: "+10303030303",
    hq: "Arlington, VA",
    sourceUrl: "https://investors.avalonbay.com/company-information",
    verified: true,
  },
  {
    company: "UDR, Inc. (NYSE: UDR)",
    category: "Multifamily REIT",
    buyBox: "Strategic acquisition of apartment communities in high-growth markets.",
    markets: "High-Growth US Metros",
    dealSize: "Institutional MF",
    phone: "+15363636363",
    hq: "Highlands Ranch, CO",
    sourceUrl: "https://www.udr.com/portfolio/acquisitions/",
    verified: true,
  },
  {
    company: "Camden Property Trust (NYSE: CPT)",
    category: "Multifamily REIT",
    buyBox: "Owns, develops, acquires MF communities; Sun Belt focused.",
    markets: "National Sun Belt",
    dealSize: "Institutional MF",
    email: "kcallahan@camdenliving.com",
    phone: "+17133542549",
    hq: "Houston, TX",
    sourceUrl: "https://investors.camdenliving.com/home/default.aspx",
    verified: true,
  },
  {
    company: "MAA (Mid-America Apartment Communities) (NYSE: MAA)",
    category: "Multifamily REIT",
    buyBox: "Owns and acquires apartment communities across SE & SW US.",
    markets: "Southeast & Southwest",
    dealSize: "Institutional MF",
    phone: "+18666201130",
    hq: "Germantown, TN",
    sourceUrl: "https://www.maac.com/contact-us/",
    verified: true,
  },
  {
    company: "Realty Income (NYSE: O)",
    category: "Net Lease REIT (Sale-Leaseback)",
    buyBox: "Freestanding, single-tenant net lease retail/industrial; sale-leasebacks; development.",
    markets: "All 50 States + UK & EU",
    dealSize: "Single assets & portfolios",
    phone: "+18779246266",
    hq: "San Diego, CA",
    sourceUrl: "https://www.realtyincome.com/what-we-do/acquisitions",
    verified: true,
  },
  {
    company: "W. P. Carey (NYSE: WPC)",
    category: "Net Lease REIT (Sale-Leaseback)",
    buyBox: "Sale-leasebacks, build-to-suits, existing net leases; US and Europe.",
    markets: "US & Europe",
    dealSize: "Single assets & portfolios",
    phone: "+12124921100",
    hq: "New York, NY",
    sourceUrl: "https://www.wpcarey.com/acquisitions/contact-the-team",
    verified: true,
  },
  {
    company: "Agree Realty (NYSE: ADC)",
    category: "Net Lease REIT",
    buyBox: "Acquisition & development of net lease retail; sale-leasebacks.",
    markets: "All 50 States",
    dealSize: "Single assets & portfolios",
    email: "acquisitions@agreerealty.com",
    phone: "+12487374190",
    hq: "Royal Oak, MI",
    sourceUrl: "https://agreerealty.com/acquire/",
    verified: true,
  },
  {
    company: "Prologis (NYSE: PLD)",
    category: "Industrial REIT",
    buyBox: "Logistics properties in global & US infill markets; acquisitions & development.",
    markets: "National & Global Logistics Hubs",
    dealSize: "Institutional industrial",
    email: "Prologis-IR@prologis.com",
    phone: "+16764705882",
    hq: "San Francisco, CA",
    sourceUrl: "https://www.prologis.com/contact-us",
    verified: true,
  },
  {
    company: "Link Logistics (Blackstone)",
    category: "Industrial Operator",
    buyBox: "U.S.-only industrial; last-mile logistics; acquisitions & development.",
    markets: "National (500M+ Sf)",
    dealSize: "Institutional industrial",
    phone: "+18333540003",
    hq: "New York, NY",
    sourceUrl: "https://www.linklogistics.com/contact/",
    verified: true,
  },
  {
    company: "Blackstone Real Estate (BREIT)",
    category: "Global Manager / Non-traded REIT",
    buyBox: "High-conviction sectors incl. rental housing, industrial, hospitality, data centers.",
    markets: "National & Global",
    dealSize: "Institutional",
    phone: "+17162162162",
    hq: "New York, NY",
    sourceUrl: "https://www.breit.com/",
    verified: true,
  },
];

// Sample contacts data
const contacts = [
  {
    firstName: "Brian",
    lastName: "Cohn",
    fullName: "Brian Cohn",
    email: "bcohn@fcpdc.com",
    title: "Chief Technology Officer",
    company: "FCP",
    linkedin: "https://www.linkedin.com/in/briantcohn",
    verified: true,
  },
  {
    firstName: "Bart",
    lastName: "Hurlbut",
    fullName: "Bart Hurlbut",
    email: "bhurlbut@fcpdc.com",
    title: "Senior Vice President at FCP",
    company: "FCP",
    linkedin: "https://www.linkedin.com/in/bart-hurlbut-aaa75715",
    verified: true,
  },
  {
    firstName: "Emily",
    lastName: "Rivers",
    fullName: "Emily Rivers",
    email: "erivers@fcpdc.com",
    title: "Senior Associate - Multifamily Acquisitions",
    company: "FCP",
    linkedin: "https://www.linkedin.com/in/emily-rivers-1201b08a",
    verified: true,
  },
  {
    firstName: "David",
    lastName: "Schwartz",
    fullName: "David Schwartz",
    email: "david.schwartz@waterton.com",
    title: "CEO and Chairman, Waterton",
    company: "Waterton",
    linkedin: "https://www.linkedin.com/in/david-schwartz-a866b597",
    verified: true,
  },
  {
    firstName: "Stephen",
    lastName: "Carlson",
    fullName: "Stephen Carlson",
    email: "stephen.carlson@waterton.com",
    title: "Executive Vice President, Capital Markets",
    company: "Waterton",
    linkedin: "https://www.linkedin.com/in/stephenbcarlson",
    verified: true,
  },
  {
    firstName: "Julie",
    lastName: "Heigel",
    fullName: "Julie Heigel",
    email: "julie.heigel@waterton.com",
    title: "Executive Vice President at Waterton",
    company: "Waterton",
    linkedin: "https://www.linkedin.com/in/heigeljulie",
    verified: true,
  },
  {
    firstName: "Greg",
    lastName: "Bates",
    fullName: "Greg Bates",
    email: "gbates@gid.com",
    title: "President & CEO at GID Investment Advisers, LLC",
    company: "GID",
    linkedin: "https://www.linkedin.com/in/greg-bates-164809b",
    verified: true,
  },
  {
    firstName: "Jeff",
    lastName: "Thompson",
    fullName: "Jeff Thompson",
    email: "jthompson@gid.com",
    title: "Managing Partner, President GID Credit",
    company: "GID",
    linkedin: "https://www.linkedin.com/in/jeff-thompson-2b31b657",
    verified: true,
  },
  {
    firstName: "Jason",
    lastName: "Morgan",
    fullName: "Jason Morgan",
    email: "jason.morgan@morganproperties.com",
    title: "Co-President of Morgan Properties",
    company: "Morgan Properties",
    linkedin: "https://www.linkedin.com/in/jason-morgan-67220a31",
    verified: true,
  },
  {
    firstName: "Jonathan",
    lastName: "Morgan",
    fullName: "Jonathan Morgan",
    email: "jmorgan@morgan-properties.com",
    title: "Managing Director & President",
    company: "Morgan Properties",
    linkedin: "https://www.linkedin.com/in/jonrmorgan",
    verified: true,
  },
  {
    firstName: "Greg",
    lastName: "Curci",
    fullName: "Greg Curci",
    email: "gcurci@morgan-properties.com",
    title: "Executive Vice President at Morgan Properties",
    company: "Morgan Properties",
    linkedin: "https://www.linkedin.com/in/gregcurci",
    verified: true,
  },
  {
    firstName: "Matt",
    lastName: "Harker",
    fullName: "Matt Harker",
    email: "mharker@morgan-properties.com",
    title: "Senior Vice President Asset Management",
    company: "Morgan Properties",
    linkedin: "https://www.linkedin.com/in/matt-harker-75501a8",
    verified: true,
  },
  {
    firstName: "Jonathan",
    lastName: "Needell",
    fullName: "Jonathan Needell",
    email: "jneedell@kimc.com",
    title: "President & Chief Investment Officer",
    company: "Kairos Investment Management Company",
    linkedin: "https://www.linkedin.com/in/jneedell",
    verified: true,
  },
  {
    firstName: "Justin",
    lastName: "Salvato",
    fullName: "Justin Salvato",
    email: "jsalvato@kimc.com",
    title: "Senior Partner at Kairos Investment Management Company",
    company: "Kairos Investment Management Company",
    linkedin: "https://www.linkedin.com/in/justin-salvato-8861a356",
    verified: true,
  },
  {
    firstName: "Hyosung",
    lastName: "Kang",
    fullName: "Hyosung Kang",
    email: "hk@kimc.com",
    title: "Investment Director",
    company: "Kairos Investment Management Company",
    linkedin: "https://www.linkedin.com/in/hskang",
    verified: true,
  },
  {
    firstName: "Jennifer",
    lastName: "Deason",
    fullName: "Jennifer Deason",
    email: "jdeason@triconresidential.com",
    title: "CEO / Public Board Member",
    company: "Home Partners of America",
    linkedin: "https://www.linkedin.com/in/jennifer-deason-8b451",
    verified: true,
  },
  {
    firstName: "Brad",
    lastName: "Nabors",
    fullName: "Brad Nabors",
    email: "bnabors@homepartners.com",
    title: "Chief People Officer",
    company: "Home Partners of America",
    linkedin: "https://www.linkedin.com/in/brad-nabors",
    verified: true,
  },
  {
    firstName: "Lisa",
    lastName: "Balderrama",
    fullName: "Lisa Balderrama",
    email: "lbalderrama@homepartners.com",
    title: "Vice President, Human Resources",
    company: "Home Partners of America",
    linkedin: "https://www.linkedin.com/in/lisa-balderrama-besthrhire",
    verified: true,
  },
];

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.savedContact.deleteMany();
  await prisma.savedBuyer.deleteMany();
  await prisma.searchHistory.deleteMany();
  await prisma.exportHistory.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.buyer.deleteMany();

  // Seed buyers
  console.log(`Seeding ${buyers.length} buyers...`);
  for (const buyer of buyers) {
    await prisma.buyer.create({
      data: buyer,
    });
  }
  console.log(`✓ Created ${buyers.length} buyers\n`);

  // Seed contacts
  console.log(`Seeding ${contacts.length} contacts...`);
  for (const contact of contacts) {
    await prisma.contact.create({
      data: contact,
    });
  }
  console.log(`✓ Created ${contacts.length} contacts\n`);

  // Link contacts to buyers where possible
  console.log('Linking contacts to buyers...');
  const allBuyers = await prisma.buyer.findMany();
  const allContacts = await prisma.contact.findMany();

  for (const contact of allContacts) {
    if (contact.company) {
      const matchingBuyer = allBuyers.find(
        (b) =>
          b.company.toLowerCase().includes(contact.company!.toLowerCase()) ||
          contact.company!.toLowerCase().includes(b.company.toLowerCase().split(' ')[0])
      );

      if (matchingBuyer) {
        await prisma.contact.update({
          where: { id: contact.id },
          data: { buyerId: matchingBuyer.id },
        });
      }
    }
  }
  console.log('✓ Linked contacts to buyers\n');

  // Summary
  const buyerCount = await prisma.buyer.count();
  const contactCount = await prisma.contact.count();
  const linkedContacts = await prisma.contact.count({ where: { buyerId: { not: null } } });

  console.log('='.repeat(50));
  console.log('📊 Seed Summary:');
  console.log(`   Buyers: ${buyerCount}`);
  console.log(`   Contacts: ${contactCount}`);
  console.log(`   Linked Contacts: ${linkedContacts}`);
  console.log('='.repeat(50));
  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
