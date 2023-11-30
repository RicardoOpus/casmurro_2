import { SyntheticEvent, useState } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import './draft-detail.css';

function DraftDetail() {
  const [height, setHeight] = useState(300);

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
      <div className="" style={{ width: '100%', height: `${height}px` }}>
        <div style={{ overflow: 'scroll', height: `${height}px` }}>
          <h1>Draft DETAIL</h1>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
          <p>Um parágrafo</p>
        </div>
      </div>
    </Resizable>
  );
}

export default DraftDetail;
