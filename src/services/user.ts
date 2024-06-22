import { Book, Prisma, PrismaClient } from '@prisma/client';

export const createUserBooks = async (prisma: PrismaClient, books: Book[], userId: number): Promise<void> => {
    const UserBooks = books.map((book): Prisma.UserBookCreateManyInput => {
        return {
            userId: userId,
            month: convertToMonthString(book.salesDate),
            bookId: book.id,
        };
    });
    if (UserBooks.length > 0) {
        await prisma.userBook.createMany({
            data: UserBooks,
        });
    }
};

const convertToMonthString = (date: Date): string => {
    return date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2);
};
