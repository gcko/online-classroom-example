import React from 'react';

function Tooltip(props) {
  return (
    <div className="tooltip fade bs-tooltip-right show" role="tooltip">
      <div className="arrow" />
      <div className="tooltip-inner">{props.children}</div>
    </div>
  );
}

export default Tooltip;
