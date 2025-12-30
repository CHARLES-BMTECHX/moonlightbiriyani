// src/pages/Login.jsx
import { useState, useContext, useEffect } from 'react';
import { Form, Input, Button } from 'antd'; // Make sure to import Form
import { Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 1. Create a custom component to monitor form state
const SubmitButton = ({ form, loading }) => {
    // Watch all fields, and re-render when they change
    const values = Form.useWatch([], form);

    // Get the current form instance to check validity
    const [valid, setValid] = useState(false);

    // Check form validity whenever values change
    // This is a common pattern in Ant Design to check validity without submitting
    useEffect(() => {
        form.validateFields({ validateOnly: true })
            .then(() => {
                setValid(true);
            })
            .catch(() => {
                setValid(false);
            });
    }, [values, form]);

    // The button is disabled if:
    // 1. The form is currently submitting (loading)
    // 2. The form fields contain validation errors (not valid)
    const isDisabled = loading || !valid;

    return (
        <Button

            htmlType="submit"
            className="w-full h-12 bg-[#672674] text-white text-lg font-semibold tracking-wide rounded-lg transition-all duration-300 hover:shadow-lg"
            loading={loading} // Handles the loading spinner
            size="large"
            disabled={isDisabled} // Disables the button if form is invalid or loading
        >
            {loading ? 'Verifying Credentials...' : 'Sign In'}
        </Button>
    );
};


const Login = () => {
    const { login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    // 2. Use the hook to get the form instance
    const [form] = Form.useForm();

    // Function to handle validation failure (triggered by Ant Design)
    const onFinishFailed = (errorInfo) => {
        // Collect all failed validation messages
        const errors = errorInfo.errorFields.map(field => field.errors).flat();

        // Use the first error message for a toast notification
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
            await login(values.email, values.password);
            // toast.success('Login successful! You are being redirected.', {
            //     position: "top-right",
            //     autoClose: 3000,
            // });
        } catch (err) {
            toast.error(err.message || 'Login failed. Please verify your email and password before trying again.', {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center  justify-center min-h-screen  bg-gray-100">
            <div className="w-full max-w-sm p-10 bg-white rounded-xl shadow-2xl">
                <h2 className="text-3xl font-extrabold mb-3 text-center text-gray-800">Access Your Dashboard 🔑</h2>
                <p className="text-sm text-center text-gray-600 mb-8 font-medium">
                    Securely sign in to continue managing your account. If you are having trouble, check your email address carefully.
                </p>

                {/* 3. Pass the form instance to the Form component */}
                <Form
                    form={form} // Linked to useForm hook
                    name="login"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed} // Handles toast notification on invalid submission
                    layout="vertical"
                    initialValues={{ remember: true }}
                >
                    <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[{ required: true, type: 'email', message: 'Please input a valid email address!' }]}
                    >
                        <Input
                            prefix={<Mail className="w-5 h-5 text-gray-400 mr-2" />}
                            placeholder="e.g., john.doe@mail.com"
                            size="large"
                            className="py-2"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            prefix={<Lock className="w-5 h-5 text-gray-400 mr-2" />}
                            placeholder="Enter your confidential password"
                            size="large"
                            className="py-2"
                        />
                    </Form.Item>

                    <div>
                        <Link to="/forgot-password" className="text-[#672674] flex justify-end hover:text-[#672674e9] transition-colors duration-200">
                            Forgot Password?
                        </Link>
                    </div>
                    <Form.Item className="mt-6">
                        {/* 4. Use the custom submit button */}
                        <SubmitButton form={form} loading={loading} />
                    </Form.Item>
                </Form>

                <div className="flex justify-center items-center text-sm mt-4">

                    <span className="text-gray-500">
                        Need an account?{' '}
                        <Link to="/register" className="text-[#672674] hover:text-[#672674ef] transition-colors duration-200 font-medium">
                            Create Account
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
