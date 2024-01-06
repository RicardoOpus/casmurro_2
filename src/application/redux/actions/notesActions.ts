export const notesFilterTitleAction = (filter: string) => ({
  type: 'NOTES_FILTER_TITLE',
  payload: filter,
});

export const notesFilterCategoryAction = (filter: string) => ({
  type: 'NOTES_FILTER_CATEGORY',
  payload: filter,
});

export const notesFilterSortAction = (filter: boolean) => ({
  type: 'NOTES_FILTER_SORT',
  payload: filter,
});

export const notesClearState = () => ({
  type: 'CLEAR_STATE',
});
