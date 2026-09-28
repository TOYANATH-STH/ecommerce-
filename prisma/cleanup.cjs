const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { images: true }
  });

  const seenNames = {};
  const seenImages = {};
  const toDelete = [];

  for (const p of products) {
    // Check duplicate names (case-insensitive)
    const nameKey = p.name.toLowerCase().trim();
    if (seenNames[nameKey]) {
      toDelete.push({ product: p, reason: `duplicate name: ${p.name}` });
      continue;
    }
    seenNames[nameKey] = true;

    // Check duplicate primary image URLs
    const primaryImage = p.images.find(i => i.isPrimary) || p.images[0];
    if (primaryImage && seenImages[primaryImage.url]) {
      toDelete.push({ product: p, reason: `duplicate image: ${primaryImage.url}` });
      continue;
    }
    if (primaryImage) {
      seenImages[primaryImage.url] = true;
    }
  }

  console.log('Total products:', products.length);
  console.log('Duplicates found:', toDelete.length);

  if (toDelete.length > 0) {
    console.log('\nDuplicates to remove:');
    for (const d of toDelete) {
      console.log(` - ${d.product.name} [${d.reason}]`);
      await prisma.productImage.deleteMany({ where: { productId: d.product.id } });
      await prisma.product.delete({ where: { id: d.product.id } });
    }
    console.log('\nAll duplicates deleted.');
  } else {
    console.log('No duplicates found.');
  }

  const remaining = await prisma.product.count();
  console.log('Remaining products:', remaining);

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
