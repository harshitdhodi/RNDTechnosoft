import React, { useState } from 'react';

const CollaborationInquiries = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    foundUs: '',
    collaboration: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 mt-32">
      <h1 className="text-4xl font-bold mb-4">Collaboration inquiries</h1>
      <p className="mb-6">At Kolm, we value the power of partnerships and believe in rewarding those who help us grow.</p>

      <h2 className="text-2xl font-bold mb-2">Referral Program</h2>
      <p className="mb-6">
        Do you know someone who could benefit from our services? Refer them to Kolm and you'll receive a 10% commission on the net sale. It's our way of
        saying thank you for spreading the word and supporting our mission which is to revolutionize the way businesses manage their design and website needs
        through our innovative subscription-based model, offering unlimited design services and comprehensive website packages. Fill out the form to get
        started.
      </p>

      <h2 className="text-2xl font-bold mb-2">PR Inquiries</h2>
      <p className="mb-6">
        Are you a PR professional, influencer, or YouTube creator interested in collaborating with us? We'd love to hear from you! Fill out the form below, and our
        team will respond within 24 hours.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name (required)</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-[#F7F4F4]"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Company (required)</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-[#F7F4F4]"
            placeholder="Your company name"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Email (required)</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-[#F7F4F4]"
            placeholder="Your working email"
            required
          />
        </div>

        <div>
          <label className="block mb-1">How did you find out about us? (required)</label>
          <select
            name="foundUs"
            value={formData.foundUs}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-[#F7F4F4]"
            required
          >
            <option value="">Select an option</option>
            <option value="Clutch">Clutch</option>
            <option value="Shopify expert list">Shopify expert list</option>
            <option value="Google Search">Google Search</option>
            <option value="Google Map">Google Map</option>
            <option value="Social media post">Social media post</option>
            <option value="Social media app">Social media app</option>

            {/* Add more options as needed */}
          </select>
        </div>

        <div>
          <label className="block mb-1">How do you envision collaborating with us?</label>
          <textarea
            name="collaboration"
            value={formData.collaboration}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-[#F7F4F4]"
            placeholder="Please explain"
            rows="4"
          ></textarea>
        </div>

        <button type="submit" className="bg-black text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CollaborationInquiries;