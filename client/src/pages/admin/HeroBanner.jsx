import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Spin,
  Pagination,
} from "antd";
import { UploadCloud, Trash2, Pencil } from "lucide-react";
import { toast } from "react-toastify";

import {
  getHeroBanners,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
} from "../../services/HeroBannerApi";

const HeroBanner = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  /* ================= FETCH ================= */
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await getHeroBanners({ page, limit });
      setData(res.data || res);
      console.log(res.data,'banner');

      setTotal(res.pagination?.total || res.length || 0);
    } catch (err) {
      toast.error(err.message || "Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [page]);

  /* ================= SUBMIT ================= */
  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      if (values.bannerImage?.file) {
        formData.append("bannerImage", values.bannerImage.file);
      }

      setLoading(true);

      if (editingId) {
        await updateHeroBanner(editingId, formData);
        toast.success("Banner updated successfully");
      } else {
        await createHeroBanner(formData);
        toast.success("Banner created successfully");
      }

      form.resetFields();
      setEditingId(null);
      setModalOpen(false);
      fetchBanners();
    } catch (err) {
      toast.error(err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue({
      title: record.title,
    });
    setModalOpen(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await deleteHeroBanner(id);
      toast.success("Banner deleted");
      fetchBanners();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  /* ================= TABLE ================= */
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Banner",
      render: (_, record) => (
        <img
          src={`${record.bannerImage}`}
          alt="banner"
          className="w-32 h-16 object-cover rounded"
        />
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button onClick={() => handleEdit(record)} icon={<Pencil size={16} />} />
          <Button
            danger
            onClick={() => handleDelete(record._id)}
            icon={<Trash2 size={16} />}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Hero Banners</h2>
        <Button  className="bg-[#672674] text-white " onClick={() => setModalOpen(true)}>
          Add Banner
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="_id"
          pagination={false}
        />
      </Spin>

      <div className="flex justify-center mt-4">
        <Pagination
          current={page}
          pageSize={limit}
          total={total}
          onChange={(p) => setPage(p)}
        />
      </div>

      {/* MODAL */}
      <Modal
        open={modalOpen}
        title={editingId ? "Edit Banner" : "Add Banner"}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setEditingId(null);
        }}
        onOk={() => form.submit()}
        okText="Save"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="Enter banner title" />
          </Form.Item>

          <Form.Item
            label="Banner Image"
            name="bannerImage"
            rules={!editingId ? [{ required: true, message: "Image required" }] : []}
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              listType="picture"
            >
              <Button icon={<UploadCloud size={16} />}>
                Upload Image
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HeroBanner;
