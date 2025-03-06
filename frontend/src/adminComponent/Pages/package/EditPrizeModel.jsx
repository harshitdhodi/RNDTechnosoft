import React from "react"

const EditPriceModal = ({ newPrice, setNewPrice, setEditingPrice, updatePrice }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Edit Price</h2>
        <input
          type="number"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300 mb-4"
        />
        <div className="flex justify-end">
          <button
            onClick={() => setEditingPrice(null)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-300 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={updatePrice}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Update Price
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditPriceModal