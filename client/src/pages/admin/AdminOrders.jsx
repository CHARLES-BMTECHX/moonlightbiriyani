import { useEffect, useState } from "react";
import { Table, Select, Input, Modal, Image, Button, Tag } from "antd";
import { Eye, RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import orderService from "../../services/orderService";

const { Option } = Select;

const STATUS_COLORS = {
  Pending: "orange",
  Paid: "blue",
  Verified: "cyan",
  Processing: "purple",
  Shipped: "geekblue",
  Delivered: "green",
  Cancelled: "red",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [statusFilter, setStatusFilter] = useState("");
  const [searchCode, setSearchCode] = useState("");

  const [imageModal, setImageModal] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders({
        page,
        limit: 10,
        status: statusFilter || undefined,
      });

      let filtered = data.orders;

      // 🔍 client-side uniqueCode filter
      if (searchCode) {
        filtered = filtered.filter((o) =>
          o.uniqueCode.toLowerCase().includes(searchCode.toLowerCase())
        );
      }

      setOrders(filtered);
      setTotal(data.total);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      toast.success("Order status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* ================= COLUMNS ================= */
  const columns = [
    {
      title: "Order Code",
      dataIndex: "uniqueCode",
      key: "uniqueCode",
      minWidth: 120, // Prevents squashing
      fixed: "left", // Optional: keeps code visible while scrolling
    },
    {
      title: "User",
      minWidth: 150,
      render: (_, r) => (
        <>
          <div className="font-medium">{r.user?.username || "Guest"}</div>
          <small className="text-gray-500">{r.user?.phone}</small>
        </>
      ),
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      minWidth: 100,
      render: (v) => <span className="font-semibold">₹{v}</span>,
    },
    {
      title: "Payment",
      dataIndex: "paymentMethod",
      minWidth: 120,
    },
    {
      title: "Status",
      minWidth: 160,
      render: (_, r) => (
        <Select
          value={r.status}
          size="small"
          onChange={(val) => handleStatusChange(r._id, val)}
          style={{ width: "100%" }}
          dropdownMatchSelectWidth={false}
        >
          {Object.keys(STATUS_COLORS).map((s) => (
            <Option key={s} value={s}>
              <Tag color={STATUS_COLORS[s]}>{s}</Tag>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Proof",
      minWidth: 80,
      align: "center",
      render: (_, r) =>
        r.paymentScreenshot ? (
          <Eye
            className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
            size={20}
            onClick={() => setImageModal(r.paymentScreenshot)}
          />
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      minWidth: 180,
      render: (v) => new Date(v).toLocaleString(),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Order Management</h2>

      {/* FILTERS - Responsive Layout */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Search Input */}
        <Input
          placeholder="Search Order Code"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          allowClear
          className="w-full md:w-[250px]"
        />

        {/* Status Filter */}
        <Select
          placeholder="Filter Status"
          allowClear
          value={statusFilter || undefined}
          onChange={(v) => setStatusFilter(v)}
          className="w-full md:w-[200px]"
        >
          {Object.keys(STATUS_COLORS).map((s) => (
            <Option key={s} value={s}>
              {s}
            </Option>
          ))}
        </Select>

        {/* Refresh Button */}
        <Button
          icon={<RefreshCcw size={16} />}
          onClick={() => {
            setSearchCode("");
            setStatusFilter("");
            fetchOrders();
          }}
          className="w-full md:w-auto flex justify-center items-center"
        >
          Reset
        </Button>
      </div>

      {/* TABLE - Horizontal Scroll Enabled */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={orders}
        loading={loading}
        // Critical for Mobile: 1000px scroll width
        scroll={{ x: 1000 }}
        pagination={{
          current: page,
          total,
          pageSize: 10,
          onChange: (p) => setPage(p),
          showSizeChanger: false, // Cleaner on mobile
          simple: window.innerWidth < 640, // Simple pagination on small screens
        }}
      />

      {/* Screenshot Modal */}
      <Modal
        open={!!imageModal}
        footer={null}
        onCancel={() => setImageModal(null)}
        width={500}
        centered
        className="top-4"
      >
        <p className="mb-2 font-semibold text-gray-700">Payment Screenshot</p>
        <div className="flex justify-center bg-gray-100 p-2 rounded">
            <Image
                src={imageModal}
                alt="Payment Screenshot"
                style={{ maxHeight: '80vh', objectFit: 'contain' }}
            />
        </div>
      </Modal>
    </div>
  );
};

export default AdminOrders;
