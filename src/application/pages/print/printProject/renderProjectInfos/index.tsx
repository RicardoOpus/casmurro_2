import IProject from '../../../../../interfaces/IProject';
import utils from '../../../../../service/utils';

function renderProjectInfos(projectItem: IProject) {
  return (
    <div>
      <hr className="dividerPrint" />
      {projectItem && (
        <div key={projectItem.id}>
          {projectItem.status && (
            <h3 className="fontBold">
              Status:
              {' '}
              <span>{projectItem.status}</span>
            </h3>
          )}
          {projectItem.literary_genre && (
            <h3 className="fontBold">
              Tipo literário:
              {' '}
              <span>{projectItem.literary_genre}</span>
            </h3>
          )}
          {projectItem.startDate && projectItem.finishDate && (
            <>
              <h3 className="fontBold">
                Data inícial:
                {' '}
                <span>{utils.convertDatePTBR(projectItem.startDate)}</span>
              </h3>
              <h3 className="fontBold">
                Data final:
                {' '}
                <span>{utils.convertDatePTBR(projectItem.finishDate)}</span>
              </h3>
            </>
          )}
          {projectItem.projectResume && (
            <>
              <h3 className="fontBold" style={{ marginTop: '1em' }}>Resumo:</h3>
              <p dangerouslySetInnerHTML={{ __html: projectItem.projectResume }} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default renderProjectInfos;
