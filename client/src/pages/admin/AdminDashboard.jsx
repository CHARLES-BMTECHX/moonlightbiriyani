import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Spin, Progress } from "antd";
import {
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
  Star,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";
import dashboardService from "../../services/dashboardService";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getOverview();
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {/* TOP STATS */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={data.users.total}
              prefix={<Users size={18} />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={data.products.total}
              prefix={<Package size={18} />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={data.orders.total}
              prefix={<ShoppingCart size={18} />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={data.revenue.total}
              prefix={<IndianRupee size={18} />}
            />
          </Card>
        </Col>
      </Row>

      {/* SECOND ROW */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Today's Orders"
              value={data.orders.today}
              prefix={<ShoppingCart size={18} />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Today's Revenue"
              value={data.revenue.today}
              prefix={<IndianRupee size={18} />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Out of Stock"
              value={data.products.outOfStock}
              prefix={<AlertTriangle size={18} />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Avg Rating"
              value={data.reviews.averageRating.toFixed(1)}
              prefix={<Star size={18} />}
            />
          </Card>
        </Col>
      </Row>

      {/* ORDER STATUS BREAKDOWN */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={12}>
          <Card title="Orders by Status">
            {data.orders.byStatus.map((s) => (
              <div key={s._id} className="mb-2">
                <span className="capitalize">{s._id}</span>
                <Progress
                  percent={Math.round(
                    (s.count / data.orders.total) * 100
                  )}
                  size="small"
                />
              </div>
            ))}
          </Card>
        </Col>

        {/* PAYMENTS */}
        <Col xs={24} md={12}>
          <Card title="Payment Methods">
            {data.payments.methods.map((p) => (
              <div key={p._id} className="mb-2">
                <span>{p._id}</span>
                <Progress
                  percent={Math.round(
                    (p.count / data.orders.total) * 100
                  )}
                  size="small"
                />
              </div>
            ))}
            <div className="mt-3 text-sm text-gray-500">
              Screenshots Uploaded: {data.payments.screenshotsUploaded}
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminDashboard;
