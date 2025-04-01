"use client"

export default function EmploymentInfoSection({ formData, onChange }) {
  return (
    <SectionCard title="Employment Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label="Current Organisation"
          name="currentOrganisation"
          value={formData.currentOrganisation}
          onChange={onChange}
          placeholder="Enter your current organisation"
        />
        <TextInput
          label="Current Designation"
          name="currentDesignation"
          value={formData.currentDesignation}
          onChange={onChange}
          placeholder="Enter your current designation"
        />
        <TextInput
          label="Whom do you report to? Designation"
          name="reportToDesignation"
          value={formData.reportToDesignation}
          onChange={onChange}
          placeholder="Enter reporting manager's designation"
        />
        <TextInput
          label="Name"
          name="reportToName"
          value={formData.reportToName}
          onChange={onChange}
          placeholder="Enter reporting manager's name"
        />
        <TextInput
          label="Number of people reporting to you"
          name="peopleReporting"
          value={formData.peopleReporting}
          onChange={onChange}
          type="number"
          placeholder="0"
        />
        <TextInput
          label="Total Experience"
          name="totalExperience"
          value={formData.totalExperience}
          onChange={onChange}
          placeholder="e.g., 5 years"
        />
      </div>
    </SectionCard>
  )
}

function TextInput({ label, name, value, onChange, type = "text", placeholder = "", required = false }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors duration-200"
      />
    </div>
  )
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="bg-gradient-to-r from-[#68580f] via-yellow-600 to-[#f3ca0d] px-6 py-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

