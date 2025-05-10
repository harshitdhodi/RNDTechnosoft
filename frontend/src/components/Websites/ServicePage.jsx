import ServicesGrid from "./ServiceGrid"
import { mockServiceData } from "./MockServiceData"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ServicesGrid serviceData={mockServiceData} />
    </div>
  )
}
