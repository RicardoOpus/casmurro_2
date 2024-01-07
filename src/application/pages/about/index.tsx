import text from '../../../../public/locales/pt/translation.json';

function About() {
  return (
    <div className="innerContent">
      <div className="card">
        <h1>Informações</h1>
        <h2>{text.about.title}</h2>
        <div style={{ display: 'flex' }}>
          <img className="projectImage" src="images/ilustra-casmurro.jpg" alt="project illutration" />
          <div className="longtext" dangerouslySetInnerHTML={{ __html: text.about.text }} />
        </div>
        <h2>{text.about.title2}</h2>
        <div>
          <div className="longtext" dangerouslySetInnerHTML={{ __html: text.about.text2 }} />
          <a href="https://www.ricardoserafim.com.br" target="_blank" rel="noreferrer">https://www.ricardoserafim.com.br</a>
        </div>
      </div>
    </div>
  );
}

export default About;
