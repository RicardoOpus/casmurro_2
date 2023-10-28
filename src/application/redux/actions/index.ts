export const nextPage = () => ({
  type: 'NEXT_PAGE',
});

export const previousPage = () => ({
  type: 'PREVIOUS_PAGE',
});

export const totalPages = (pages: number) => ({
  type: 'TOTAL_PAGES',
  payload: pages,
});

export const currentPage = (page: number) => ({
  type: 'CURRENT_PAGE',
  payload: page,
});
