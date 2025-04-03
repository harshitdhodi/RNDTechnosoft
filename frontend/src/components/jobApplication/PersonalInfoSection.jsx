"use client"

export default function PersonalInfoSection({ formData, onChange }) {

    const maritalStatusOptions = [
        { value: "Unmarried", label: "Unmarried" },
        { value: "Married", label: "Married" },
      ]
      

  return (
    <SectionCard title="Personal Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label="Full Name"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          placeholder="Enter your first name"
          required
        />
        <TextInput
          label="Date of Birth"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={onChange}
          required
        />
       
        <SelectInput
          label="Marital Status"
          name="maritalStatus"
          value={formData.maritalStatus}
          onChange={onChange}
          options={maritalStatusOptions}
        />
        <TextInput
          label="Mobile Number"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={onChange}
          placeholder="Enter your mobile number"
          required
        />
        <TextInput
          label="Current Location"
          name="currentLocation"
          value={formData.currentLocation}
          onChange={onChange}
          placeholder="Enter your current location"
        />
        <TextInput
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Enter your email address"
          required
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

function SelectInput({ label, name, value, onChange, options, required = false }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        required={required}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors duration-200"
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

