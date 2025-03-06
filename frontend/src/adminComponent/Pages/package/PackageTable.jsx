import { useState } from "react";
import { Collapse, Button, Typography, Tag, Space, Modal, InputNumber, message, Tooltip, Pagination } from "antd";
import { EditOutlined, DeleteOutlined, RightOutlined, ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Panel } = Collapse;
const { Title, Text } = Typography;

export default function PackageTable({ packages, navigate, deletePackage, setEditingPrice, setNewPrice }) {
  const [activeKeys, setActiveKeys] = useState([]);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [tempPrice, setTempPrice] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [categoryPage, setCategoryPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const categoriesPerPage = 5;

  const categorizedPackages = packages.reduce((acc, pkg) => {
    const category = pkg.packageCategoryName || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(pkg);
    return acc;
  }, {});

  const handlePriceClick = (pkg) => {
    setCurrentPackage(pkg);
    setTempPrice(pkg.price);
    setPriceModalVisible(true);
  };

  const handlePriceSave = () => {
    if (currentPackage) {
      setEditingPrice(currentPackage._id);
      setNewPrice(tempPrice);
      setPriceModalVisible(false);
      message.success("Price updated successfully");
    }
  };

  const handleCategoryPageChange = (page) => {
    setCategoryPage(page);
    setPagination({ ...pagination, current: 1 });
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      let valueA = a[sortColumn];
      let valueB = b[sortColumn];
      
      // Handle nested properties or special cases
      if (sortColumn === "status" || sortColumn === "price" || sortColumn === "serviceCategoryName") {
        valueA = valueA || "";
        valueB = valueB || "";
      }
      
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc" 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      } else {
        return sortDirection === "asc" 
          ? (valueA || 0) - (valueB || 0) 
          : (valueB || 0) - (valueA || 0);
      }
    });
  };

  const getPaginatedData = (data) => {
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return sortData(data).slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, current: page });
  };

  const categoryKeys = Object.keys(categorizedPackages);
  const paginatedCategories = categoryKeys.slice(
    (categoryPage - 1) * categoriesPerPage,
    categoryPage * categoriesPerPage
  );

  const columns = [
    { id: "id", header: "ID" },
    { id: "title", header: "Title" },
    { id: "status", header: "Status" },
    { id: "price", header: "Price" },
    { id: "serviceCategoryName", header: "Service Category" },
    { id: "actions", header: "Actions" }
  ];

  return (
    <div className="w-full mb-5 mt-4 space-y-4">
      <Collapse 
        expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 90 : 0} />} 
        activeKey={activeKeys} 
        onChange={setActiveKeys} 
        className="shadow-md rounded-lg"
      >
        {paginatedCategories.map((category) => (
          <Panel
            key={category}
            header={
              <div className="flex justify-between items-center w-full">
                <Title level={5} className="m-0">
                  {category}
                </Title>
                <Text type="secondary">{categorizedPackages[category].length} packages</Text>
              </div>
            }
            className="overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full mt-4 border-collapse">
                <thead className="bg-slate-700 text-white">
                  <tr>
                    {columns.map((column) => (
                      <th 
                        key={column.id}
                        onClick={() => column.id !== "actions" && handleSort(column.id)} 
                        className="py-2 px-4 border-b cursor-pointer uppercase"
                      >
                        <div className="flex items-center gap-2">
                          {column.header}
                          {column.id !== "actions" && (
                            sortColumn === column.id ? (
                              sortDirection === "asc" ? (
                                <ArrowUpOutlined />
                              ) : (
                                <ArrowDownOutlined />
                              )
                            ) : (
                              <ArrowDownOutlined className="text-gray-400" />
                            )
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedData(categorizedPackages[category]).map((pkg) => (
                    <tr key={pkg._id} className="border-b hover:bg-gray-100">
                      <td className="py-2 px-4 text-center">{pkg.id}</td>
                      <td className="py-2 px-4">
                        <Text 
                          className="cursor-pointer text-blue-500 hover:text-blue-700" 
                          onClick={() => navigate(`/package/editPackage/${pkg._id}`)}
                        >
                          {pkg.title}
                        </Text>
                      </td>
                      <td className="py-2 px-4 text-center">
                        <Tag color={pkg.status === "Active" ? "green" : "volcano"}>{pkg.status}</Tag>
                      </td>
                      <td className="py-2 px-4 text-center">
                        <Button type="link" onClick={() => handlePriceClick(pkg)}>
                          ₹{pkg.price}
                        </Button>
                      </td>
                      <td className="py-2 px-4 text-center">
                        {pkg.serviceCategoryName || "N/A"}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <Space size="middle">
                          <Tooltip title="Edit Package">
                            <Link to={`/package/editPackage/${pkg._id}`}>
                              <Button 
                                type="primary" 
                                shape="circle" 
                                icon={<EditOutlined />} 
                                size="small" 
                                className="bg-green-500 hover:bg-green-600" 
                              />
                            </Link>
                          </Tooltip>
                          <Tooltip title="Delete Package">
                            <Button
                              danger
                              shape="circle"
                              icon={<DeleteOutlined />}
                              size="small"
                              onClick={() => {
                                Modal.confirm({
                                  title: "Are you sure you want to delete this package?",
                                  content: "This action cannot be undone.",
                                  okText: "Yes, Delete",
                                  okType: "danger",
                                  cancelText: "Cancel",
                                  onOk() {
                                    deletePackage(pkg._id);
                                    message.success("Package deleted successfully");
                                  },
                                });
                              }}
                            />
                          </Tooltip>
                        </Space>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={categorizedPackages[category].length}
                onChange={handlePageChange}
                showSizeChanger
                onShowSizeChange={(current, size) => setPagination({ current: 1, pageSize: size })}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              />
            </div>
          </Panel>
        ))}
      </Collapse>

      <div className="flex justify-end items-center">
        <Pagination
          current={categoryPage}
          pageSize={categoriesPerPage}
          total={categoryKeys.length}
          onChange={handleCategoryPageChange}
          className="text-center mt-4"
        />
      </div>

      <Modal 
        title="Update Package Price" 
        open={priceModalVisible} 
        onCancel={() => setPriceModalVisible(false)} 
        onOk={handlePriceSave} 
        okText="Save" 
        cancelText="Cancel"
      >
        <div className="py-4">
          <Text>Package: {currentPackage?.title}</Text>
          <div className="mt-4">
            <Text>New Price (₹):</Text>
            <InputNumber 
              min={0} 
              precision={2} 
              value={tempPrice} 
              onChange={(value) => setTempPrice(value || 0)} 
              className="w-full mt-2" 
              prefix="₹" 
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}