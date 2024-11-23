import { useState, useEffect } from 'react'

export default function TableFooter({ range, setPage, page, slice }) {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);

  return (
    <div>
      <button
          key='firstPage'
          /*className={`${styles.button} ${
            page === el ? styles.activeButton : styles.inactiveButton
          }`}*/
          onClick={() => setPage(1)}
        >
        {"<<"}
    </button>  
    <button
          key='prevPage'
          /*className={`${styles.button} ${
            page === el ? styles.activeButton : styles.inactiveButton
          }`}*/
          onClick={() => page==1 ? setPage(1) : setPage(page-1)}
        >
        {"<"}
    </button> 
      {range.map((r, index) => (
        <button
          key={index}
          /*className={`${styles.button} ${
            page === el ? styles.activeButton : styles.inactiveButton
          }`}*/
          onClick={() => setPage(r)}
        >
          {r}
        </button>
      ))}
      <button
          key='nextPage'
          /*className={`${styles.button} ${
            page === el ? styles.activeButton : styles.inactiveButton
          }`}*/
          onClick={() => page==range.length ? setPage(range.length) : setPage(page+1)}
        >
        {">"}
    </button> 
      <button
          key='lastPage'
          /*className={`${styles.button} ${
            page === el ? styles.activeButton : styles.inactiveButton
          }`}*/
          onClick={() => setPage(range.length)}
        >
        {">>"}
    </button> 
    </div>
  );
};

