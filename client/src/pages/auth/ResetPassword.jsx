import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import {
  Lock,
  ArrowLeft,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "react-toastify";
import authService from "../../services/AuthService";

const ResetPassword = () => {
  const { token } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  /* 🔐 Password rules */
  const rules = {
    minLength: password.length >= 6,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const allValid = Object.values(rules).every(Boolean);

  const onFinish = async (values) => {
    if (!allValid) {
      toast.error("Password does not meet all requirements");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, {
        password: values.password,
      });

      toast.success("Password reset successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(
        err?.message || "Reset link expired or invalid."
      );
    } finally {
      setLoading(false);
    }
  };

  const RuleItem = ({ valid, label }) => (
    <div className="flex items-center gap-2 text-sm">
      {valid ? (
        <CheckCircle className="text-green-600 w-4 h-4" />
      ) : (
        <XCircle className="text-red-500 w-4 h-4" />
      )}
      <span className={valid ? "text-green-700" : "text-gray-600"}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-6 sm:p-8 md:p-10">

        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800">
          Reset Your Password 🔐
        </h2>
        <p className="text-sm sm:text-base text-center text-gray-600 mt-2 mb-8">
          Create a strong password to secure your account
        </p>

        {/* Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          {/* LEFT: FORM */}
          <div>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="password"
                label="New Password"
                rules={[
                  { required: true, message: "Please enter a new password" },
                  () => ({
                    validator() {
                      return allValid
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Password does not meet requirements")
                          );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="New password"
                  prefix={<Lock className="w-4 h-4" />}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Confirm password"
                  prefix={<Lock className="w-4 h-4" />}
                />
              </Form.Item>

              <Button

                htmlType="submit"
                size="large"
                loading={loading}
                disabled={!allValid}
                className="w-full bg-[#672674] h-12 text-base sm:text-lg font-semibold rounded-lg"
              >
                Reset Password
              </Button>
            </Form>

            <div className="text-center mt-6">
              <Link
                to="/login"
                className="text-[#672674] font-medium flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </div>

          {/* RIGHT: PASSWORD RULES */}
          <div className="bg-gray-50 border rounded-lg p-4 sm:p-5">
            <p className="font-semibold text-gray-800 mb-3">
              Password must contain:
            </p>
            <div className="space-y-2">
              <RuleItem valid={rules.minLength} label="At least 6 characters" />
              <RuleItem valid={rules.lowercase} label="One lowercase letter" />
              <RuleItem valid={rules.uppercase} label="One uppercase letter" />
              <RuleItem valid={rules.number} label="One number" />
              <RuleItem valid={rules.special} label="One special character" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
