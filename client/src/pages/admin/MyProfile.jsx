import React, { useState, useEffect } from 'react';
import authService from '../../services/AuthService'; // Update path
import { User, Mail, Phone, Lock, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const MyProfileInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form States
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: ''
  });

  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });

  // UI States
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch User Data on Load
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const  data  = await authService.getMe(); // Returns { success: true, data: user } or just user
      // Adjust based on your actual API response structure
      const userData = data.user || data;
      console.log(data,'data');


      setUser(userData);
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Input Changes
  const handleInfoChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // 3. Submit Basic Info
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Only send fields that are allowed to be updated
      await authService.updateUser(user._id || user.id, {
        username: formData.username,
        email: formData.email,
        phone: formData.phone
      });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Refresh local user data
      fetchProfile();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Submit Password Change
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.password !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (passwordData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setIsSaving(true);
    try {
      // Send only the password field
      await authService.updateUser(user._id || user.id, {
        password: passwordData.password
      });

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ password: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Password update failed' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#672674]">Account Settings</h1>
          <p className="text-gray-500">Manage your profile details and security.</p>
        </div>

        {/* Status Message */}
        {message.text && (
          <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Section 1: Basic Information */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <User className="text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              </div>

              <form onSubmit={handleUpdateInfo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInfoChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInfoChange}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInfoChange}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Section 2: Security (Password) */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <Lock className="text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">Security</h2>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Min 6 chars"
                    value={passwordData.password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-type password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving || !passwordData.password}
                  className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyProfileInfo;
