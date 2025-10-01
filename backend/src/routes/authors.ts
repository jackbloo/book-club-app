import { FastifyInstance } from 'fastify';
import { z, ZodError } from 'zod';

export default async function (fastify: FastifyInstance) {
  const prisma = fastify.prisma;

  // 🔑 Centralized error handling
  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid request data',
        details: error.errors,
      });
    }

    console.error(error); // log unexpected errors
    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  });

  fastify.get('/', async () => {
    return prisma.author.findMany({ orderBy: { id: 'asc' } });
  });

  fastify.get('/:id', async (request, reply) => {
    const params = z.object({ id: z.coerce.number() }).parse(request.params);
    const author = await prisma.author.findUnique({ where: { id: params.id } });
    if (!author) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Author not found',
      });
    }
    return author;
  });

  fastify.post('/', async (request, reply) => {
    const body = z.object({
      name: z.string().min(1),
      bio: z.string().optional().nullable(),
    }).parse(request.body);

    const author = await prisma.author.create({
      data: { name: body.name, bio: body.bio ?? null },
    });

    return reply.status(201).send(author);
  });

  fastify.put('/:id', async (request, reply) => {
    const params = z.object({ id: z.coerce.number() }).parse(request.params);
    const body = z.object({
      name: z.string().min(1),
      bio: z.string().optional().nullable(),
    }).parse(request.body);

    try {
      const updated = await prisma.author.update({
        where: { id: params.id },
        data: { name: body.name, bio: body.bio ?? null },
      });
      return updated;
    } catch {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Author not found',
      });
    }
  });

  fastify.delete('/:id', async (request, reply) => {
    const params = z.object({ id: z.coerce.number() }).parse(request.params);

    const result = await prisma.author.deleteMany({ where: { id: params.id } });

    if (result.count === 0) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Author not found',
      });
    }

    return reply.status(204).send();
  });
}
