import { Book, Prisma, PrismaClient, SearchCondition } from '@prisma/client';
import { RakutenSearchItem, RakutenSearchQueries } from '../types';
import RakutenBooksApi, { convertResponseItemToBook } from '../libs/RakutenBooksApi';

/**
 * NOTE: Can't use update because ISBN is "NOT" unique.
 */
export const upsertBook = async (prisma: PrismaClient, foundBook: Prisma.BookCreateInput): Promise<Book | null> => {
    const books = await findBooks(prisma, foundBook);
    if (books.length <= 0) {
        // Create a new record.
        return await prisma.book.create({
            data: foundBook,
        });
    }
    if (books.length === 1) {
        // Update the record.
        await prisma.book.update({
            data: foundBook,
            where: {
                id: books[0].id,
            },
        });
        return null;
    }

    throw new Error(`Multiple books found. Please check following books: ${JSON.stringify(books.map((book) => book.id))}.`);
};

export const findBooks = async (prisma: PrismaClient, bookData: Prisma.BookCreateInput): Promise<Book[]> => {
    return await prisma.book.findMany({
        where: {
            OR: [
                {
                    isbn: bookData.isbn,
                },
                {
                    AND: [
                        {
                            title: {
                                contains: bookData.title,
                            },
                            authorName: bookData.authorName,
                            publisherName: bookData.publisherName,
                        },
                    ],
                },
            ],
        },
    });
};

/**
 * Search books after limitDate.
 *
 * @param api
 * @param queries
 * @param limitDate
 * @returns
 */
export const searchBooksAfterDate = async (
    api: RakutenBooksApi,
    searchCondition: SearchCondition,
    limitDate: Date
): Promise<Prisma.BookCreateInput[]> => {
    const queries: RakutenSearchQueries = {
        sort: '-releaseDate',
    };
    if (searchCondition.type === 0) {
        queries.title = searchCondition.keyword;
    } else {
        queries.author = searchCondition.keyword;
    }

    // TODO: limitDate以前のデータまで再起的に取得する

    const data = await api.search(queries, 1);
    const books = data.Items.map((item) => convertResponseItemToBook(item.Item)).filter((book) => book.salesDate <= limitDate);
    if (books.length <= 0) {
        return [];
    }

    return books;
};
