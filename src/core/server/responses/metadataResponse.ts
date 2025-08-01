export function metadataResponse(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    isFirstPage: page === 1,
    isLastPage: page === Math.ceil(total / limit),
    firstPage: 1,
    lastPage: Math.ceil(total / limit),
  };
}
