import type { Metadata } from "next"
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  HelpCircle,
  Truck,
  CreditCard,
  Package,
  RefreshCw,
  ShieldCheck,
  Mail,
  Phone,
  MessageSquare,
  ChevronRight,
  Search,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Help Center | Fashion Fuel",
  description: "Get help with your orders and find answers to common questions",
}

export default function HelpCenterPage() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className=" bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            How can we help you today?
          </h1>
          
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search for answers..."
              className="pl-10 pr-4 py-6 rounded-lg w-full text-base bg-white"
            />
            <Button className="absolute right-1.5 top-1.5 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
              Search
            </Button>
          </div>
        </div>
      </div>
      
      {/* Help Topics */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Popular Help Topics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-3">
              <Truck className="h-6 w-6 text-black mb-2" />
              <CardTitle>Shipping & Delivery</CardTitle>
              <CardDescription>
                Get information about shipping options, delivery times, and tracking orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/help/shipping" className="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center">
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-3">
              <RefreshCw className="h-6 w-6 text-indigo-500 mb-2" />
              <CardTitle>Returns & Exchanges</CardTitle>
              <CardDescription>
                Learn about our return policy, how to initiate a return, and exchange items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/help/returns" className="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center">
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CreditCard className="h-6 w-6 text-indigo-500 mb-2" />
              <CardTitle>Payment & Billing</CardTitle>
              <CardDescription>
                Information about payment methods, billing issues, and refunds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/help/payment" className="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center">
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-3">
              <Package className="h-6 w-6 text-indigo-500 mb-2" />
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                How to place orders, modify orders, and check order status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/help/orders" className="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center">
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-3">
              <ShieldCheck className="h-6 w-6 text-indigo-500 mb-2" />
              <CardTitle>Account & Privacy</CardTitle>
              <CardDescription>
                Manage your account, privacy settings, and password reset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/help/account" className="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center">
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-3">
              <HelpCircle className="h-6 w-6 text-indigo-500 mb-2" />
              <CardTitle>General Questions</CardTitle>
              <CardDescription>
                Find answers to the most common questions about our store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/help/faq" className="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center">
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-medium">
                How long will it take to receive my order?
              </AccordionTrigger>
              <AccordionContent>
                Standard delivery typically takes 3-5 business days within the country. 
                International shipping may take 7-14 business days. Expedited shipping 
                options are available at checkout for faster delivery. You can track your 
                order anytime from your account dashboard.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-medium">
                What is your return policy?
              </AccordionTrigger>
              <AccordionContent>
                We offer a 30-day return policy on most items. The products must be in their 
                original condition with tags attached and in original packaging. To initiate 
                a return, go to your order history, select the order, and follow the return 
                instructions. Once we receive the returned items, your refund will be processed 
                within 5-7 business days.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-medium">
                How can I track my order?
              </AccordionTrigger>
              <AccordionContent>
                You can track your order by logging into your account and viewing your order 
                history. Each shipped order will have a tracking number that you can use to 
                follow your package's journey. We also send email notifications with tracking 
                information when your order ships.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left font-medium">
                What payment methods do you accept?
              </AccordionTrigger>
              <AccordionContent>
                We accept all major credit cards (Visa, Mastercard, American Express), 
                debit cards, PayPal, Apple Pay, and Google Pay. All payment information is 
                securely processed through our payment provider, Stripe. We never store your 
                full credit card details on our servers.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left font-medium">
                Can I change or cancel my order after it's been placed?
              </AccordionTrigger>
              <AccordionContent>
                You can modify or cancel your order within 1 hour of placing it. To do so, 
                contact our customer service team immediately. Once an order has begun 
                processing or has shipped, it cannot be modified or canceled. In such cases, 
                you would need to wait for delivery and then follow our return process.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left font-medium">
                Do you offer international shipping?
              </AccordionTrigger>
              <AccordionContent>
                Yes, we ship to most countries worldwide. International shipping rates and 
                delivery times vary by destination. Any applicable customs duties and taxes 
                are the responsibility of the customer and are not included in our shipping 
                charges. These may be collected upon delivery.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      
      {/* Contact Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still need help?
          </h2>
          <p className="text-gray-600 mb-8">
            Our customer service team is here to help you with any questions or concerns
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-white hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="mt-4">Email Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">We'll respond within 24 hours</p>
                <Button 
                  asChild 
                  variant="outline" 
                  className="border-2 border-black text-black hover:bg-black/2"
                >
                  <a href="mailto:support@fashionfuel.com">
                    support@fashionfuel.com
                  </a>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="mt-4">Call Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Mon-Fri, 9 AM - 6 PM</p>
                <Button 
                  asChild 
                  variant="outline" 
                  className="border-2 border-black text-black hover:bg-black/2"
                >
                  <a href="tel:+1800555123">
                    +1 (800) 555-123
                  </a>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="mt-4">Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Instant support</p>
                <Button className="bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}