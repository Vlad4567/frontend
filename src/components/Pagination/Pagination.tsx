import React, { useMemo } from 'react';
import { getPaginationItems } from '../../helpers/functions';
import { ArrowButton } from '../ArrowButton';
import { PaginationPageLink } from '../PaginationPageLink/PaginationPageLink';
import './Pagination.scss';

export interface Props {
  maxLength: number;
  currentPage: number;
  lastPage: number;
  setCurrentPage: (page: number) => void;
}

export const Pagination: React.FC<Props> = React.memo(
  ({ maxLength, currentPage, lastPage, setCurrentPage }) => {
    const pageNums = useMemo(() => {
      return getPaginationItems(currentPage, lastPage, maxLength);
    }, [currentPage, lastPage, maxLength]);

    return (
      <div className="pagination">
        <ArrowButton
          position="left"
          className={currentPage === 1 ? 'pagination__disabled' : ''}
          onClick={() => setCurrentPage(currentPage - 1)}
        />
        {pageNums.map(({ pageNum, id }) => (
          <PaginationPageLink
            key={id}
            active={currentPage === pageNum}
            disabled={Number.isNaN(pageNum)}
            onClick={() => setCurrentPage(pageNum)}
            className="pagination__page"
          >
            {!Number.isNaN(pageNum) ? pageNum : '...'}
          </PaginationPageLink>
        ))}
        <ArrowButton
          position="right"
          className={currentPage === lastPage ? 'pagination__disabled' : ''}
          onClick={() => setCurrentPage(currentPage + 1)}
        />
      </div>
    );
  },
);
Pagination.displayName = 'Pagination';
