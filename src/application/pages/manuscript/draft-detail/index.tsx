import { SyntheticEvent, useState } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import './draft-detail.css';
import { useSelector } from 'react-redux';
import IrootStateProject from '../../../../domain/IrootStateProject';

function DraftDetail() {
  const [height, setHeight] = useState(300);
  // const [isLoading, setIsLoading] = useState(true);
  const manuscriptItens = useSelector((state: IrootStateProject) => (
    state.projectDataReducer.projectData.data?.manuscript));
  // const prjSettings = useSelector((state: IrootStateProject) => (
  //   state.projectDataReducer.projectData.projectSettings));
  const currentMItem = manuscriptItens?.find((e) => e.current === true);
  const onResize = (
    _e: SyntheticEvent<Element, Event>,
    data: ResizeCallbackData,
  ) => {
    if (data.size && Number(data.size.height) > 60) {
      setHeight(data.size.height);
    }
  };

  return (
    <Resizable className="resizableDraftDetail" width={600} height={height} onResize={onResize} handle={<div className="custom-handle-x" />}>
      <div className="innerContent" style={{ width: '100%', height: `${height}px` }}>
        <div style={{ overflow: 'scroll', height: `${height}px` }}>
          <h1>Draft DETAIL</h1>
          {currentMItem?.title}
          {' '}
          {currentMItem?.id}
          <p>Um parágrafo</p>
        </div>
      </div>
    </Resizable>
  );
}

export default DraftDetail;
