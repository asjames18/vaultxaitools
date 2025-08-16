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
      setMessage("�� Welcome to VaultX! You'll receive weekly curated AI tool picks, expert reviews, and exclusive beta invites.");
      setEmail("");
    } catch (error: any) {
      console.error('Email signup error:', error);
      setStatus("error");
      setMessage(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Stay Ahead with AI Tools</h3>
        <p className="text-white/80 text-sm mb-4">
          Get weekly curated AI tool picks, expert reviews, and exclusive beta invites
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          className="flex-1 px-4 py-3 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-white text-blue-600 hover:bg-gray-100 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-60 disabled:transform-none"
          disabled={status === "loading" || !email}
        >
          {status === "loading" ? "Signing up..." : "Get Weekly Picks"}
        </button>
      </form>
      {message && (
        <div className={`w-full text-center mt-3 text-sm ${status === "success" ? "text-green-200" : "text-red-200"}`}>
          {message}
        </div>
      )}
      <p className="text-white/80 text-xs mt-3">
        No spam, unsubscribe anytime. We respect your privacy.
      </p>
    </div>
  );
} 