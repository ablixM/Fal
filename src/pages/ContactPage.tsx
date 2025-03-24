import { useState } from "react";
import PageTransition from "../components/PageTransition";
import { useContactForm } from "../hooks/useContactForm";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const { submitForm, isLoading, isSuccess, isError } = useContactForm();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm(formData);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF0] p-4 md:p-8 lg:p-16 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-8 mb-8">
          <h1 className="contact-title max-w-2xl text-6xl md:text-7xl lg:text-8xl font-bold text-navy-900">
            Let's work together!
          </h1>
          <p className="text-gray-600">
            Fill out this form and we will get back to you in the next 24 hours
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Form Section */}
          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-8">
                <div className="flex flex-row mt-4">
                  <span className="w-6 h-6 rounded-full bg-white border flex items-center justify-center text-lg px-4">
                    01
                  </span>
                  <div className="space-y-2 w-full px-4">
                    <label className="inline-flex items-center space-x-2 text-xl">
                      <span>What is your name?</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Type your full name"
                      className="w-full border-b border-gray-300 bg-transparent py-2 focus:outline-none focus:border-gray-600"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-row mt-4">
                  <span className="w-6 h-6 rounded-full bg-white border flex items-center justify-center text-lg px-4">
                    02
                  </span>
                  <div className="space-y-2 w-full px-4">
                    <label className="inline-flex items-center space-x-2 text-xl">
                      <span>What is your email address?</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className="w-full border-b border-gray-300 bg-transparent py-2 focus:outline-none focus:border-gray-600"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-row mt-4">
                  <span className="w-6 h-6 rounded-full bg-white border flex items-center justify-center text-lg px-4">
                    03
                  </span>
                  <div className="space-y-2 w-full px-4">
                    <label className="inline-flex items-center space-x-2 text-xl">
                      <span>What is your phone number?</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 2222 3333"
                      className="w-full border-b border-gray-300 bg-transparent py-2 focus:outline-none focus:border-gray-600"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-row mt-4">
                  <span className="w-6 h-6 rounded-full bg-white border flex items-center justify-center text-lg px-4">
                    04
                  </span>
                  <div className="space-y-2 w-full px-4">
                    <label className="inline-flex items-center space-x-2 text-xl">
                      <span>Tell us about your message</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please type your message here"
                      className="w-full border-b border-gray-300 bg-transparent py-2 focus:outline-none focus:border-gray-600 resize-none"
                      rows={4}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 border border-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-colors duration-300"
              >
                {isLoading ? "Sending..." : "SEND MESSAGE"}
              </button>

              {isSuccess && (
                <p className="text-green-600">Message sent successfully!</p>
              )}
              {isError && (
                <p className="text-red-600">
                  Error sending message. Please try again.
                </p>
              )}
            </form>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-8 mt-8 md:mt-16">
            <div>
              <h2 className="text-lg font-semibold mb-2">HEADQUARTER</h2>
              <p className="text-gray-600">
                Building 85-95, Muaffah 25, Abu Dhabi UAE
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">CONTACT INFO</h2>
              <p className="text-gray-600">Office phone number: +97124412253</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">EMAIL</h2>
              <p className="text-gray-600">info@faltrading.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTransition(ContactPage);
