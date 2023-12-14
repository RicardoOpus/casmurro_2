import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import IProject from '../../../iterfaces/IProject';
import indexedDBrepository from '../../../infra/repository/indexedDBrepository';
import './printDraft.css';
import IManuscript from '../../../iterfaces/IManuscript';
import utils from '../../../service/utils';

function PrintDraft() {
  const [project, setProject] = useState<IProject>();
  const [manuscript, setManuscript] = useState<IManuscript[]>();
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  const updateDateTime = () => {
    const now = new Date();
    const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    setCurrentDateTime(formattedDateTime);
  };

  useEffect(() => {
    const fetchData = async () => {
      const projectItem = await indexedDBrepository.getCurrentProject();
      if (projectItem && projectItem.data?.manuscript) {
        setProject(projectItem);
        setManuscript(projectItem.data.manuscript);
        document.documentElement.classList.add('printMode');
      }
    };
    fetchData();
    updateDateTime();
  }, []);

  const parseItalicText = (text: string) => (
    text.split(/\*([^*]+)\*/g).map((part, index) => (
      index % 2 === 0 ? (
        <span key={uuidv4()}>{part}</span>
      ) : (
        <em key={uuidv4()}>{part}</em>
      )
    ))
  );

  const creatParagraphs = (text: string) => {
    const myString = utils.substituirAspasCurvas(text);
    const paragraphs = myString.split('\n');
    return paragraphs.map((e, index) => (
      <p key={uuidv4()} className={index === 1 ? 'firstParagraph' : 'sceneP'}>
        {parseItalicText(e)}
      </p>
    ));
  };

  const renderDraft = (draft: IManuscript[]) => (
    draft.map((e, index) => (
      <div key={uuidv4()}>
        {e.type === 'Capítulo' && <h2 className={index > 1 ? 'breakpagePrint' : ''}>{e.title}</h2>}
        {e.type === 'Cena'
          && (
            <div key={uuidv4()}>
              <h3 key={uuidv4()}>{e.title}</h3>
              {e.content && (
                creatParagraphs(e.content)
              )}
            </div>
          )}
      </div>
    ))
  );

  return (
    <div className="printBody">
      <div className="titlePrint">
        <h1>{project?.title}</h1>
        <h2>{project?.subtitle}</h2>
        <h3>{project?.author}</h3>
      </div>
      <div className="breakpagePrint" />
      <div className="pintDraftScenes">
        {manuscript && (
          renderDraft(manuscript)
        )}
        <h3>Fim</h3>
      </div>
      <div className="footerPrint">
        Generated by
        <a href="https://www.ricardoserafim.com.br/casmurro/">
          <img src="../casmurro-logo-small.svg" alt="Logo app" style={{ width: '120px' }} />
        </a>
        {currentDateTime}
      </div>
    </div>
  );
}

export default PrintDraft;
