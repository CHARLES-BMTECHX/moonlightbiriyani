// src/pages/Register.jsx
import { useState, useContext, useEffect } from 'react';
import { Form, Input, Button } from 'antd'; // Removed 'message'
import { User, Mail, Phone, Lock, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import { Link } from 'react-router-dom'; // Import Link for navigation
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';

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
      className="w-full h-12 text-lg bg-[#672674] text-white font-semibold tracking-wide rounded-lg transition-all duration-300 hover:shadow-lg"
      loading={loading}
      size="large"
      disabled={isDisabled}
    >
      {loading ? 'Creating Account...' : 'Register Account'}
    </Button>
  );
};


const Register = () => {
  const { signup } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Use form hook

  // Handle validation failures (e.g., fields left blank on submit)
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
      // Destructure and remove the 'confirmPassword' field before sending to API
      const { confirmPassword, ...dataToSend } = values;
      await signup(dataToSend);

      toast.success('Registration successful! Please log in.', {
        position: "top-right",
        autoClose: 3000,
      });
      // Optionally reset form after success: form.resetFields();
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try a different email or username.', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Increased max-width for more inputs */}
      <div className="w-full max-w-lg p-10 bg-white rounded-xl shadow-2xl">

        {/* Instructional Header */}
        <h2 className="text-3xl font-extrabold mb-3 text-center text-gray-800">Join Us Today 🚀</h2>
        <p className="text-sm text-center text-gray-600 mb-8 font-medium">
          Fill in the details below to create your free account and get started.
        </p>

        <Form
          form={form} // Linked to useForm hook
          name="register"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          {/* Username */}
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<User className="w-5 h-5 text-gray-400 mr-2" />}
              placeholder="Unique Username"
              size="large"
              className="py-2"
            />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email Address"
            rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
          >
            <Input
              prefix={<Mail className="w-5 h-5 text-gray-400 mr-2" />}
              placeholder="e.g., yourname@mail.com"
              size="large"
              className="py-2"
            />
          </Form.Item>

          {/* Phone */}
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input
              prefix={<Phone className="w-5 h-5 text-gray-400 mr-2" />}
              placeholder="e.g., 9876543210"
              size="large"
              className="py-2"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }, { min: 6, message: 'Password must be at least 6 characters long' }]}
          >
            <Input.Password
              prefix={<Lock className="w-5 h-5 text-gray-400 mr-2" />}
              placeholder="Create a strong password"
              size="large"
              className="py-2"
            />
          </Form.Item>

          {/* Confirm Password (Added) */}
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']} // Watches the password field
            hasFeedback // Shows success/error icons
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<Lock className="w-5 h-5 text-gray-400 mr-2" />}
              placeholder="Re-enter password"
              size="large"
              className="py-2"
            />
          </Form.Item>

          <Form.Item className="mt-6">
            <SubmitButton form={form} loading={loading} />
          </Form.Item>
        </Form>

        {/* Link back to login */}
        <div className="text-center mt-6">
          <Link to="/login" className="text-[#672674] hover:text-[#672674e4] transition-colors font-medium duration-200 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
