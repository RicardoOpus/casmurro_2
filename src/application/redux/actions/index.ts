export const nextPageAction = () => ({
  type: 'NEXT_PAGE',
});

export const previousPageAction = () => ({
  type: 'PREVIOUS_PAGE',
});

export const totalPagesAction = (pages: number) => ({
  type: 'TOTAL_PAGES',
  payload: pages,
});

export const currentPageAction = (page: number) => ({
  type: 'CURRENT_PAGE',
  payload: page,
});
