import * as NewsProvider from '../Provider/NewsProvider.ts';
import { INewsRequestParams } from '../Types/NewsTypes.ts';

export class NewsService {
  // Kateqoriya və səhifə ilə xəbərlər siyahısını gətirir
  static async newsList(payload: INewsRequestParams) {
    return await NewsProvider.getNewsList(payload).then(res => res.data.articles);
  }

  // Başlığa görə axtarış edir və ilk uyğun xəbəri qaytarır
  static async searchNews(title: string) {
    return await NewsProvider.getSearchNews(title).then(res => res.data.articles[0]);
  }
}
