'use client';

import { useState } from 'react';

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
        console.error('Contact form error:', result.error);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Contact form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const faqs = [
    {
      question: 'How do I submit an AI tool to the directory?',
      answer: (
        <>
          Use our{' '}
          <a href="/submit-tool" className="text-green-400 hover:text-green-300 underline underline-offset-2">
            tool submission form
          </a>{' '}
          to add your AI tool. Our team reviews every submission to keep the directory high-quality.
        </>
      ),
    },
    {
      question: 'Can I advertise or partner with Melanated In Tech?',
      answer:
        'Yes! We welcome partnerships that align with our mission of empowering Black and melanated communities through tech. Reach out using the form above and select "Partnership Opportunity".',
    },
    {
      question: 'How do I report a bug or broken tool listing?',
      answer:
        'Use the contact form and select "Bug Report" as the subject. Include as much detail as possible — screenshots help too.',
    },
    {
      question: 'I\'m new to AI — where do I start?',
      answer:
        'Browse our curated tool categories on the home page. We tag tools by skill level so you can find beginner-friendly picks. Feel free to reach out if you need a personal recommendation.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gray-900 border-b border-gray-800 overflow-hidden">
        {/* Subtle green glow background accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Community-First Support
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            We&apos;d Love to Hear{' '}
            <span className="text-green-400">From You</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-4">
            Melanated In Tech exists to make AI and technology accessible to Black and melanated communities.
            Whether you have a question, idea, or just want to connect — our door is open.
          </p>

          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Every message matters. We read and respond to everything personally.
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* Contact Form */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Send Us a Message
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Fill out the form below and we&apos;ll get back to you within 24 hours.
            </p>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-400 font-medium">
                  Message sent! Thank you for reaching out. We&apos;ll be in touch soon.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400">
                  Something went wrong. Please try again or email us directly.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name <span className="text-green-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email <span className="text-green-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject <span className="text-green-400">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                >
                  <option value="" className="text-gray-500">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback &amp; Suggestions</option>
                  <option value="bug-report">Bug Report</option>
                  <option value="feature-request">Feature Request</option>
                  <option value="consultation">Consultation</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message <span className="text-green-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition resize-none"
                  placeholder="Tell us how we can help, or just say hello..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information + FAQ */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Contact Information
              </h2>
              <p className="text-gray-400 text-sm">
                Real people, real responses. We&apos;re a community platform and we treat every message that way.
              </p>
            </div>

            <div className="space-y-4">
              {/* Email card */}
              <div className="flex items-start gap-4 p-5 bg-gray-800 border border-gray-700 rounded-xl hover:border-green-500/40 transition-colors">
                <div className="w-11 h-11 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-0.5">Email</h3>
                  <p className="text-green-400 text-sm font-medium mb-1">contact@melanatedintech.com</p>
                  <p className="text-xs text-gray-500">Typical response within 24 hours</p>
                </div>
              </div>

              {/* Support hours card */}
              <div className="flex items-start gap-4 p-5 bg-gray-800 border border-gray-700 rounded-xl hover:border-green-500/40 transition-colors">
                <div className="w-11 h-11 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-0.5">Support Hours</h3>
                  <p className="text-gray-300 text-sm mb-1">Monday – Friday: 9 AM – 6 PM EST</p>
                  <p className="text-xs text-gray-500">Weekend support available for urgent issues</p>
                </div>
              </div>

              {/* Community card */}
              <div className="flex items-start gap-4 p-5 bg-gray-800 border border-gray-700 rounded-xl hover:border-green-500/40 transition-colors">
                <div className="w-11 h-11 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-0.5">Join the Community</h3>
                  <p className="text-gray-300 text-sm mb-1">Connect with other members learning and building with AI</p>
                  <p className="text-xs text-gray-500">Share tools, tips, and opportunities together</p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                  <span className="w-1 h-5 bg-green-400 rounded-full inline-block" />
                  Frequently Asked Questions
                </h3>
              </div>
              <div className="divide-y divide-gray-700">
                {faqs.map((faq, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-700/50 transition-colors group"
                    >
                      <span className="font-medium text-gray-200 group-hover:text-white text-sm pr-4">
                        {faq.question}
                      </span>
                      <svg
                        className={`w-4 h-4 text-green-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-4">
                        <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-green-500/40 pl-4">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
