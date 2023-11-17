export const charFilterTitleAction = (charFilter: string) => ({
  type: 'CHAR_FILTER_TITLE',
  payload: charFilter,
});

export const charFilterCategoryAction = (charFilter: string) => ({
  type: 'CHAR_FILTER_CATEGORY',
  payload: charFilter,
});

export const charFilterGenderAction = (charFilter: string) => ({
  type: 'CHAR_FILTER_GENDER',
  payload: charFilter,
});

export const charFilterSortAction = (charFilter: boolean) => ({
  type: 'CHAR_FILTER_SORT',
  payload: charFilter,
});
