import IProject from '../../../domain/projectModel';

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

export const projectDataAction = (project: IProject) => ({
  type: 'PROJECT_DATA',
  payload: project,
});

export const fetchProjectDataAction = (hasChange: boolean) => ({
  type: 'FECTCH_PROJECT_DATA',
  payload: hasChange,
});

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
