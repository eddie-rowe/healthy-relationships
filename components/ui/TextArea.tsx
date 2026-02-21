"use client";

import { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  maxLength?: number;
}

export default function TextArea({ label, maxLength, className = "", value, onChange, ...props }: TextAreaProps) {
  const length = typeof value === "string" ? value.length : 0;
  const nearLimit = maxLength && length > maxLength * 0.8;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-violet-800 dark:text-violet-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={`w-full rounded-xl border border-violet-200 dark:border-violet-800 bg-white dark:bg-gray-900 px-4 py-3 text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900 resize-none ${className}`}
        rows={4}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        {...props}
      />
      {maxLength && (
        <p className={`text-xs mt-1 text-right ${nearLimit ? "text-amber-500" : "text-gray-400 dark:text-gray-600"}`}>
          {length}/{maxLength}
        </p>
      )}
    </div>
  );
}
