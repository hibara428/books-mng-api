import { Book, PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { Env } from '../types';
import { createUserBooks } from '../services/user';
import RakutenBooksApi from '../libs/RakutenBooksApi';
import { searchBooksAfterDate, upsertBook } from '../services/book';
import { addDay, format } from '@formkit/tempo';

export const performBookSearchQueue = async (env: Env) => {
    const prisma = new PrismaClient({ adapter: new PrismaD1(env.Bindings.DB), log: ['query'] });
    const api = new RakutenBooksApi(env.RAKUTEN_API_APP_KEY);
    const now = Date();

    try {
        // Get a first book search queue before today.
        const bookSearchQueue = await prisma.bookSearchQueue.findFirstOrThrow({
            include: {
                searchCondition: {
                    include: {
                        userSearchConditions: true,
                    },
                },
            },
            where: {
                startDate: { lte: format({ date: now, format: 'YYYY-MM-DD HH:MM:SS' }) },
            },
        });
        const searchCondition = bookSearchQueue.searchCondition;

        // Search books with the search condition after startDate.
        const bookDataList = await searchBooksAfterDate(api, searchCondition, bookSearchQueue.startDate);

        // Upsert Book records and get new inserted records.
        const newBooks: Book[] = [];
        for (let bookData of bookDataList) {
            const book = await upsertBook(prisma, bookData);
            if (book !== null) {
                newBooks.push(book);
            }
        }

        // Insert UserBook records if new books found.
        if (newBooks.length > 0) {
            for (let userSearchCondition of searchCondition.userSearchConditions) {
                await createUserBooks(prisma, newBooks, userSearchCondition.userId);
            }
        }

        // Dequeue and Enqueue for next time.
        await prisma.bookSearchQueue.delete({
            where: {
                id: bookSearchQueue.id,
            },
        });
        const newBookSearchQueue = await prisma.bookSearchQueue.create({
            data: {
                searchConditionId: searchCondition.id,
                startDate: format({ date: addDay(now), format: 'YYYY-MM-DD HH:MM:SS' }),
            },
        });

        // Output the next schedule.
        console.log(newBookSearchQueue);
    } catch (e: any) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
};
