import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiEdit3, FiX } from 'react-icons/fi';
import { RiDoubleQuotesL } from "react-icons/ri";
import AOS from 'aos';
import 'aos/dist/aos.css';
import reviewService from '../services/ReviewService';

const Reviewsection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ UPDATED: State matches your Mongoose Schema (name, comment, rating)
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getAll({ page: 1, limit: 10 });
      // Support both structure types just in case
      const fetchedReviews = response.data.reviews || response.data || [];
      setReviews(fetchedReviews);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews", error);
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (reviews.length === 0) return;
    setCurrentSlide((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (reviews.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (reviews.length === 0 || showForm) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, reviews.length, showForm]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Logic: The backend handles connecting the 'user' ID via req.user usually.
      // We send name, rating, and comment.
      await reviewService.create(newReview);

      setMessage({ type: 'success', text: 'Thank you! Your review has been posted.' });
      setNewReview({ name: '', rating: 5, comment: '' }); // Reset form
      setShowForm(false);
      fetchReviews();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to post review. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f8f5f0] py-20 text-center">
        <div className="animate-spin h-10 w-10 border-4 border-[#672674] border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f5f0] py-16 px-4 sm:px-6 lg:px-8" id='testimonial'>
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12 relative">
          <h2 className="text-[#672674] text-3xl font-dancing mt-2 pb-2" data-aos="fade-up">Testimonials</h2>
          <p className="text-4xl md:text-5xl font-bold text-black font-opensans leading-tight mb-6" data-aos="fade-up">
            Our Clients Say
          </p>

          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-[#672674] text-white px-6 py-2 rounded-full font-medium shadow-md hover:bg-[#672674] transition-all transform hover:-translate-y-1"
          >
            {showForm ? <><FiX /> Cancel</> : <><FiEdit3 /> Write a Review</>}
          </button>
        </div>

        {message.text && (
          <div className={`max-w-xl mx-auto mb-6 p-4 rounded text-center ${message.type === 'error' ? 'bg-red-100 text-[#672674]' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        {/* Review Form */}
        {showForm && (
          <div className="max-w-2xl mx-auto mb-16 bg-white p-8 rounded-xl shadow-xl border-t-4 border-[#672674]" data-aos="fade-down">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Share your experience</h3>
            <form onSubmit={handleSubmitReview}>

              {/* Star Rating */}
              <div className="flex justify-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`text-3xl mx-1 focus:outline-none transition-colors duration-200 ${
                      star <= newReview.rating ? 'text-[#ffc107]' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              {/* ✅ ADDED: Name Input Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#672674] focus:border-transparent outline-none"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                />
              </div>

              {/* ✅ UPDATED: Comment Textarea (mapped to 'comment' key) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                <textarea
                  required
                  rows="4"
                  placeholder="How was the meat quality? How was the service?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#672674] focus:border-transparent outline-none"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#672674] text-white py-3 rounded-lg font-bold hover:bg-[#672674] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Post Review'}
              </button>
            </form>
          </div>
        )}

        {/* Reviews Carousel */}
        {reviews.length > 0 ? (
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div key={review._id || index} className="w-full flex-shrink-0 px-4">
                  <div
                    className="bg-[#f5ebe0] p-10 rounded-xl shadow-lg text-center max-w-3xl mx-auto border border-gray-300 border-t-4 transition-shadow duration-300 hover:shadow-xl"
                    style={{ borderTopColor: '#672674' }}
                  >
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? 'text-[#ffc107]' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* ✅ UPDATED: Render 'comment' instead of 'content' */}
                    <div className="text-gray-700 font-quicksand text-xl leading-relaxed mb-6 relative">
                      <RiDoubleQuotesL className="absolute -top-4 -left-4 text-[#672674] text-2xl" />
                      {review.comment || review.content}
                    </div>

                    {/* ✅ UPDATED: Display Name from review object directly */}
                    <p className="text-sm font-bold text-[#672674] uppercase tracking-wide">
                      - {review.name}
                    </p>

                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#672674] text-white p-2 rounded-full shadow-md hover:bg-[#672674] transition-colors z-10"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#672674] text-white p-2 rounded-full shadow-md hover:bg-[#672674] transition-colors z-10"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p className="text-xl">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}

        {reviews.length > 0 && (
          <div className="flex justify-center mt-8 overflow-x-auto">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full mx-1 transition-all ${currentSlide === index ? 'bg-[#672674] w-4' : 'bg-gray-300'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Reviewsection;
