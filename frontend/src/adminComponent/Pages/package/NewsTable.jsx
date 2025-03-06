import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import UseAnimations from "react-useanimations"
import loading from "react-useanimations/lib/loading"
import PackageDescription from "./PackageDescription"
import HeadingSection from "./HeadingSection"
import PackageFilters from "./PackageFilter"
import PackageTable from "./PackageTable"
import Pagination from "./Pegination"
import EditPriceModal from "./EditPrizeModel"
import ManagePackageTable from "./ManagepackageTable"
import NewsTable from "../PackageDescription"

const PackageMainComponent = () => {
  const [heading, setHeading] = useState("")
  const [subheading, setSubheading] = useState("")
  const [packages, setPackages] = useState([])
  const [loadings, setLoading] = useState(true)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [metaFilter, setMetaFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingPrice, setEditingPrice] = useState(null)
  const [newPrice, setNewPrice] = useState("")
  const navigate = useNavigate()
  const pageSize = 20

  const notify = (message) => {
    toast.success(message)
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/packages`, { withCredentials: true })
      const packagesWithIds = response.data.data.map((item, index) => ({
        ...item,
        id: pageIndex * pageSize + index + 1,
        categories: item.categories ? item.categories.join(", ") : "N/A",
        subcategories: item.subcategories ? item.subcategories.join(", ") : "N/A",
        subSubcategories: item.subSubcategories ? item.subSubcategories.join(", ") : "N/A",
        servicecategories: item.servicecategories ? item.servicecategories.join(", ") : "N/A",
        servicesubcategories: item.servicesubcategories ? item.servicesubcategories.join(", ") : "N/A",
        servicesubSubcategories: item.servicesubSubcategories ? item.servicesubSubcategories.join(", ") : "N/A",
      }))
      setPageCount(Math.ceil(response.data.total / pageSize))
      setPackages(packagesWithIds)
    } catch (error) {
      console.error("Error fetching packages:", error)
    } finally {
      setLoading(false)
    }
  }

  const deletePackage = async (id) => {
    try {
      await axios.delete(`/api/packages/delete?id=${id}`, { withCredentials: true })
      fetchData()
      notify("Package deleted successfully!")
    } catch (error) {
      console.error(error)
    }
  }

  const fetchHeadings = async () => {
    try {
      const response = await axios.get("/api/pageHeading/heading?pageType=package", { withCredentials: true })
      const { heading, subheading } = response.data
      setHeading(heading || "")
      setSubheading(subheading || "")
    } catch (error) {
      console.error(error)
    }
  }

  const saveHeadings = async () => {
    try {
      await axios.put(
        "/api/pageHeading/updateHeading?pageType=package",
        {
          pagetype: "news",
          heading,
          subheading,
        },
        { withCredentials: true },
      )
      notify("Headings updated successfully!")
    } catch (error) {
      console.error(error)
    }
  }

  const updatePrice = async () => {
    try {
      await axios.put(
        `/api/packages/updatePackage/${editingPrice}`,
        {
          price: newPrice,
        },
        { withCredentials: true },
      )
      setEditingPrice(null)
      fetchData()
      notify("Price updated successfully!")
    } catch (error) {
      console.error("Error updating price:", error)
    }
  }

  useEffect(() => {
    fetchData(pageIndex)
  }, [pageIndex])

  useEffect(() => {
    fetchHeadings()
  }, [])

  const getFilteredPackages = () => {
    return packages
      .filter((pkg) => {
        if (metaFilter === "Meta Available") {
          return (
            (pkg.metatitle && pkg.metatitle.length > 0) ||
            (pkg.metadescription && pkg.metadescription.length > 0)
          )
        }
        if (metaFilter === "Meta Unavailable") {
          return (
            !pkg.metatitle ||
            pkg.metatitle.length === 0 ||
            !pkg.metadescription ||
            pkg.metadescription.length === 0
          )
        }
        return true
      })
      .filter((pkg) => pkg.title.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  return (
    <div className="p-4 overflow-x-auto">
      <ToastContainer />
      
      <HeadingSection 
        heading={heading}
        subheading={subheading}
        setHeading={setHeading}
        setSubheading={setSubheading}
        saveHeadings={saveHeadings}
      />
      
      <PackageFilters 
        metaFilter={metaFilter}
        setMetaFilter={setMetaFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <h2 className="text-md font-semibold mb-4">Manage Package</h2>
      
      {loadings ? (
        <div className="flex justify-center">
          <UseAnimations animation={loading} size={56} />
        </div>
      ) : (
        <>
          {packages.length === 0 ? (
            <div className="flex justify-center items-center">
              <iframe
                className="w-96 h-96"
                src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"
              ></iframe>
            </div>
          ) : (
            <PackageTable 
              packages={getFilteredPackages()}
              navigate={navigate}
              deletePackage={deletePackage}
              setEditingPrice={setEditingPrice}
              setNewPrice={setNewPrice}
            />
          )}
        </>
      )}
      
      <NewsTable />
      {/* <ManagePackageTable /> */}
      {editingPrice && (
        <EditPriceModal 
          newPrice={newPrice}
          setNewPrice={setNewPrice}
          setEditingPrice={setEditingPrice}
          updatePrice={updatePrice}
        />
      )}
    </div>
  )
}

export default PackageMainComponent