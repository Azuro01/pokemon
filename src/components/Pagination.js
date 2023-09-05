import React from "react";
// Import the LeftArrow and RightArrow components from ArrowsSvg
import { LeftArrow, RightArrow } from "./ArrowsSvg";

const Pagination = (props) => {
  // Destructure props
  const { onLeftClick, onRightClick, page, totalPages } = props;

  return (
    <div className="pagination">
      <button className="pagination-btn" onClick={onLeftClick}>
        <div className="icon">
          <LeftArrow />
        </div>
      </button>
      <div>
        {page} de {totalPages}
      </div>
      <button className="pagination-btn" onClick={onRightClick}>
        <div className="icon">
          <RightArrow />
        </div>
      </button>
    </div>
  );
};

export default Pagination;
