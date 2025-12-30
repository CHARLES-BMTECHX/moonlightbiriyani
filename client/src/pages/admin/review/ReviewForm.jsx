import { Input, Button, Rate, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';

const { Text } = Typography;

const ReviewForm = ({ onSubmit, loading, initialData }) => {
  const [form, setForm] = useState({
    name: '',
    comment: '',
    rating: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setErrors({});
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.comment.trim()) newErrors.comment = 'Review is required';
    if (!form.rating) newErrors.rating = 'Rating is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = () => {
    if (!validate()) return;

    onSubmit(form);
    setForm({ name: '', comment: '', rating: 0 });
    setErrors({});
  };

  return (
    <div className="space-y-3">
      {/* Name */}
      <div>
        <Input
          placeholder="Your Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          status={errors.name ? 'error' : ''}
        />
        {errors.name && <Text type="danger">{errors.name}</Text>}
      </div>

      {/* Comment */}
      <div>
        <Input.TextArea
          placeholder="Your Review"
          name="comment"
          rows={3}
          value={form.comment}
          onChange={handleChange}
          status={errors.comment ? 'error' : ''}
        />
        {errors.comment && <Text type="danger">{errors.comment}</Text>}
      </div>

      {/* Rating */}
      <div>
        <Rate
          value={form.rating}
          onChange={(v) => {
            setForm({ ...form, rating: v });
            setErrors({ ...errors, rating: '' });
          }}
        />
        {errors.rating && (
          <div>
            <Text type="danger">{errors.rating}</Text>
          </div>
        )}
      </div>

      <Button type="primary" onClick={submit} disabled={loading}>
        {loading ? <Spin size="small" /> : initialData ? 'Update Review' : 'Add Review'}
      </Button>
    </div>
  );
};

export default ReviewForm;
    