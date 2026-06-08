import Link from 'next/link'
import { Wheat, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-pakagri-primary text-pakagri-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Wheat className="w-8 h-8 text-pakagri-gold" />
              <span className="font-display text-2xl text-white">
                Pak<span className="text-pakagri-gold">Agri</span>
              </span>
            </div>
            <p className="text-pakagri-cream/80 mb-4 max-w-md">
              Empowering Pakistani farmers with AI-driven crop recommendations and yield predictions.
            </p>
            <p className="font-urdu text-pakagri-gold text-lg">کسان کا ڈیجیٹل ساتھی</p>
          </div>
          <div>
            <h3 className="font-display text-lg text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-pakagri-cream/80 hover:text-pakagri-gold transition-colors">Home</Link></li>
              <li><Link href="/dashboard" className="text-pakagri-cream/80 hover:text-pakagri-gold transition-colors">Dashboard</Link></li>
              <li><Link href="/accuracy" className="text-pakagri-cream/80 hover:text-pakagri-gold transition-colors">Model Accuracy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-lg text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-pakagri-cream/80">
                <Mail className="w-4 h-4 text-pakagri-gold" />
                <span>support@pakagri.pk</span>
              </li>
              <li className="flex items-center gap-2 text-pakagri-cream/80">
                <Phone className="w-4 h-4 text-pakagri-gold" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-start gap-2 text-pakagri-cream/80">
                <MapPin className="w-4 h-4 text-pakagri-gold mt-1" />
                <span>Islamabad, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-pakagri-primary-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-pakagri-cream/60 text-sm">&copy; {new Date().getFullYear()} PakAgri. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
