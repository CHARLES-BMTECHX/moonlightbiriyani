import { Modal, Input, InputNumber, Button, Upload, Form, Spin } from "antd";
import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";

const ProductForm = ({ open, onClose, onSubmit, initialData, loading }) => {
    const [form] = Form.useForm();
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);


    useEffect(() => {
        if (initialData) {
            form.setFieldsValue(initialData);
            setPreview(initialData.image);
        } else {
            form.resetFields();
            setPreview("");
            setImage(null);
        }
    }, [initialData, open]);

    const handleFinish = (values) => {
        const formData = new FormData();

        Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
        });

        if (image) formData.append("image", image);

        // Image mandatory while creating
        if (!initialData && !image) {
            form.setFields([
                {
                    name: "image",
                    errors: ["Product image is required"],
                },
            ]);
            return;
        }

        onSubmit(formData);
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            destroyOnClose
            title={
                <span className="text-xl font-semibold">
                    {initialData ? "Update Product" : "Add Product"}
                </span>
            }
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                onFieldsChange={() => {
                    const hasErrors = form
                        .getFieldsError()
                        .some(({ errors }) => errors.length > 0);

                    const values = form.getFieldsValue();
                    const hasAllValues =
                        values.name &&
                        values.price !== undefined &&
                        values.stock !== undefined &&
                        values.description &&
                        (initialData || image); // image required only on create

                    setIsFormValid(!hasErrors && hasAllValues);
                }}
                className="mt-4"
            >

                {/* Product Name */}
                <Form.Item
                    label="Product Name"
                    name="name"
                    rules={[{ required: true, message: "Product name is required" }]}
                >
                    <Input size="large" placeholder="Enter product name" />
                </Form.Item>

                {/* Price */}
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                        { required: true, message: "Price is required" },
                        { type: "number", min: 1, message: "Price must be greater than 0" },
                    ]}
                >
                    <InputNumber
                        size="large"
                        className="w-full"
                        placeholder="Enter price"
                    />
                </Form.Item>

                {/* Stock */}
                <Form.Item
                    label="Stock"
                    name="stock"
                    rules={[
                        { required: true, message: "Stock is required" },
                        { type: "number", min: 0, message: "Stock cannot be negative" },
                    ]}
                >
                    <InputNumber
                        size="large"
                        className="w-full"
                        placeholder="Enter stock quantity"
                    />
                </Form.Item>

                {/* Description */}
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        { required: true, message: "Description is required" },
                        { min: 10, message: "Minimum 10 characters required" },
                    ]}
                >
                    <Input.TextArea
                        size="large"
                        rows={4}
                        placeholder="Enter product description"
                    />
                </Form.Item>

                {/* Image Upload */}
                <Form.Item
                    label="Product Image"
                    name="image"
                    rules={[
                        {
                            required: !initialData,
                            message: "Product image is required",
                        },
                    ]}
                >
                    <Upload
                        beforeUpload={(file) => {
                            const isValid =
                                ["image/jpeg", "image/png", "image/webp"].includes(
                                    file.type
                                );

                            if (!isValid) {
                                form.setFields([
                                    {
                                        name: "image",
                                        errors: ["Only JPG, PNG, WEBP allowed"],
                                    },
                                ]);
                                return Upload.LIST_IGNORE;
                            }

                            setImage(file);
                            setPreview(URL.createObjectURL(file));
                            return false;
                        }}
                        showUploadList={false}
                    >
                        <Button
                            size="large"
                            icon={<UploadCloud size={18} />}
                            className="w-full"
                        >
                            Upload Image
                        </Button>
                    </Upload>
                </Form.Item>

                {preview && (
                    <img
                        src={preview}
                        alt="preview"
                        className="w-full h-44 object-cover rounded-lg border"
                    />
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button size="large" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        disabled={loading || !isFormValid}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Spin size="small" />
                                {initialData ? "Updating..." : "Creating..."}
                            </span>
                        ) : (
                            initialData ? "Update Product" : "Create Product"
                        )}
                    </Button>

                </div>
            </Form>
        </Modal>
    );
};

export default ProductForm;
