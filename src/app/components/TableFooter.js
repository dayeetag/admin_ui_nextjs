import { useState, useEffect } from 'react'
import styles from "./TableFooter.module.css";

export default function TableFooter({ range, setPage, page, slice }) {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);

  return (
    <div>
      <button
          key='first-page'
          className={`${styles.button} ${styles.firstPage}`}
          onClick={() => setPage(1)}
        >
        {"<<"}
    </button>  
    <button
          key='previous-page'
          className={`${styles.button} ${styles.previousPage}`}
          onClick={() => page==1 ? setPage(1) : setPage(page-1)}
        >
        {"<"}
    </button> 
      {range.map((r, index) => (
        <button
          key={index}
          className={`${styles.button} ${
            page === r ? styles.activeButton : styles.inactiveButton
          }`}
          onClick={() => setPage(r)}
        >
          {r}
        </button>
      ))}
      <button
          key='next-page'
          className={`${styles.button} ${styles.nextPage}`}
          onClick={() => page==range.length ? setPage(range.length) : setPage(page+1)}
        >
        {">"}
    </button> 
      <button
          key='last-page'
          className={`${styles.button} ${styles.lastPage}`}
          onClick={() => setPage(range.length)}
        >
        {">>"}
    </button> 
    </div>
  );
};

