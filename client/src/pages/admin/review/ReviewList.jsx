import { useEffect, useState } from 'react';
import { Card, Button, Rate, Popconfirm, Spin, Empty } from 'antd';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import reviewService from '../../../services/ReviewService';
import ReviewForm from './ReviewForm';

const LIMIT = 10;

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const loadReviews = async (pageNo = 1, append = false) => {
    try {
      const res = await reviewService.getAll({ page: pageNo, limit: LIMIT });

      const { data, pagination } = res;

      setReviews((prev) =>
        append ? [...prev, ...data] : data
      );

      setHasMore(pageNo < pagination.totalPages);
      setInitialLoaded(true);
    } catch {
      // ❌ No toast here for empty DB
      setInitialLoaded(true);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    await loadReviews(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

  const saveReview = async (data) => {
    try {
      setLoading(true);
      edit
        ? await reviewService.update(edit._id, data)
        : await reviewService.create(data);

      toast.success(edit ? 'Review updated' : 'Review added');
      setEdit(null);
      setPage(1);
      loadReviews(1, false);
    } finally {
      setLoading(false);
    }
  };

  const removeReview = async (id) => {
    await reviewService.delete(id);
    toast.error('Review deleted');
    setPage(1);
    loadReviews(1, false);
  };

  return (
    <div className="space-y-4">
      <ReviewForm onSubmit={saveReview} loading={loading} initialData={edit} />

      {/* Empty State */}
      {initialLoaded && reviews.length === 0 && (
        <Empty description="No reviews found" />
      )}

      {/* Review List */}
      {reviews.map((r) => (
        <Card key={r._id}>
          <div className="flex justify-between">
            <div>
              <h4 className="font-semibold">{r.name}</h4>
              <Rate disabled value={r.rating} />
              <p className="text-sm mt-1">{r.comment}</p>
            </div>

            <div className="flex gap-2">
              <Button icon={<Pencil size={16} />} onClick={() => setEdit(r)} />
              <Popconfirm
                title="Delete review?"
                onConfirm={() => removeReview(r._id)}
              >
                <Button danger icon={<Trash2 size={16} />} />
              </Popconfirm>
            </div>
          </div>
        </Card>
      ))}

      {/* Load More */}
      {hasMore && reviews.length > 0 && (
        <div className="flex justify-center">
          <Button onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? <Spin size="small" /> : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
