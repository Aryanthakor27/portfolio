import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="toast">
      <CheckCircle size={18} />
      <span>{message}</span>
    </div>
  );
}
