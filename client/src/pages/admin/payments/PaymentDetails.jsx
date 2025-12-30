import { useEffect, useState } from "react";
import { Card, Button, Popconfirm, Tag } from "antd";
import { toast } from "react-toastify";
import paymentDetailsService from "../../../services/PaymentDetailsService";
import PaymentDetailsForm from "./PaymentDetailsForm";

const PaymentDetails = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await paymentDetailsService.getMyDetails();
      setData(res.data.data || res.data);
    } catch {
      setData(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (formData) => {
    try {
      setLoading(true);
      await paymentDetailsService.setupDetails(formData);
      toast.success(data ? "Payment updated successfully" : "Payment created successfully");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save payment details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      await paymentDetailsService.deactivate();
      toast.info("Payment deactivated");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to deactivate");
    }
  };

  const handleDelete = async () => {
    try {
      await paymentDetailsService.deleteDetails();
      toast.success("Payment deleted permanently");
      setData(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <Card
      title="Payment Details"
      extra={
        data && (
          <Tag color={data.isActive ? "green" : "red"}>
            {data.isActive ? "Active" : "Inactive"}
          </Tag>
        )
      }
    >
      <PaymentDetailsForm
        data={data}
        onSubmit={handleSave}
        loading={loading}
      />

      {data && (
        <div className="flex gap-3 mt-6">
          {data.isActive && (
            <Popconfirm
              title="Deactivate payment?"
              description="Users will not see this payment option"
              onConfirm={handleDeactivate}
            >
              <Button danger>Deactivate</Button>
            </Popconfirm>
          )}

          {!data.isActive && (
            <Popconfirm
              title="Delete permanently?"
              description="This cannot be undone"
              onConfirm={handleDelete}
            >
              <Button danger type="primary">
                Delete
              </Button>
            </Popconfirm>
          )}
        </div>
      )}
    </Card>
  );
};

export default PaymentDetails;
