import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">InstantVerify.in</h3>
            <p className="text-sm text-gray-600">
              Real-time background verification services in India with support for ID verification in 195+ countries.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/#features" className="text-sm text-gray-600 hover:text-primary">Features</Link></li>
              <li><Link href="/#services" className="text-sm text-gray-600 hover:text-primary">Services</Link></li>
              <li><Link href="/#pricing" className="text-sm text-gray-600 hover:text-primary">Pricing</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-600 hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/#tenant" className="text-sm text-gray-600 hover:text-primary">Tenant Verification</Link></li>
              <li><Link href="/#domestic" className="text-sm text-gray-600 hover:text-primary">Domestic Help Verification</Link></li>
              <li><Link href="/#driver" className="text-sm text-gray-600 hover:text-primary">Driver Verification</Link></li>
              <li><Link href="/#visitor" className="text-sm text-gray-600 hover:text-primary">Visitor Verification</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+919808494950" className="text-sm text-gray-600 hover:text-primary">+91-9808494950</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@instantverify.in" className="text-sm text-gray-600 hover:text-primary">support@instantverify.in</a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1" />
                <span className="text-sm text-gray-600">India</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-center text-gray-600">
            © {new Date().getFullYear()} InstantVerify.in. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}