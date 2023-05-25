import React from 'react';

type Props = {
  children: React.ReactElement;
};

function Tooltip({ children }: Props) {
  return (
    <div className="tooltip fade bs-tooltip-right show" role="tooltip">
      <div className="arrow" />
      <div className="tooltip-inner">{children}</div>
    </div>
  );
}

export default Tooltip;
