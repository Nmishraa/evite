import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import './CommentBoard.css';

const CommentBoard = ({ eventId, comments = [], onAddComment, currentUser }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="comment-board glass-card animate-fade-in">
      <div className="board-header">
        <MessageSquare size={20} className="text-primary" />
        <h3>Event Message Board</h3>
      </div>

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="empty-comments">
            <p className="text-muted">No messages yet. Be the first to say something!</p>
          </div>
        ) : (
          comments.map((comment, idx) => (
            <div key={idx} className="comment-item">
              <div className="comment-avatar">
                <User size={16} />
              </div>
              <div className="comment-content">
                <div className="comment-meta">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-time">{comment.time || 'Just now'}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="comment-input-area">
        <input 
          type="text" 
          placeholder="Write a message..." 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="glass-input"
        />
        <button type="submit" className="btn btn-primary btn-icon-round" disabled={!newComment.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default CommentBoard;
