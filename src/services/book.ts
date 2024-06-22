import { Book, Prisma, PrismaClient } from '@prisma/client';

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

export const convertRakutenApiResponse = async (response: any): Promise<Prisma.BookCreateInput[]> => {
    return [
        {
            title: 'タイトル１',
            titleFurigana: 'たいとるいち',
            subtitle: 'サブタイトルだよ',
            subtitleFurigana: 'さぶたいとるだよ',
            seriesName: 'シリーズ',
            seriesNameFurigana: 'しりーず',
            authorName: '著者名',
            authorNameFurigana: 'ちょしゃめい',
            publisherName: '出版社A',
            size: 'B5',
            isbn: 'BTDFJR3980',
            caption: 'キャプションです',
            salesDate: Date(),
            salesDateText: '今日',
            price: 1000,
        },
    ];
};
