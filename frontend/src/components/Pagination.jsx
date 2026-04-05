import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key="first" onClick={() => onPageChange(1)} className="pagination-btn">1</button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots-1" className="pagination-dot">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots-2" className="pagination-dot">...</span>);
      }
      pages.push(
        <button key="last" onClick={() => onPageChange(totalPages)} className="pagination-btn">{totalPages}</button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination-container animate-fade-in">
      <div className="pagination-group">
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="pagination-btn">
          <ChevronsLeft size={14} />
        </button>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="pagination-btn">
          <ChevronLeft size={16} />
        </button>
      </div>

      <div className="pagination-group">
        {renderPageNumbers()}
      </div>

      <div className="pagination-group">
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-btn">
          <ChevronRight size={16} />
        </button>
        <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="pagination-btn">
          <ChevronsRight size={14} />
        </button>
      </div>

      <div className="pagination-info">
        {currentPage} <span style={{ opacity: 0.3, margin: '0 4px' }}>/</span> {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
