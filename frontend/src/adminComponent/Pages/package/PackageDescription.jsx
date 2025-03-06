import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

const PackageDescription = () => {
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchDescription = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/api/pageDescription/description?pageType=package", { 
        withCredentials: true 
      })
      setDescription(response.data.description || "")
    } catch (error) {
      console.error("Error fetching description:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveDescription = async () => {
    try {
      await axios.put(
        "/api/pageDescription/updateDescription?pageType=package",
        {
          pagetype: "package",
          description
        },
        { withCredentials: true }
      )
      toast.success("Description updated successfully!")
    } catch (error) {
      console.error("Error updating description:", error)
      toast.error("Failed to update description")
    }
  }

  useEffect(() => {
    fetchDescription()
  }, [])

  return (
    <div className="mt-8 border border-gray-200 shadow-lg p-4 rounded">
      <h2 className="text-lg font-bold mb-4 text-gray-700 font-serif uppercase">Package Description</h2>
      <div className="mb-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
          rows={5}
          placeholder="Enter package description..."
        />
      </div>
      <button
        onClick={saveDescription}
        disabled={loading}
        className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif"
      >
        {loading ? "Saving..." : "Save Description"}
      </button>
    </div>
  )
}

export default PackageDescription