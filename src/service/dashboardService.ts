/* eslint-disable class-methods-use-this */
import IProject from '../domain/projectModel';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class DashboardService {
  async upDate(data: IProject) {
    await indexedDBrepository.projectBasicUpdate(data);
  }
}

const dashboardService = new DashboardService();

export default dashboardService;
