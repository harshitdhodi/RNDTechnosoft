"use client"

export default function SalaryInfoSection({ formData, onChange }) {
  return (
    <SectionCard title="Salary Information">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TextInput
          label="Fixed Salary"
          name="fixedSalary"
          value={formData.fixedSalary}
          onChange={onChange}
          placeholder="Enter your fixed salary"
        />
        <TextInput
          label="Bonus | Incentive"
          name="bonusIncentive"
          value={formData.bonusIncentive}
          onChange={onChange}
          placeholder="Enter bonus/incentives"
        />
        <TextInput
          label="Total Salary"
          name="totalSalary"
          value={formData.totalSalary}
          onChange={onChange}
          placeholder="Enter total salary"
        />
        <TextInput
          label="Expected Salary"
          name="expectedSalary"
          value={formData.expectedSalary}
          onChange={onChange}
          placeholder="Enter expected salary"
        />
        <TextInput
          label="Notice Period"
          name="noticePeriod"
          value={formData.noticePeriod}
          onChange={onChange}
          placeholder="e.g., 30 days"
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

