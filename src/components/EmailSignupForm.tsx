"use client";
import { useState } from "react";
import { createClient } from '@/lib/supabase';

export default function EmailSignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    
    try {
      // Check if email already exists
      const { data: existing } = await supabase
        .from('email_signups')
        .select('id')
        .eq('email', email)
        .single();

      if (existing) {
        setStatus("error");
        setMessage("This email is already signed up!");
        return;
      }

      // Insert new email signup
      const { error } = await supabase
        .from('email_signups')
        .insert([{ 
          email, 
          source: 'website',
          is_active: true 
        }]);

      if (error) throw error;

      setStatus("success");
      setMessage("Thank you for signing up! We'll keep you updated.");
      setEmail("");
    } catch (error: any) {
      console.error('Email signup error:', error);
      setStatus("error");
      setMessage(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center max-w-md mx-auto mt-8">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        disabled={status === "loading"}
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-60"
        disabled={status === "loading" || !email}
      >
        {status === "loading" ? "Signing up..." : "Sign Up"}
      </button>
      {message && (
        <div className={`w-full text-center mt-2 text-sm ${status === "success" ? "text-green-600" : "text-red-600"}`}>
          {message}
        </div>
      )}
    </form>
  );
} 