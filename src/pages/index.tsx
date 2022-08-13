/* eslint-disable prettier/prettier */
import { Button, Box } from "@chakra-ui/react";
import { useMemo } from "react";
import { useInfiniteQuery } from "react-query";
import { Header } from "../components/Header";
import { CardList } from "../components/CardList";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { fetcher } from "../services/fetcher";

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery("images", fetcher, {
    getNextPageParam: (lastPage) => lastPage?.after || null,
  });

  const formattedData = useMemo(() => {
    const responses = data?.pages.flatMap((response) => {
      return response.data.flat();
    });

    return responses;
  }, [data]);

  if (isLoading && !isError) {
    return <Loading />;
  }

  if (!isLoading && isError) {
    return <Error />;
  }

  console.log(data);
  console.log(formattedData);

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage &&(
          <Button
          onClick={()=> fetchNextPage()}
          disabled={isFetchingNextPage}
          mt="6"
          >
          {isFetchingNextPage ? 'Carregando': 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
