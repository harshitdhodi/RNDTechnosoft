import React from "react"

const Pagination = ({ pageIndex, pageCount, setPageIndex }) => {
  return (
    <div className="mt-4 flex justify-center">
      <button
        onClick={() => setPageIndex(0)}
        disabled={pageIndex === 0}
        className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
      >
        {"<<"}
      </button>
      <button
        onClick={() => setPageIndex(pageIndex - 1)}
        disabled={pageIndex === 0}
        className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
      >
        {"<"}
      </button>
      <button
        onClick={() => setPageIndex(pageIndex + 1)}
        disabled={pageIndex + 1 >= pageCount}
        className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
      >
        {">"}
      </button>
      <button
        onClick={() => setPageIndex(pageCount - 1)}
        disabled={pageIndex + 1 >= pageCount}
        className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
      >
        {">>"}
      </button>
      <span>
        Page{" "}
        <strong>
          {pageIndex + 1} of {pageCount}
        </strong>{" "}
      </span>
    </div>
  )
}

export default Pagination