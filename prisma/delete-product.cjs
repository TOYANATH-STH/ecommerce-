const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.findUnique({
    where: { slug: 'cotton-anarkali-suit' },
    include: { images: true }
  });

  if (!product) {
    console.log('Product not found.');
  } else {
    console.log('Found:', product.name);
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.product.delete({ where: { id: product.id } });
    console.log('Deleted:', product.name);
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
