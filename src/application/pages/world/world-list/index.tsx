import { useSelector } from 'react-redux';
import './world-list.css';
import { useEffect, useState } from 'react';
import IrootStateProject from '../../../../domain/IrootStateProject';
import IWorld from '../../../../domain/worldModel';
import NoData from '../../../components/no-dada';
import NotFound from '../../not-found';
import utils from '../../../../service/utils';

function WorldList() {
  const { projectData } = useSelector((state: IrootStateProject) => state.projectDataReducer);
  const [worldItens, setWorldItens] = useState<IWorld[]>([]);
  const [filtredWorldItens, setfiltredWorldItens] = useState<IWorld[]>([]);

  useEffect(() => {
    if (projectData.data?.world) {
      setWorldItens(projectData.data.world);
      setfiltredWorldItens(projectData.data.world);
    }
  }, [projectData.data?.world]);

  return (
    worldItens.length === 0 ? (
      <NoData dataType="personagens" />
    ) : (
      <div>
        <div className="amountInfoBar">
          <h3>
            Total
            {' '}
            {filtredWorldItens.length}
          </h3>
        </div>
        {filtredWorldItens.length === 0 ? (
          <NotFound />
        ) : (
          filtredWorldItens.map((worldItem) => (
            <button key={worldItem.id} type="button" className="listItens">
              <div className="listCard">
                <div>
                  <h3 className="cardListTitle">{worldItem.title}</h3>
                  <p className="categoryListItem">
                    {worldItem.category}
                  </p>
                  <p>{utils.abreviarString(worldItem.resume, 300)}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    )
  );
}

export default WorldList;
