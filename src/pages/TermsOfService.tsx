import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 font-inter">
            Terms of Service
          </h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> January 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-inter">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 mb-4">
                By accessing and using GoDex ("the Service"), you accept and agree to be bound by the 
                terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-inter">
                2. Description of Service
              </h2>
              <p className="text-gray-700 mb-4">
                GoDex is a deal management platform designed for private credit professionals, 
                including borrowers, brokers, and lenders. Our services include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Deal creation and management tools</li>
                <li>Secure document sharing and collaboration</li>
                <li>Communication and messaging features</li>
                <li>Analytics and reporting capabilities</li>
                <li>User management and access controls</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-inter">
                3. User Accounts
              </h2>
              <p className="text-gray-700 mb-4">
                To access certain features of the Service, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Ensuring your account information is up to date</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-inter">
                4. Acceptable Use
              </h2>
              <p className="text-gray-700 mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Upload or transmit malicious code or content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the Service</li>
                <li>Use the Service for any illegal or unauthorized purpose</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-inter">
                5. Intellectual Property
              </h2>
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and functionality are owned by GoDex 
                and are protected by international copyright, trademark, patent, trade secret, and 
                other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-inter">
                6. Privacy and Data Protection
              </h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs 
                your use of the Service, to understand our practices regarding the collection and use 
                of your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-inter">
                7. Payment Terms
              </h2>
              <p className="text-gray-700 mb-4">
                Some features of the Service may require payment. By subscribing to paid services, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Pay all fees in advance</li>
                <li>Provide accurate billing information</li>
                <li>Authorize recurring charges as applicable</li>
                <li>Notify us of any billing disputes within 30 days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-inter">
                8. Limitation of Liability
              </h2>
              <p className="text-gray-700 mb-4">
                In no event shall GoDex, nor its directors, employees, partners, agents, suppliers, 
                or affiliates, be liable for any indirect, incidental, special, consequential, or 
                punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                or other intangible losses, resulting from your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-inter">
                9. Disclaimers
              </h2>
              <p className="text-gray-700 mb-4">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. GoDex makes no 
                warranties, expressed or implied, and hereby disclaims all warranties, including 
                without limitation, implied warranties of merchantability, fitness for a particular 
                purpose, and non-infringement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-inter">
                10. Termination
              </h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and bar access to the Service immediately, 
                without prior notice or liability, under our sole discretion, for any reason 
                whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-inter">
                11. Governing Law
              </h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be interpreted and governed by the laws of [Jurisdiction], 
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-inter">
                12. Changes to Terms
              </h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision is 
                material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-inter">
                13. Contact Information
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@godex.com<br />
                  <strong>Address:</strong> [Company Address]<br />
                  <strong>Phone:</strong> [Phone Number]
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
} 