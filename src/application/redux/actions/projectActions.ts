import IProject from '../../../iterfaces/IProjectModel';

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
