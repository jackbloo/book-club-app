import { FastifyInstance } from 'fastify';
import { z } from 'zod';

export default async function (fastify: FastifyInstance) {
  const prisma = fastify.prisma;

  fastify.get('/', async () => {
    const authors = await prisma.author.findMany({ orderBy: { id: 'asc' } });
    return authors;
  });

  fastify.get('/:id', async (request, reply) => {
    const params = z.object({ id: z.coerce.number() }).parse(request.params);
    const author = await prisma.author.findUnique({ where: { id: params.id } });
    if (!author) return reply.status(404).send({ error: 'Author not found' });
    return author;
  });

  fastify.post('/', async (request, reply) => {
    const body = z.object({ name: z.string().min(1), bio: z.string().optional().nullable() }).parse(request.body);
    const author = await prisma.author.create({ data: { name: body.name, bio: body.bio ?? null } });
    return reply.status(201).send(author);
  });

  fastify.put('/:id', async (request, reply) => {
    const params = z.object({ id: z.coerce.number() }).parse(request.params);
    const body = z.object({ name: z.string().min(1), bio: z.string().optional().nullable() }).parse(request.body);
    try {
      const updated = await prisma.author.update({ where: { id: params.id }, data: { name: body.name, bio: body.bio ?? null } });
      return updated;
    } catch (e) {
      return reply.status(404).send({ error: 'Author not found' });
    }
  });

  fastify.delete('/:id', async (request, reply) => {
    const params = z.object({ id: z.coerce.number() }).parse(request.params);
    await prisma.author.delete({ where: { id: params.id } });
    return reply.status(204).send();
  });
}
