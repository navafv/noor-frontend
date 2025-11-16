import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { Star, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StarRating = ({ rating, setRating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        onClick={() => setRating(star)}
        className={`w-8 h-8 cursor-pointer transition-colors
          ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50 hover:text-yellow-400'}
        `}
      />
    ))}
  </div>
);

function FeedbackFormModal({ isOpen, onClose, onSubmit, courseTitle }) {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating (1-5 stars).');
      return;
    }

    setIsLoading(true);
    try {
      // Pass data up to the parent component (StudentDashboard)
      await onSubmit(rating, comments);
      // Parent will handle success toast and closing
      setRating(0);
      setComments('');
    } catch (err) {
      // Parent will handle error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Feedback for ${courseTitle}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">Your Rating</label>
          <StarRating rating={rating} setRating={setRating} />
        </div>
        
        <div>
          <label htmlFor="comments" className="form-label">
            Comments (Optional)
          </label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={4}
            className="form-input"
            placeholder="What did you like or dislike?"
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default FeedbackFormModal;