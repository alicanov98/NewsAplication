// API üçün xəbərlərin sorğu parametrləri
export interface INewsRequestParams {
  category: string; 
  page: number;     
}

// Bir xəbər (məqalə) strukturu
export interface IArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string; 
  content: string;
}

// API-dən gələn cavabın strukturu
export interface INewsResponseList {
  status: string;        
  totalResults: number;  
  articles: IArticle[];  
}
