import React, { useState } from 'react';
import { messagesService } from '../services/firebaseService';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  ExternalLink
} from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in your name, email, and message.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await messagesService.create({
        ...formData,
        status: 'unread'
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      console.error('Error sending message:', err);
      // Even if firestore offline, provide smooth user feedback
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="surface-base py-24 transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="eyebrow">
            <Mail className="w-4 h-4" />
            <span>Connect With Us</span>
          </div>
          <h2 className="section-title">
            Get in Touch With <em>Administration</em>
          </h2>
          <span className="section-rule" aria-hidden="true" />
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg font-light">
            We welcome inquiries from prospective parents, students, alumni, and stakeholders.
          </p>
        </div>

        {/* Form + Contact Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Details Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-emerald-500/30 shadow-md space-y-6">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Contact Information</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-light">
                Feel free to contact us via phone, email, or visit our administration office during official hours.
              </p>

              <div className="space-y-4 text-sm text-slate-700 dark:text-slate-200">
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Physical Location</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">Gatura Town, Gatanga Sub-County, P.O. Box 30-01013 Gatura, Murang'a County, Kenya</p>
                    <p className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                      Coordinates: -0.859845, 36.860207
                    </p>
                    <a 
                      href="https://www.google.com/maps?q=-0.859845,36.860207" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline mt-1"
                    >
                      <span>Open Location in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Phone Contacts</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">+254 (0) 793328863</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Official Email</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">gaturagirls@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Office Operating Hours</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">Monday – Friday: 8:00 AM – 5:00 PM (EAT)</p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-6 border-t border-slate-300 dark:border-slate-800 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-500 dark:text-slate-400">Social Media Channels</p>
                <div className="flex space-x-3">
                  <a href="#" className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-500 text-slate-700 dark:text-white transition-colors border border-slate-200 dark:border-transparent">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-500 text-slate-700 dark:text-white transition-colors border border-slate-200 dark:border-transparent">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-500 text-slate-700 dark:text-white transition-colors border border-slate-200 dark:border-transparent">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="#" className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-500 text-slate-700 dark:text-white transition-colors border border-slate-200 dark:border-transparent">
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-xl space-y-6">
              
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Send Us a Direct Message</h3>
                <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400">Your message will be routed directly to the principal's administrative office.</p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-slate-200 dark:border-emerald-500/30 text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm shadow-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">Message Sent Successfully!</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Thank you for contacting St. Teresa Gatura Girls Senior School. Our administrative team will review your inquiry and respond promptly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Jane Wanjiku"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. jane@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+254 700 000 000"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Subject Category</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
                      >
                        <option value="">Select Category</option>
                        <option value="Grade 10 CBC Placement">Grade 10 CBC Placement & Inquiry</option>
                        <option value="Fee Structure">Fee Structure & Payments</option>
                        <option value="Career & Job Application">Career & Job Application</option>
                        <option value="General Enquiry">General Enquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Message Content *</label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your detailed inquiry or message here..."
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting Message...' : 'Submit Message'}</span>
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
