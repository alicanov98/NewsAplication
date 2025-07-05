import $axios from '../../../api/accessor.ts';
import { $api } from '../../../api/api.ts';
import { INewsRequestParams, INewsResponseList } from '../Types/NewsTypes.ts';

// Xəbərlər siyahısını əldə edən funksiya
export const getNewsList = async (payload: INewsRequestParams) => {
  return await $axios.get<INewsResponseList>(
    $api('get_all_news', {
      q: payload.category,
      language: 'en',
      page: payload.page,
      pageSize: 5,
    }),
  );
};

// Axtarış əsasında xəbərləri əldə edən funksiya
export const getSearchNews = async (title: string) => {
  return await $axios.get<INewsResponseList>(
    $api('get_search_news', {
      title,
    }),
  );
};
