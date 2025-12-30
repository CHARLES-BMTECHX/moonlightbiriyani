import { useEffect, useState } from "react";
import { Table, Button, Popconfirm } from "antd";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import productService from "../../../services/ProductService";
import ProductForm from "../../admin/products/ProductForm";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts();
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateUpdate = async (formData) => {
    try {
      setLoading(true);
      if (editData) {
        await productService.updateProduct(editData._id, formData);
        toast.success("Product updated");
      } else {
        await productService.createProduct(formData);
        toast.success("Product created");
      }
      setOpen(false);
      setEditData(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await productService.deleteProduct(id);
    toast.success("Product deleted");
    fetchProducts();
  };

  // --- RESPONSIVE COLUMNS ---
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      width: 80, // Fixed width for image column
      render: (img) => (
        <img
          src={img}
          className="w-12 h-12 rounded object-cover border border-gray-200"
          alt="product"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      minWidth: 150, // Prevents name from getting too squashed
    },
    {
      title: "Price",
      dataIndex: "price",
      minWidth: 100,
      render: (price) => `₹${price}`, // Optional formatting
    },
    {
      title: "Stock",
      dataIndex: "stock",
      minWidth: 80,
    },
    {
      title: "Actions",
      width: 100,
      fixed: "right", // Pins this column to the right on scroll
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            size="small"
            onClick={() => {
              setEditData(record);
              setOpen(true);
            }}
          >
            <Pencil size={14} className="text-blue-600" />
          </Button>

          <Popconfirm
            title="Delete product?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button size="small" danger>
              <Trash2 size={14} />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    // Adjusted padding: p-4 for mobile, p-6 for desktop
    <div className="p-4 md:p-6 bg-white rounded-xl shadow h-full flex flex-col">

      {/* HEADER: Flex column on mobile, Row on desktop */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Products</h2>

        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => setOpen(true)}
          // Full width on mobile, auto on desktop. Custom Purple Color.
          className="w-full md:w-auto bg-[#672674] hover:bg-[#551f60] flex items-center justify-center"
        >
          Add Product
        </Button>
      </div>

      {/* TABLE: Added scroll prop for horizontal scrolling on mobile */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={products || []}
        loading={loading}
        scroll={{ x: 700 }} // Enable horizontal scroll if width < 700px
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          simple: window.innerWidth < 600, // Simplified pagination on mobile
        }}
        className="overflow-hidden"
      />

      <ProductForm
        open={open}
        onClose={() => {
          setOpen(false);
          setEditData(null);
        }}
        onSubmit={handleCreateUpdate}
        initialData={editData}
      />
    </div>
  );
};

export default ProductList;
