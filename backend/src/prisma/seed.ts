import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const a1 = await prisma.author.upsert({
    where: { name: 'Jane Austen' },
    update: {},
    create: { name: 'Jane Austen', bio: 'English novelist known for social commentary.' }
  })
  const a2 = await prisma.author.upsert({
    where: { name: 'Isaac Asimov' },
    update: {},
    create: { name: 'Isaac Asimov', bio: 'Science fiction writer and professor of biochemistry.' }
  })

  await prisma.book.upsert({
    where: { title: 'Pride and Prejudice' },
    update: {},
    create: {
      title: 'Pride and Prejudice',
      description: 'A classic novel about manners and marriage.',
      publishedYear: 1813,
      authorId: a1.id
    }
  })

  await prisma.book.upsert({
    where: { title: 'Foundation' },
    update: {},
    create: {
      title: 'Foundation',
      description: 'Science fiction series about the fall and rise of civilizations.',
      publishedYear: 1951,
      authorId: a2.id
    }
  })
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => process.exit(0))
