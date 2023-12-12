import { useEffect, useState } from 'react';
import utils from '../../../../service/utils';
import './deadline.css';

interface GenericModalProps {
  startDateProject: string;
  finishDateProject: string;
}

function Deadline({ startDateProject, finishDateProject }: GenericModalProps) {
  const [percent, setPersent] = useState('');
  const [remains, setRemains] = useState('');

  const calcularProgresso = (startDate: string, finishDate: string) => {
    const ONE_DAY_IN_MS = 86400000; // quantidade de milissegundos em um dia
    const startDateMs = new Date(startDate).getTime();
    const finishDateMs = new Date(finishDate).getTime();
    if (finishDateMs < startDateMs) {
      setRemains('Prazo encerrado');
      return setPersent('100%');
    }
    const totalDurationMs = finishDateMs - startDateMs;
    const elapsedMs = Date.now() - startDateMs;
    const percentageElapsed = (elapsedMs / totalDurationMs) * 100;
    const percentElapsed = Math.round(percentageElapsed * 100) / 100;
    const daysRemaining = Math.ceil((finishDateMs - Date.now()) / ONE_DAY_IN_MS);
    if (daysRemaining < 0) {
      setRemains('Prazo encerrado');
    } else if (daysRemaining === 0) {
      setRemains('Último dia');
    } else {
      setRemains(`${daysRemaining} dias restantes`);
    }
    return setPersent(`${percentElapsed}%`);
  };

  useEffect(() => {
    calcularProgresso(startDateProject, finishDateProject);
  }, [finishDateProject, startDateProject]);

  return (
    <section className="sectionDeadline">
      <h3 style={{ marginBottom: '0px' }}>Progresso</h3>
      <div style={{ margin: '0px 25px' }}>
        <div id="daysRemaining" />
        <div className="datemarks">
          <div>▼ Data Inicial</div>
          <div style={{ fontSize: 'x-large' }}>{remains}</div>
          <div>Data Final ▼</div>
        </div>
        <div className="progress">
          <div style={{ width: percent }} className="bg-success" />
        </div>
        <div className="datemarks">
          <div>
            {utils.convertDatePTBR(startDateProject)}
          </div>
          <div>
            {utils.convertDatePTBR(finishDateProject)}
          </div>
        </div>
      </div>
      <div className="dashboard-divisor" />
    </section>
  );
}

export default Deadline;
