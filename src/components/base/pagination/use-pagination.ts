import { useState } from "react";

export function usePagination(initialPage = 1) {
  const [page, setPage] = useState(initialPage);

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  return {
    page,
    setPage,
    nextPage,
    prevPage,
  };
}


/* 

const pagination = usePagination();

const { data } = useUsers({
  page: pagination.page,
});


<Pagination
  page={pagination.page}
  totalPages={data.meta.totalPages}
  onNext={pagination.nextPage}
  onPrev={pagination.prevPage}
/>

*/
