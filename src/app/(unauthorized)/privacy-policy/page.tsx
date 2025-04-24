import React from 'react';
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Fashion Fuel",
  description: "Our commitment to protecting your data and privacy",
};

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl opacity-50" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-center">
            Our commitment to protecting your personal information and being transparent about our practices
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <div className="text-sm text-muted-foreground mb-8">
            Last Updated: April 25, 2025
          </div>

          {/* Introduction Section */}
          <section className="mb-12">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
                <span className=" w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                  <ChevronRight size={16} />
                </span>
                Introduction
              </h2>
              <p className="text-muted-foreground mb-4">
                Thank you for choosing our ecommerce platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make purchases. We respect your privacy and are committed to protecting your personal data.
              </p>
              <p className="text-muted-foreground">
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site.
              </p>
            </div>
          </section>

          {/* Information Collection */}
          <section className="mb-12">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
                <span className=" w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                  <ChevronRight size={16} />
                </span>
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg text-foreground">Personal Data</h3>
                  <p className="text-muted-foreground">
                    We may collect personal identification information, including but not limited to:
                  </p>
                  <ul className="list-disc ml-6 mt-2 text-muted-foreground">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Shipping and billing address</li>
                    <li>Phone number</li>
                    <li>Payment information</li>
                    <li>Date of birth</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-lg text-foreground">Usage Data</h3>
                  <p className="text-muted-foreground">
                    We may also collect information on how the website is accessed and used. This usage data may include:
                  </p>
                  <ul className="list-disc ml-6 mt-2 text-muted-foreground">
                    <li>Your computer's Internet Protocol address</li>
                    <li>Browser type and version</li>
                    <li>Pages of our website that you visit</li>
                    <li>Time and date of your visit</li>
                    <li>Time spent on those pages</li>
                    <li>Products viewed or searched for</li>
                    <li>Purchase history</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
                <span className=" w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                  <ChevronRight size={16} />
                </span>
                How We Use Your Information
              </h2>
              <p className="text-muted-foreground mb-4">
                We may use the information we collect from you for various purposes, including:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></div>
                  <div>
                    <span className="font-medium text-foreground">Process transactions:</span> We use your information to process purchases made on our website.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></div>
                  <div>
                    <span className="font-medium text-foreground">Send emails:</span> We may use your email address to send you order confirmations, updates, and marketing communications.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></div>
                  <div>
                    <span className="font-medium text-foreground">Improve our website:</span> We continually strive to improve our website offerings based on the information and feedback we receive from you.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></div>
                  <div>
                    <span className="font-medium text-foreground">Personalize user experience:</span> We may use information in the aggregate to understand how our users as a group use the services and resources provided on our website.
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Third-Party Disclosure */}
          <section className="mb-12">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
                <span className=" w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                  <ChevronRight size={16} />
                </span>
                Third-Party Disclosure
              </h2>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except as described below:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></div>
                  <div>
                    <span className="font-medium text-foreground">Service providers:</span> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></div>
                  <div>
                    <span className="font-medium text-foreground">Business transfers:</span> If we or our subsidiaries are involved in a merger, acquisition, or asset sale, your personal information may be transferred.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></div>
                  <div>
                    <span className="font-medium text-foreground">Legal requirements:</span> We may disclose your information where we are legally required to do so.
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
                <span className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                  <ChevronRight size={16} />
                </span>
                Your Rights
              </h2>
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background p-4 rounded-lg border border-border">
                  <h3 className="font-medium text-foreground mb-2">Right to Access</h3>
                  <p className="text-sm text-muted-foreground">
                    You have the right to request copies of your personal information.
                  </p>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border">
                  <h3 className="font-medium text-foreground mb-2">Right to Rectification</h3>
                  <p className="text-sm text-muted-foreground">
                    You have the right to request that we correct any information you believe is inaccurate.
                  </p>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border">
                  <h3 className="font-medium text-foreground mb-2">Right to Erasure</h3>
                  <p className="text-sm text-muted-foreground">
                    You have the right to request that we erase your personal data, under certain conditions.
                  </p>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border">
                  <h3 className="font-medium text-foreground mb-2">Right to Restrict Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    You have the right to request that we restrict the processing of your personal data.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions or concerns about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-card p-4 rounded-lg inline-block">
                <p className="font-medium text-foreground">Email: privacy@fashionfuel.com</p>
                <p className="font-medium text-foreground">Phone: (+977) 01-54869</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;