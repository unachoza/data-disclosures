import React from 'react';
import './LoadSpinner.styles.scss';

const Loading = (): JSX.Element => {
    return <div className="load-spinner">{Array(12).fill(<div></div>)}</div>;
  };
export default Loading;