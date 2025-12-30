import React, { useEffect, useState } from "react";
import { Table, Input, Popconfirm, Modal, Form, Button } from "antd";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/UserApi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form] = Form.useForm();

  /* ================= GET ================= */
  const fetchUsers = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res = await getUsers({ page, limit, search });

      setUsers(res?.data || []);
      setPagination({
        page,
        limit,
        total: res?.data?.pagination?.total || 0,
      });
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  /* ================= CREATE & UPDATE ================= */
  const handleSubmit = async (values) => {
    try {
      if (editUser) {
        await updateUser(editUser._id, values);
        toast.success("User updated");
      } else {
        await createUser(values);
        toast.success("User created");
      }

      setOpen(false);
      setEditUser(null);
      form.resetFields();

      await fetchUsers();
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Action failed";

      toast.error(msg);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      toast.success("User deleted");
      fetchUsers(pagination.page, pagination.limit);
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    { title: "Username", dataIndex: "username", minWidth: 120 },
    { title: "Email", dataIndex: "email", minWidth: 200 },
    { title: "Phone", dataIndex: "phone", minWidth: 120 },
    {
      title: "Actions",
      fixed: "right", // Keeps actions visible while scrolling
      width: 100,
      render: (_, record) => (
        <div className="flex gap-3">
          <Edit
            size={18}
            className="cursor-pointer text-blue-600"
            onClick={() => {
              setEditUser(record);
              form.setFieldsValue(record);
              setOpen(true);
            }}
          />
          <Popconfirm
            title="Delete this user?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Trash2 size={18} className="cursor-pointer text-red-600" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      {/* HEADER: Responsive Flex Layout */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Search Input - Full width on mobile, fixed width on desktop */}
        <Input.Search
          placeholder="Search users..."
          onSearch={(v) => setSearch(v)}
          className="w-full md:w-[300px]"
        />

        {/* Add Button - Full width on mobile, auto on desktop */}
        <Button
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#672674] text-white px-4 py-2 rounded hover:bg-[#551f60] !text-white"
          onClick={() => {
            setEditUser(null);
            form.resetFields();
            setOpen(true);
          }}
        >
          <Plus size={16} /> Add User
        </Button>
      </div>

      {/* TABLE: Added scroll prop for mobile handling */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={users}
        loading={loading}
        // Critical for Mobile: Enables horizontal scrolling
        scroll={{ x: 800 }}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          onChange: (page, pageSize) => {
            fetchUsers(page, pageSize);
          },
          // Make pagination responsive
          showSizeChanger: true,
          simple: window.innerWidth < 576, // Simple mode for very small screens
        }}
      />

      {/* MODAL */}
      <Modal
        title={editUser ? "Edit User" : "Add User"}
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editUser ? "Update" : "Create"}
        // Ensure Modal doesn't go off-screen on mobile
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Username */}
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Username is required" },
              { min: 3, message: "Username must be at least 3 characters" },
            ]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          {/* Phone */}
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Phone number is required" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Phone number must be 10 digits",
              },
            ]}
          >
            <Input placeholder="Enter phone number" maxLength={10} />
          </Form.Item>

          {/* Password – ONLY when creating */}
          {!editUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
