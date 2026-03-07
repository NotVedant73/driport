import { Mail, Phone, MapPin, Clock } from "lucide-react";
import apiClient from "../../api/apiClient";
import {
  Form,
  useActionData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function Contact() {
  const actionData = useActionData();
  const formRef = useRef(null);
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.success) {
      formRef.current?.reset();
      toast.success("Your message has been submitted successfully!");
    }
  }, [actionData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const userConfirmed = window.confirm(
      "Are you sure you want to submit the form?",
    );

    if (userConfirmed) {
      const formData = new FormData(formRef.current); // Get form data
      submit(formData, { method: "post" }); // Proceed with form submission
    } else {
      toast.info("Form submission cancelled.");
    }
  };

  return (
    <div className="bg-amber-50/30">
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-100 to-amber-50 py-20 border-b-2 border-amber-900/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-serif text-amber-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-amber-800 max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border-2 border-amber-900/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-900">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">
                    Email Us
                  </h3>
                  <p className="text-amber-800">info@vintagevogue.com</p>
                  <p className="text-amber-800">support@vintagevogue.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border-2 border-amber-900/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-900">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Call Us</h3>
                  <p className="text-amber-800">+1 (555) 123-4567</p>
                  <p className="text-amber-800">Mon-Fri, 9am-6pm EST</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border-2 border-amber-900/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-900">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">
                    Visit Us
                  </h3>
                  <p className="text-amber-800">123 Vintage Lane</p>
                  <p className="text-amber-800">Brooklyn, NY 11201</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border-2 border-amber-900/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-900">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">
                    Store Hours
                  </h3>
                  <p className="text-amber-800">Monday - Friday: 10am - 7pm</p>
                  <p className="text-amber-800">Saturday: 11am - 6pm</p>
                  <p className="text-amber-800">Sunday: 12pm - 5pm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-8 border-2 border-amber-900/10">
              <h2 className="text-3xl font-serif text-amber-900 mb-6">
                Send us a Message
              </h2>
              <Form
                method="POST"
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-amber-900 font-semibold mb-2"
                    >
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="w-full px-4 py-3 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
                      placeholder="John"
                      required
                      minLength={5}
                      maxLength={30}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-amber-900 font-semibold mb-2"
                    >
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className="w-full px-4 py-3 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
                      placeholder="John"
                      required
                      minLength={5}
                      maxLength={30}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-amber-900 font-semibold mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full px-4 py-3 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-amber-900 font-semibold mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-amber-900 font-semibold mb-2"
                  >
                    Subject *
                  </label>
                  <select
                    name="subject"
                    className="w-full px-4 py-3 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
                  >
                    <option value="GENERAL_INQUIRY">General Inquiry</option>
                    <option value="ORDER_STATUS">Order Status</option>
                    <option value="PRODUCT_QUESTION">Product Question</option>
                    <option value="RETURNS_AND_EXCHANGES">
                      Returns & Exchanges
                    </option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-amber-900 font-semibold mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    className="w-full px-4 py-3 border-2 border-amber-900/20 rounded focus:outline-none focus:border-amber-900"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-900 text-amber-50 py-4 rounded hover:bg-amber-800 transition text-lg font-semibold"
                >
                  {isSubmitting ? "Submitting..." : "Send Message"}
                </button>
              </Form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-serif text-amber-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "How do I know if an item will fit?",
                answer:
                  "We provide detailed measurements for each item. Check our size guide and compare with your measurements.",
              },
              {
                question: "What is your return policy?",
                answer:
                  "We offer a 30-day return policy on all items. Items must be in original condition with tags attached.",
              },
              {
                question: "Are your items authentic vintage?",
                answer:
                  "Yes! Every piece is carefully authenticated and sourced from reputable vintage suppliers.",
              },
              {
                question: "How long does shipping take?",
                answer:
                  "Domestic orders typically arrive within 3-5 business days. International shipping varies by location.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 border-2 border-amber-900/10"
              >
                <h3 className="font-semibold text-amber-900 text-lg mb-3">
                  {faq.question}
                </h3>
                <p className="text-amber-800">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function contactAction({ request, params }) {
  const data = await request.formData();

  const contactData = {
    firstName: data.get("firstName"),
    lastName: data.get("lastName"),
    email: data.get("email"),
    phone: data.get("phone"),
    subject: data.get("subject"),
    message: data.get("message"),
  };

  try {
    await apiClient.post("/contacts", contactData);
    return { success: true };
  } catch (error) {
    throw new Response(
      error.message || "Failed to submit your message. Please try again.",
      { status: error.status || 500 },
    );
  }
}
