import React from 'react';
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Fashion Fuel",
  description: "Our terms and conditions for using our services",
};

const TermsOfServicePage = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-secondary/5 to-primary/5 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl opacity-50" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">Terms of Service</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-center">
            Please read these terms carefully before using our platform
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
                Welcome to Your Ecommerce. These Terms of Service govern your use of our website and services offered by us. By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access our website.
              </p>
              <p className="text-muted-foreground">
                Our platform offers various products and services that enable users to browse, select, and purchase products. By using our services, you agree to abide by these terms and our Privacy Policy.
              </p>
            </div>
          </section>

          {/* Account Terms */}
          <section className="mb-12">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
                <span className=" w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                  <ChevronRight size={16} />
                </span>
                Account Terms
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg text-foreground">Account Creation</h3>
                  <p className="text-muted-foreground">
                    To use certain features of our website, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-lg text-foreground">Account Responsibilities</h3>
                  <p className="text-muted-foreground">
                    You are responsible for:
                  </p>
                  <ul className="list-disc ml-6 mt-2 text-muted-foreground">
                    <li>Maintaining the confidentiality of your account and password</li>
                    <li>Restricting access to your computer and/or account</li>
                    <li>Accepting responsibility for any and all activities that occur under your account</li>
                    <li>Notifying us immediately upon becoming aware of any breach of security or unauthorized use of your account</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Purchase and Payment Terms */}
          <section className="mb-12">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
                <span className=" w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                  <ChevronRight size={16} />
                </span>
                Purchase and Payment Terms
              </h2>
              <p className="text-muted-foreground mb-4">
                When making a purchase through our platform, you agree to the following terms:
              </p>
              <ul className="space-y-4 text-muted-foreground">
                <li className="pl-5 relative">
                  <span className="absolute left-0 top-2 w-2 h-2 bg-primary rounded-full"></span>
                  <p><span className="font-medium text-foreground">Product Information:</span> We strive to display our products and their colors as accurately as possible. However, we cannot guarantee that your computer monitor's display of any color will be accurate.</p>
                </li>
                <li className="pl-5 relative">
                  <span className="absolute left-0 top-2 w-2 h-2 bg-primary rounded-full"></span>
                  <p><span className="font-medium text-foreground">Pricing:</span> All prices are shown in the applicable currency and do not include taxes and shipping costs unless otherwise stated. We reserve the right to change prices at any time.</p>
                </li>
                <li className="pl-5 relative">
                  <span className="absolute left-0 top-2 w-2 h-2 bg-primary rounded-full"></span>
                  <p><span className="font-medium text-foreground">Payment:</span> We accept various forms of payment. By placing an order, you represent that you are authorized to use the designated payment method.</p>
                </li>
                <li className="pl-5 relative">
                  <span className="absolute left-0 top-2 w-2 h-2 bg-primary rounded-full"></span>
                  <p><span className="font-medium text-foreground">Order Acceptance:</span> Your receipt of an electronic or other form of order confirmation does not constitute our acceptance of your order. We reserve the right to limit or cancel any order at our sole discretion.</p>
                </li>
              </ul>
            </div>
          </section>

          {/* Shipping and Delivery */}
          <section className="mb-12">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
                <span className=" w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                  <ChevronRight size={16} />
                </span>
                Shipping and Delivery
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We ship to the addresses provided by you during the checkout process. Please ensure your shipping address is accurate and complete.
                </p>
                
                <div className="bg-background p-5 rounded-lg border border-border">
                  <h3 className="font-medium text-lg text-foreground mb-2">Delivery Times</h3>
                  <p className="text-muted-foreground mb-2">
                    Estimated delivery times are as follows:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <div className="text-foreground font-medium">Standard Shipping</div>
                      <div className="text-muted-foreground">3-5 business days</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-foreground font-medium">Express Shipping</div>
                      <div className="text-muted-foreground">1-2 business days</div>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground">
                  Please note that delivery times are estimates and are not guaranteed. Delays can occur due to various factors including customs processing for international shipments.
                </p>
              </div>
            </div>
          </section>

          {/* Returns and Refunds */}
          <section className="mb-12">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
                <span className=" w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                  <ChevronRight size={16} />
                </span>
                Returns and Refunds
              </h2>
              <p className="text-muted-foreground mb-4">
                We want you to be completely satisfied with your purchase. If you're not entirely happy, we offer the following return and refund policy:
              </p>
              
              <div className="space-y-6">
                <div className="bg-background p-4 rounded-lg border border-border">
                  <h3 className="font-medium text-foreground mb-2">Return Period</h3>
                  <p className="text-sm text-muted-foreground">
                    You have 30 days from the date of delivery to return most items for a full refund.
                  </p>
                </div>
                
                <div className="bg-background p-4 rounded-lg border border-border">
                  <h3 className="font-medium text-foreground mb-2">Return Conditions</h3>
                  <p className="text-sm text-muted-foreground">
                    Items must be unused, in their original condition and packaging with all tags attached.
                  </p>
                </div>
                
                <div className="bg-background p-4 rounded-lg border border-border">
                  <h3 className="font-medium text-foreground mb-2">Refund Process</h3>
                  <p className="text-sm text-muted-foreground">
                    Once we receive and inspect the returned item, we will process your refund to the original payment method within 5-7 business days.
                  </p>
                </div>
                
                <div className="bg-background p-4 rounded-lg border border-border">
                  <h3 className="font-medium text-foreground mb-2">Non-Returnable Items</h3>
                  <p className="text-sm text-muted-foreground">
                    Certain items cannot be returned, including perishable goods, personalized items, and downloadable products.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
                <span className=" w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                  <ChevronRight size={16} />
                </span>
                Intellectual Property
              </h2>
              <p className="text-muted-foreground mb-4">
                The content on our website, including text, graphics, logos, button icons, images, audio clips, and software, is the property of our company or our content suppliers and is protected by international copyright laws.
              </p>
              <div className="p-4 bg-destructive/5 border border-destructive/10 rounded-lg">
                <p className="text-foreground font-medium mb-2">Important Notice:</p>
                <p className="text-muted-foreground">
                  You may not reproduce, distribute, display, sell, lease, transmit, create derivative works from, translate, modify, reverse-engineer, disassemble, decompile, or otherwise exploit this website or any portion of it without our explicit written permission.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
                <span className=" w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                  <ChevronRight size={16} />
                </span>
                Limitation of Liability
              </h2>
              <p className="text-muted-foreground mb-4">
                In no event shall we, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.
              </p>
              <p className="text-muted-foreground">
                Because some states or jurisdictions do not allow the exclusion or the limitation of liability for consequential or incidental damages, in such states or jurisdictions, our liability shall be limited to the maximum extent permitted by law.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
                <span className=" w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                  <ChevronRight size={16} />
                </span>
                Termination
              </h2>
              <p className="text-muted-foreground mb-4">
                We may terminate or suspend your account and bar access to our service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
              <div className="bg-background p-4 rounded-lg">
                <p className="text-muted-foreground">
                  If you wish to terminate your account, you may simply discontinue using our service or contact our support team to request account deletion.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Questions About Terms</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us at:
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

export default TermsOfServicePage;