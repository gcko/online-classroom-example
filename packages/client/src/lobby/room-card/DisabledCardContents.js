import { Link } from 'react-router-dom';
import { XCircleFill } from 'react-bootstrap-icons';
import React from 'react';

function DisabledCardContents() {
  return (
    <div className="card-body row align-items-center">
      <p className="card-text col-10 mb-0 text-muted">
        Finalize room selection...
      </p>
      <Link
        to="/"
        role="button"
        aria-disabled="true"
        className="btn btn-outline-secondary disabled col-2"
      >
        <XCircleFill />
      </Link>
    </div>
  );
}

export default DisabledCardContents;
