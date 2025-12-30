import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, Loader2, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import orderService from '../services/orderService';

const PaymentUploadPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle File Selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Basic validation
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File is too large. Max 5MB.");
        return;
      }

      setFile(selectedFile);

      // Generate Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Handle API Upload
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a screenshot first");
      return;
    }

    try {
      setUploading(true);
      // Call the service we created in Step 1
      await orderService.uploadPaymentScreenshot(orderId, file);

      toast.success("Payment verified! Order confirmed.");
      navigate(`/order-success/${orderId}`);

    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload screenshot");
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    // Optional: Allow skip if you want them to upload later
    toast.info("Please upload payment proof from 'My Orders' section later.");
    navigate(`/order-success/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">

        {/* Icon */}
        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="text-[#672674]" size={32} />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Payment Proof</h2>
        <p className="text-gray-500 text-sm mb-6">
          Your order has been placed! Please upload the UPI transaction screenshot to confirm Order ID: <span className="font-mono font-bold text-gray-700">{orderId.slice(-6).toUpperCase()}</span>
        </p>

        {/* Upload Input Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-6 relative hover:bg-gray-50 transition-colors group cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          {preview ? (
            <div className="relative">
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded shadow-sm object-contain" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                   <p className="text-white text-sm font-medium">Click to change</p>
                </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-400 py-6">
                <ImageIcon size={48} className="mb-2 text-gray-300" />
                <span className="text-sm font-medium text-gray-600">Click to browse image</span>
                <span className="text-xs mt-1 text-gray-400">JPG, PNG supported</span>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-[#672674] hover:bg-[#672674] text-white font-bold py-3 rounded-md shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Uploading...
            </>
          ) : (
            <>
              <CheckCircle size={20} /> Verify & Finish
            </>
          )}
        </button>

        {/* Skip Link */}
        <button
            onClick={handleSkip}
            className="mt-4 text-gray-400 hover:text-gray-600 text-sm flex items-center justify-center gap-1 mx-auto"
        >
            Do this later <ArrowRight size={14} />
        </button>

      </div>
    </div>
  );
};

export default PaymentUploadPage;
