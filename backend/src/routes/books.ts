import { FastifyInstance } from 'fastify';
import { z } from 'zod';

export default async function (fastify: FastifyInstance) {
  const prisma = fastify.prisma;

  fastify.get('/', async () => {
    const books = await prisma.book.findMany({
      include: { author: true },
      orderBy: { id: 'asc' }
    });
    // map to include author_name for frontend convenience
    return books.map(b => ({ ...b, author_name: b.author?.name }));
  });

  fastify.get('/:id', async (request, reply) => {
    const params = z.object({ id: z.coerce.number() }).parse(request.params);
    const book = await prisma.book.findUnique({ where: { id: params.id }, include: { author: true } });
    if (!book) return reply.status(404).send({ error: 'Book not found' });
    return book;
  });

  fastify.post('/', async (request, reply) => {
    const body = z.object({
      title: z.string().min(1),
      author_id: z.coerce.number(),
      description: z.string().optional().nullable(),
      published_year: z.number().int().optional().nullable()
    }).parse(request.body);

    // check author exists
    const author = await prisma.author.findUnique({ where: { id: body.author_id } });
    if (!author) return reply.status(400).send({ error: 'Author not found' });

    const book = await prisma.book.create({
      data: {
        title: body.title,
        description: body.description ?? null,
        publishedYear: body.published_year ?? null,
        author: { connect: { id: body.author_id } }
      }
    });
    return reply.status(201).send(book);
  });

  fastify.put('/:id', async (request, reply) => {
    const params = z.object({ id: z.coerce.number() }).parse(request.params);
    const body = z.object({
      title: z.string().min(1),
      author_id: z.coerce.number(),
      description: z.string().optional().nullable(),
      published_year: z.number().int().optional().nullable()
    }).parse(request.body);

    try {
      const updated = await prisma.book.update({
        where: { id: params.id },
        data: {
          title: body.title,
          description: body.description ?? null,
          publishedYear: body.published_year ?? null,
          author: { connect: { id: body.author_id } }
        }
      });
      return updated;
    } catch (e) {
      return reply.status(404).send({ error: 'Book not found' });
    }
  });

  fastify.delete('/:id', async (request, reply) => {
    const params = z.object({ id: z.coerce.number() }).parse(request.params);
    await prisma.book.delete({ where: { id: params.id } });
    return reply.status(204).send();
  });
}
