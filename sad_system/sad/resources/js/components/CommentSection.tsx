// resources/js/Components/CommentSection.tsx

import { useState } from 'react';

interface Comment {
  text: string;
  author: string;
  date: string;
}

interface Props {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

export default function CommentSection({ comments, onAddComment }: Props) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <div className="mt-4 space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">Comments</h4>
      <ul className="space-y-2">
        {comments.map((c, i) => (
          <li key={i} className="text-sm bg-gray-50 p-2 rounded border">
            <span className="block font-medium text-gray-800">{c.author}</span>
            <p className="text-gray-600">{c.text}</p>
            <span className="text-xs text-gray-400">{c.date}</span>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring focus:ring-red-200"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
        >
          Post
        </button>
      </form>
    </div>
  );
}
