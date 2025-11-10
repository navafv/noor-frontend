import React, { useState } from 'react';
import { Loader2, Star, Send } from 'lucide-react';
import api from '@/services/api.js';

/**
 * A modal form for submitting feedback for a completed enrollment.
 *
 * Props:
 * - enrollment: The enrollment object to submit feedback for.
 * - onClose: Function to close the modal.
 * - onSaved: Function to call on successful submission.
 */
function FeedbackFormModal({ enrollment, onClose, onSaved }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await api.post('/feedback/', {
        enrollment: enrollment.id,
        rating: rating,
        comments: comments,
      });
      onSaved(); // Refresh parent data
      onClose(); // Close modal
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.[0] || 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="form-error text-center">{error}</p>}
      
      <div>
        <label className="form-label">Your Rating</label>
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={36}
              className={`cursor-pointer transition-colors ${
                (hoverRating || rating) >= star
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comments" className="form-label">Comments (Optional)</label>
        <textarea
          name="comments"
          id="comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="form-input"
          rows="4"
          placeholder="What did you like or think could be improved?"
        />
      </div>

      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : (
          <>
            <Send size={18} className="mr-2" />
            Submit Feedback
          </>
        )}
      </button>
    </form>
  );
}

export default FeedbackFormModal;