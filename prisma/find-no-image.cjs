const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { category: { slug: 'womens-fashion' } },
    include: { images: true }
  });

  for (const p of products) {
    if (!p.images || p.images.length === 0) {
      console.log('NO IMAGE:', p.name, '| slug:', p.slug, '| id:', p.id);
      // Delete the product
      await prisma.productImage.deleteMany({ where: { productId: p.id } });
      await prisma.product.delete({ where: { id: p.id } });
      console.log('DELETED:', p.name);
    }
  }

  console.log('Done. Remaining women fashion products:',
    await prisma.product.count({ where: { category: { slug: 'womens-fashion' } } }));

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
