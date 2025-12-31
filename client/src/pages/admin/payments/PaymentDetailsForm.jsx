import { Form, Input, Button, Upload, Spin } from "antd";
import { UploadCloud, Save } from "lucide-react";
import { useEffect, useState } from "react";

const PaymentDetailsForm = ({ data, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [qrFile, setQrFile] = useState(null);
  const [preview, setPreview] = useState("");

  const isEdit = !!data;

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        accountHolderName: data.accountHolderName,
        upiId: data.upiId,
        phone: data.phone,
      });
      setPreview(data.qrCodeImage);
    } else {
      form.resetFields();
      setPreview("");
      setQrFile(null);
    }
  }, [data, form]);

  const handleFinish = (values) => {
    const fd = new FormData();

    fd.append("accountHolderName", values.accountHolderName);
    fd.append("upiId", values.upiId);
    fd.append("phone", values.phone);

    // ✅ Only append file if user selected new one
    if (qrFile) {
      fd.append("qrCode", qrFile);
    }

    onSubmit(fd);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="max-w-3xl mx-auto" // Centers form on large screens
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Account Name */}
        <Form.Item
          name="accountHolderName"
          label="Account Holder Name"
          rules={[{ required: true, message: "Required" }]}
          className="md:col-span-2" // Spans full width
        >
          <Input size="large" placeholder="e.g. Moon Light briyani" />
        </Form.Item>

        {/* UPI ID */}
        <Form.Item
          name="upiId"
          label="UPI ID"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input size="large" placeholder="e.g. merchant@upi" />
        </Form.Item>

        {/* Phone */}
        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            { required: true, message: "Required" },
            { pattern: /^[0-9]{10}$/, message: "Must be 10 digits" },
          ]}
        >
          <Input size="large" maxLength={10} placeholder="9876543210" />
        </Form.Item>
      </div>

      {/* QR Code Upload Section */}
      <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 my-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Upload Button */}
          <Upload
            beforeUpload={(file) => {
              setQrFile(file);
              setPreview(URL.createObjectURL(file));
              return false;
            }}
            showUploadList={false}
            className="w-full sm:w-auto"
          >
            <Button
              icon={<UploadCloud size={18} />}
              size="large"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              {isEdit ? "Change QR Code" : "Upload QR Code"}
            </Button>
          </Upload>

          {/* Preview Image */}
          {preview && (
            <div className="relative">
              <img
                src={preview}
                alt="QR Preview"
                className="w-32 h-32 object-contain rounded border bg-white p-1"
              />
              <div className="text-xs text-center text-gray-500 mt-1">
                Preview
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Form.Item className="mt-6">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          disabled={loading}
          className="w-full bg-[#672674] hover:bg-[#551f60] h-12 text-lg font-medium flex items-center justify-center gap-2"
        >
          {loading ? (
            <Spin size="small" />
          ) : (
            <>
            <div className="flex gap-2 justify-center items-center ">
                <Save size={18} />
              {isEdit ? "Update Payment Details" : "Create Payment Details"}
            </div>
            </>
          )}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PaymentDetailsForm;
