/* eslint-disable class-methods-use-this */
import IProject from '../iterfaces/IProjectModel';
import indexedDBrepository from '../infra/repository/indexedDBrepository';

class DashboardService {
  async upDate(data: IProject) {
    await indexedDBrepository.projectBasicUpdate(data);
  }

  async deleteProject() {
    await indexedDBrepository.deleteProject();
  }
}

const dashboardService = new DashboardService();

export default dashboardService;
