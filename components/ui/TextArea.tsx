"use client";

import { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function TextArea({ label, className = "", ...props }: TextAreaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-violet-800 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={`w-full rounded-xl border border-violet-200 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none ${className}`}
        rows={4}
        {...props}
      />
    </div>
  );
}
