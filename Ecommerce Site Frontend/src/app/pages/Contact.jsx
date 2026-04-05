import { Mail, Phone, MapPin, Clock } from "lucide-react";
import apiClient from "../../api/apiClient";
import { CONTACT_PAGE_CONTENT } from "../../config";
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
  const iconMap = {
    mail: Mail,
    phone: Phone,
    mapPin: MapPin,
    clock: Clock,
  };

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
    <div className="bg-[#f5f0e8]">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#f0e7d8] to-[#f7f1e8] py-20 border-b-2 border-stone-300">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-serif text-stone-900 mb-6">
            {CONTACT_PAGE_CONTENT.hero.title}
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            {CONTACT_PAGE_CONTENT.hero.subtitle}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {CONTACT_PAGE_CONTENT.contactCards.map((card, index) => {
              const CardIcon = iconMap[card.icon] ?? Mail;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 border-2 border-stone-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-900">
                      <CardIcon size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-900 mb-2">
                        {card.title}
                      </h3>
                      {card.lines.map((line, lineIndex) => (
                        <p key={lineIndex} className="text-stone-600">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-8 border-2 border-stone-200">
              <h2 className="text-3xl font-serif text-stone-900 mb-6">
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
                      className="block text-stone-900 font-semibold mb-2"
                    >
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="w-full px-4 py-3 border-2 border-stone-300 rounded focus:outline-none focus:border-amber-300"
                      placeholder="John"
                      required
                      minLength={5}
                      maxLength={30}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-stone-900 font-semibold mb-2"
                    >
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className="w-full px-4 py-3 border-2 border-stone-300 rounded focus:outline-none focus:border-amber-300"
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
                    className="block text-stone-900 font-semibold mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full px-4 py-3 border-2 border-stone-300 rounded focus:outline-none focus:border-amber-300"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-stone-900 font-semibold mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 border-2 border-stone-300 rounded focus:outline-none focus:border-amber-300"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-stone-900 font-semibold mb-2"
                  >
                    Subject *
                  </label>
                  <select
                    name="subject"
                    className="w-full px-4 py-3 border-2 border-stone-300 rounded focus:outline-none focus:border-amber-300"
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
                    className="block text-stone-900 font-semibold mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    className="w-full px-4 py-3 border-2 border-stone-300 rounded focus:outline-none focus:border-amber-300"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-stone-900 text-white py-4 rounded hover:bg-stone-700 transition text-lg font-semibold"
                >
                  {isSubmitting ? "Submitting..." : "Send Message"}
                </button>
              </Form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-serif text-stone-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CONTACT_PAGE_CONTENT.faq.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 border-2 border-stone-200"
              >
                <h3 className="font-semibold text-stone-900 text-lg mb-3">
                  {faq.question}
                </h3>
                <p className="text-stone-600">{faq.answer}</p>
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
