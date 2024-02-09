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

export const charFilterCoreGroupAction = (charFilter: string) => ({
  type: 'CHAR_FILTER_CORE_GROUP',
  payload: charFilter,
});

export const charFilterSortAction = (charFilter: boolean) => ({
  type: 'CHAR_FILTER_SORT',
  payload: charFilter,
});

export const charFilterSortActionDirection = (charFilter: boolean) => ({
  type: 'CHAR_FILTER_SORT_DIRECTION',
  payload: charFilter,
});

export const charClearState = () => ({
  type: 'CLEAR_STATE',
});
