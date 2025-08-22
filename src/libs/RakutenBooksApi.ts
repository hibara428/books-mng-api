import axios from 'axios';
import { RakutenSearchErrorResponse, RakutenSearchQueries, RakutenSearchResponse, RakutenSearchResponseItem } from '../types';
import { Prisma } from '@prisma/client';

const salesDateRegexp = new RegExp('d{4}年d{1,2}月d{1,2}日');

class RakutenBooksApi {
    private readonly baseUrl = 'https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404';
    private baseQueries: RakutenSearchQueries = {
        formatVersion: '2',
    };

    /**
     * Constructor.
     *
     * @param appId
     */
    constructor(appId: string) {
        this.baseQueries.applicationId = appId;
        this.baseQueries.elements = [
            'author',
            'authorKana',
            'isbn',
            'itemCaption',
            'itemPrice',
            'publisherName',
            'salesDate',
            'seriesName',
            'seriesNameKana',
            'size',
            'subTitle',
            'subTitleKana',
            'title',
            'titleKana',
        ].join(',');
    }

    /**
     * Search books with page number.
     *
     * @param queries
     * @param pageNumber
     * @returns
     */
    async search(queries: RakutenSearchQueries, pageNumber: number = 1): Promise<RakutenSearchResponse> {
        const clonedQueries = structuredClone(queries);
        clonedQueries.page = pageNumber;
        return await this.send(clonedQueries);
    }

    /**
     * Send the request.
     *
     * @param queries
     * @returns
     */
    private async send(queries: RakutenSearchQueries): Promise<RakutenSearchResponse> {
        const mergedQueries = { ...structuredClone(this.baseQueries), ...queries };
        const response = await axios.get(this.baseUrl, { params: mergedQueries });
        if (response.status !== 200) {
            const errorData = response.data as RakutenSearchErrorResponse;
            throw new RakutenBooksApiError(
                `Rakuten Books API error (${response.status}): ${errorData.error} ${errorData.error_description}`
            );
        }
        return response.data as RakutenSearchResponse;
    }
}

export const convertResponseItemToBook = (item: RakutenSearchResponseItem): Prisma.BookCreateInput => {
    const salesDate = convertSaleDateText(item.salesDate);
    if (salesDate === null) {
        throw new RakutenBooksApiError(`Failed to convert salesDate error: ${item.salesDate}`);
    }
    return {
        title: item.title,
        titleFurigana: item.titleKana,
        subtitle: item.subTitle,
        subtitleFurigana: item.subTitleKana,
        seriesName: item.seriesName,
        seriesNameFurigana: item.seriesNameKana,
        authorName: item.author,
        authorNameFurigana: item.authorKana,
        publisherName: item.publisherName,
        size: item.size,
        isbn: item.isbn,
        caption: item.itemCaption,
        salesDate: salesDate,
        salesDateText: item.salesDate,
        price: item.itemPrice,
    };
};

const convertSaleDateText = (saleDateText: string): Date | null => {
    const results = salesDateRegexp.exec(saleDateText);
    if (results && results.length >= 4) {
        return new Date(parseInt(results[1]), parseInt(results[2]) - 1, parseInt(results[3]));
    }
    return null;
};

export class RakutenBooksApiError extends Error {}
export default RakutenBooksApi;
