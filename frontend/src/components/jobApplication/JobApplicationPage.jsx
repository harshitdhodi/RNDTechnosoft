"use client"

import { useState } from "react"
import JobApplicationForm from "./JobApplicationForm"
import JobApplicationsTable from "./JobApplicationTable"

export default function JobApplicationsPage() {
  const [activeTab, setActiveTab] = useState("form")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Job Applications Portal</h1>
          <p className="mt-3 text-lg text-gray-500">Apply for a position or view existing applications</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                activeTab === "form" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("form")}
            >
              Application Form
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                activeTab === "table" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("table")}
            >
              View Applications
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="mt-6">{activeTab === "form" ? <JobApplicationForm /> : <JobApplicationsTable />}</div>
      </div>
    </div>
  )
}

