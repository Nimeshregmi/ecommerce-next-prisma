import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/sign-in" className="text-gray-600 hover:text-gray-900">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/auth/sign-up" className="text-gray-600 hover:text-gray-900">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/gift-card" className="text-gray-600 hover:text-gray-900">
                  Redeem a Gift Card
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="text-gray-600 hover:text-gray-900">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-info" className="text-gray-600 hover:text-gray-900">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/bulk-orders" className="text-gray-600 hover:text-gray-900">
                  Bulk Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Get Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help-center" className="text-gray-600 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/feedback" className="text-gray-600 hover:text-gray-900">
                  Feedback
                </Link>
              </li>
              <li>
                <Link href="https://instagram.com" className="text-gray-600 hover:text-gray-900">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="https://twitter.com" className="text-gray-600 hover:text-gray-900">
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between space-y-4 border-t border-gray-200 pt-8 md:flex-row md:space-y-0">
          <div className="flex space-x-4 text-xs text-gray-500">
            <Link href="/privacy-policy" className="hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-gray-900">
              Terms of Service
            </Link>
            <Link href="/sitemap-pages" className="hover:text-gray-900">
              Sitemap Pages
            </Link>
            <Link href="/sitemap-products" className="hover:text-gray-900">
              Sitemap Products
            </Link>
          </div>

          <div className="text-xs text-gray-500">© {new Date().getFullYear()} All Rights Reserved</div>
        </div>
      </div>
    </footer>
  )
}
