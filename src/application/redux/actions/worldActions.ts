export const worldFilterTitleAction = (filter: string) => ({
  type: 'WORLD_FILTER_TITLE',
  payload: filter,
});

export const worldFilterCategoryAction = (filter: string) => ({
  type: 'WORLD_FILTER_CATEGORY',
  payload: filter,
});

export const worldFilterSortAction = (filter: boolean) => ({
  type: 'WORLD_FILTER_SORT',
  payload: filter,
});

export const worldFilterSortActionDirection = (filter: boolean) => ({
  type: 'WORLD_FILTER_SORT_DIRECTION',
  payload: filter,
});

export const worldClearState = () => ({
  type: 'CLEAR_STATE',
});
