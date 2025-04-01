"use client"

export default function HealthBackgroundSection({ formData, onChange }) {
  return (
    <SectionCard title="Health and Background">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RadioGroup
          label="Do you have a history of any major illness?"
          name="majorIllness"
          value={formData.majorIllness}
          onChange={onChange}
        />
        <RadioGroup label="Do you smoke?" name="smoke" value={formData.smoke} onChange={onChange} />
        <RadioGroup label="Do you consume alcohol?" name="alcohol" value={formData.alcohol} onChange={onChange} />
        <RadioGroup
          label="Differently abled?"
          name="differentlyAbled"
          value={formData.differentlyAbled}
          onChange={onChange}
        />
       
      </div>
    </SectionCard>
  )
}

function RadioGroup({ label, name, value, onChange, required = false }) {
  return (
    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white transition-colors duration-200">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name={name}
            checked={value === "Yes"}
            onChange={() => onChange(name, "Yes")}
            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
          />
          <span className="ml-2">Yes</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name={name}
            checked={value === "No"}
            onChange={() => onChange(name, "No")}
            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
          />
          <span className="ml-2">No</span>
        </label>
      </div>
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

