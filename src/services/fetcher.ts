import { api } from "./api";

interface ImageProps {
  title:string,
  description:string,
  url:string,
  ts:number;
  id:string,
}

interface ResponsesProps {
  after:string,
  data : ImageProps[];
}


export const fetcher = async ({ pageParam = null}): Promise<ResponsesProps> => {
  const { data } = await api('/api/images',{
    params:{
      after: pageParam
    }
  })

  return data;
}