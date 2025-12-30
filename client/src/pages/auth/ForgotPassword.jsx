// src/pages/ForgotPassword.jsx
import { useState, useContext, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from '../../services/AuthService';

// Custom component to handle form validity and submission state
const SubmitButton = ({ form, loading }) => {
  const values = Form.useWatch([], form);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    // Check form validity whenever values change
    form.validateFields({ validateOnly: true })
      .then(() => {
        setValid(true);
      })
      .catch(() => {
        setValid(false);
      });
  }, [values, form]);

  const isDisabled = loading || !valid;

  return (
    <Button

      htmlType="submit"
      className="w-full h-12 bg-[#672674] text-white text-lg font-semibold tracking-wide rounded-lg transition-all duration-300 hover:shadow-lg mt-4"
      loading={loading}
      size="large"
      disabled={isDisabled}
    >
      {loading ? 'Sending Request...' : 'Send Reset Link'}
    </Button>
  );
};


const ForgotPassword = () => {

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Use form hook

  // Handle validation failures
  const onFinishFailed = (errorInfo) => {
    const errors = errorInfo.errorFields.map(field => field.errors).flat();

    if (errors.length > 0) {
      toast.error(`Validation Error: ${errors[0]}`, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authService.forgotPassword(values.email);

      // Success toast message
      toast.success('Reset link sent! Please check your inbox (and spam folder).', {
        position: "top-right",
        autoClose: 7000,
      });
      form.resetFields(); // Clear the email field after success
    } catch (err) {
      // Error toast message
      toast.error(err.message || 'Failed to send reset link. Please check the email address.', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-10 bg-white rounded-xl shadow-2xl">

        {/* User-Friendly Header & Instructions */}
        <h2 className="text-3xl font-extrabold mb-3 text-center text-gray-800">Trouble Logging In? 🤔</h2>
        <p className="text-sm text-center text-gray-600 mb-8 font-medium">
          Enter your registered email address below and we'll send you a password reset link.
        </p>

        <Form
          form={form}
          name="forgot"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[{ required: true, type: 'email', message: 'Please input a valid email address!' }]}
          >
            <Input
              prefix={<Mail className="w-5 h-5 text-gray-400 mr-2" />}
              placeholder="e.g., yourname@mail.com"
              size="large"
              className="py-2"
            />
          </Form.Item>

          <Form.Item>
            {/* Custom Submit Button handles loading and disabling */}
            <SubmitButton form={form} loading={loading} />
          </Form.Item>

        </Form>

        <div className="text-center mt-6">
          {/* Link back to login */}
          <Link to="/login" className="text-[#672674] font-medium hover:text-[#672674] transition-colors duration-200 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
