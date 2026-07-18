import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Clock, Send, Building2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  subject: z.enum(["General Inquiry", "Technical Support", "Partnership", "Press"], {
    errorMap: () => ({ message: "Please select a subject" }),
  }),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const officeCards = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@eyex.technology",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Dubai, UAE",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "< 24 hours",
  },
];

export function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("Contact form submitted:", data);
    toast.success("Message sent successfully! We'll get back to you soon.");
    reset();
  };

  return (
    <>
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary-brand/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-brand/5 rounded-full blur-[120px]" />
      </div>

      <main className="pt-32">
        {/* Hero Section */}
        <section className="max-w-[1200px] mx-auto px-6 mb-[6rem] text-center" data-fade-up>
          <div className="inline-block px-4 py-1 mb-6 rounded-full border border-eye-border bg-eye-surface text-primary-brand font-mono text-[12px] tracking-[0.15em] uppercase">
            Get in Touch
          </div>
          <h1 className="text-[48px] md:text-[72px] font-medium mb-6 tracking-tight leading-[1.1]">
            Let's Build Together
          </h1>
          <p className="text-[20px] leading-[1.6] text-eye-text max-w-2xl mx-auto">
            Whether you have a question about our platform, need technical
            support, or want to explore a partnership — we're here to help.
          </p>
        </section>

        {/* Contact Form + Info */}
        <section className="max-w-[1200px] mx-auto px-6 mb-[6rem]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3" data-fade-up>
              <div className="p-8 md:p-12 rounded-2xl border border-eye-border bg-eye-surface/50">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-eye-white mb-2">
                        Name *
                      </label>
                      <input
                        {...register("name")}
                        placeholder="Your name"
                        className="w-full px-4 py-3 bg-eye-bg border border-eye-border rounded-lg text-eye-white text-sm placeholder:text-eye-text/50 focus:outline-none focus:border-primary-brand/50 focus:ring-1 focus:ring-primary-brand/20 transition-colors"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-eye-white mb-2">
                        Email *
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="you@company.com"
                        className="w-full px-4 py-3 bg-eye-bg border border-eye-border rounded-lg text-eye-white text-sm placeholder:text-eye-text/50 focus:outline-none focus:border-primary-brand/50 focus:ring-1 focus:ring-primary-brand/20 transition-colors"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Company + Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-eye-white mb-2">
                        Company
                      </label>
                      <input
                        {...register("company")}
                        placeholder="Your company (optional)"
                        className="w-full px-4 py-3 bg-eye-bg border border-eye-border rounded-lg text-eye-white text-sm placeholder:text-eye-text/50 focus:outline-none focus:border-primary-brand/50 focus:ring-1 focus:ring-primary-brand/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-eye-white mb-2">
                        Subject *
                      </label>
                      <select
                        {...register("subject")}
                        className="w-full px-4 py-3 bg-eye-bg border border-eye-border rounded-lg text-eye-white text-sm focus:outline-none focus:border-primary-brand/50 focus:ring-1 focus:ring-primary-brand/20 transition-colors appearance-none"
                        defaultValue=""
                      >
                        <option value="" disabled className="text-eye-text/50">
                          Select a subject
                        </option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Press">Press</option>
                      </select>
                      {errors.subject && (
                        <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-eye-white mb-2">
                      Message *
                    </label>
                    <textarea
                      {...register("message")}
                      rows={6}
                      placeholder="Tell us about your project or question..."
                      className="w-full px-4 py-3 bg-eye-bg border border-eye-border rounded-lg text-eye-white text-sm placeholder:text-eye-text/50 focus:outline-none focus:border-primary-brand/50 focus:ring-1 focus:ring-primary-brand/20 transition-colors resize-none"
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="luminous-btn-primary px-8 py-4 rounded-md font-medium text-[16px] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>

            {/* Office Info */}
            <div className="lg:col-span-2 space-y-6" data-fade-up>
              {officeCards.map((card) => (
                <div
                  key={card.label}
                  className="p-8 rounded-2xl border border-eye-border bg-eye-surface/50 group hover:border-primary-brand/30 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary-brand/10 border border-primary-brand/20 rounded-lg flex items-center justify-center mb-4 text-primary-brand group-hover:scale-110 transition-transform">
                    <card.icon size={24} />
                  </div>
                  <h3 className="text-eye-white font-medium mb-1">{card.label}</h3>
                  <p className="text-eye-text text-sm">{card.value}</p>
                </div>
              ))}

              {/* Additional Info */}
              <div className="p-8 rounded-2xl border border-eye-border bg-eye-surface/50">
                <div className="w-12 h-12 bg-primary-brand/10 border border-primary-brand/20 rounded-lg flex items-center justify-center mb-4 text-primary-brand">
                  <Building2 size={24} />
                </div>
                <h3 className="text-eye-white font-medium mb-1">Headquarters</h3>
                <p className="text-eye-text text-sm leading-relaxed">
                  Dubai Internet City<br />
                  Building 1, Office 402<br />
                  Dubai, UAE
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="max-w-[1200px] mx-auto px-6 mb-[6rem]" data-fade-up>
          <div className="p-12 rounded-2xl border border-eye-border bg-eye-surface/50 text-center">
            <h3 className="text-[24px] font-medium mb-6">Connect With Us</h3>
            <div className="flex items-center justify-center gap-4">
              {["Twitter", "LinkedIn", "GitHub"].map((platform) => (
                <span
                  key={platform}
                  className="px-6 py-3 rounded-lg border border-eye-border bg-eye-bg text-sm text-eye-text hover:border-primary-brand/50 hover:text-eye-white transition-colors cursor-pointer"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Back to Home */}
        <section className="max-w-[1200px] mx-auto px-6 mb-[6rem] text-center" data-fade-up>
          <Link
            to="/"
            className="text-sm text-eye-text hover:text-primary-brand transition-colors"
          >
            &larr; Back to Home
          </Link>
        </section>
      </main>
    </>
  );
}
