import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client';
import { Context } from 'hono';
import { Env, userSearchConditionBody } from '../types';

/**
 * Get users.
 */
export const getUsers = async (ctx: Context<Env>) => {
    const prisma = new PrismaClient({ adapter: new PrismaD1(ctx.env.DB) });

    const email = ctx.req.query('email');
    if (email && !email.match(/.+@.+\..+/)) {
        return ctx.json({ result: false, message: 'Invalid request' }, 400);
    }

    try {
        let whereOptions = {};
        if (email) {
            whereOptions = {
                email: email,
            };
        }
        const users = await prisma.user.findMany({
            where: whereOptions,
        });
        if (users.length < 1) {
            return ctx.json({ result: false, message: 'Not found' }, 404);
        }
        return ctx.json({ result: true, message: 'ok', data: { users: users } }, 200);
    } catch (e: any) {
        console.error(e.message);
        return ctx.json({ result: false, message: e.message }, 500);
    } finally {
        await prisma.$disconnect();
    }
};

/**
 * Get user.
 */
export const getUser = async (ctx: Context<Env>) => {
    const prisma = new PrismaClient({ adapter: new PrismaD1(ctx.env.DB) });

    const userId = Number(ctx.req.param('userId'));
    if (!Number.isInteger(userId)) {
        return ctx.json({ result: false, message: 'Invalid request' }, 400);
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return ctx.json({ result: false, message: 'Not found' }, 404);
        }
        return ctx.json({ result: true, message: 'ok', data: user }, 200);
    } catch (e: any) {
        console.error(e.message);
        return ctx.json({ result: false, message: e.message }, 500);
    } finally {
        await prisma.$disconnect();
    }
};

/**
 * Get user books.
 */
export const getUserBooks = async (ctx: Context<Env>) => {
    const prisma = new PrismaClient({ adapter: new PrismaD1(ctx.env.DB) });

    const userId = Number(ctx.req.param('userId'));
    if (!Number.isInteger(userId)) {
        return ctx.json({ result: false, message: 'Invalid request' }, 400);
    }
    const month = Number(ctx.req.query('month'));
    if (!Number.isInteger(month)) {
        return ctx.json({ result: false, message: 'Invalid request' }, 400);
    }

    try {
        const userBooks = await prisma.userBook.findMany({
            where: {
                userId: userId,
                month: String(month),
            },
            include: {
                book: true,
            },
        });
        if (userBooks.length < 1) {
            return ctx.json({ result: false, message: 'Not found' }, 404);
        }
        const books = userBooks.map((userBook) => {
            return userBook.book;
        });
        return ctx.json({ result: true, message: 'ok', data: { books: books } }, 200);
    } catch (e: any) {
        console.error(e.message);
        return ctx.json({ result: false, message: e.message }, 500);
    } finally {
        await prisma.$disconnect();
    }
};

/**
 * Get user's search conditions.
 */
export const getUserSearchConditions = async (ctx: Context<Env>) => {
    const prisma = new PrismaClient({ adapter: new PrismaD1(ctx.env.DB) });

    const userId = Number(ctx.req.param('userId'));
    if (!Number.isInteger(userId)) {
        return ctx.json({ result: false, message: 'Invalid request' }, 400);
    }

    try {
        const userSearchConditions = await prisma.userSearchCondition.findMany({
            where: {
                userId: userId,
            },
            include: {
                searchCondition: true,
            },
        });
        if (userSearchConditions.length < 1) {
            return ctx.json({ result: false, message: 'Not found' }, 404);
        }
        return ctx.json({ result: true, message: 'ok', data: { searchConditions: userSearchConditions } }, 200);
    } catch (e: any) {
        console.error(e.message);
        return ctx.json({ result: false, message: e.message }, 500);
    } finally {
        await prisma.$disconnect();
    }
};

/**
 * Add the user's search conditions.
 */
export const addUserSearchCondition = async (ctx: Context<Env>) => {
    const prisma = new PrismaClient({ adapter: new PrismaD1(ctx.env.DB) });

    const userId = Number(ctx.req.param('userId'));
    if (!Number.isInteger(userId)) {
        return ctx.json({ result: false, message: 'Invalid request' }, 400);
    }
    const body = await ctx.req.json<userSearchConditionBody>();
    if (!body.type || !body.keyword) {
        return ctx.json({ error: 'Invalid request' }, 400);
    }
    const type = Number(body.type);
    if (!Number.isInteger(type)) {
        return ctx.json({ result: false, message: 'Invalid request' }, 400);
    }
    const keywordStr = String(body.keyword);

    try {
        let searchCondition = await prisma.searchCondition.findFirst({
            where: {
                type: type,
                keyword: keywordStr,
            },
        });
        if (!searchCondition) {
            searchCondition = await prisma.searchCondition.create({
                data: {
                    type: type,
                    keyword: keywordStr,
                },
            });
        }

        await prisma.userSearchCondition.create({
            data: {
                userId: userId,
                searchConditionId: searchCondition.id,
            },
        });
        return ctx.json({ result: true, message: 'ok', data: { searchCondition: searchCondition } }, 200);
    } catch (e: any) {
        console.error(e.message);
        return ctx.json({ result: false, message: e.message }, 500);
    } finally {
        await prisma.$disconnect();
    }
};

/**
 * Get the user's search condition.
 */
export const getUserSearchCondition = async (ctx: Context<Env>) => {
    const prisma = new PrismaClient({ adapter: new PrismaD1(ctx.env.DB) });

    const userId = Number(ctx.req.param('userId'));
    if (!Number.isInteger(userId)) {
        return ctx.json({ result: false, message: 'Invalid request' }, 400);
    }
    const searchConditionId = Number(ctx.req.param('searchConditionId'));
    if (!Number.isInteger(searchConditionId)) {
        return ctx.json({ result: false, message: 'Invalid request' }, 400);
    }

    try {
        const userSearchCondition = await prisma.userSearchCondition.findUnique({
            where: {
                id: searchConditionId,
            },
            include: {
                searchCondition: true,
            },
        });

        if (!userSearchCondition) {
            return ctx.json({ result: false, message: 'Not found' }, 404);
        }
        if (userSearchCondition.userId !== userId) {
            return ctx.json({ result: false, message: 'Invalid access' }, 401);
        }
        return ctx.json({ result: true, message: 'ok', data: { searchCondition: userSearchCondition } }, 200);
    } catch (e: any) {
        console.error(e.message);
        return ctx.json({ result: false, message: e.message }, 500);
    } finally {
        await prisma.$disconnect();
    }
};
