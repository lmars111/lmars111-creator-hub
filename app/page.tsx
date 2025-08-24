import Link from 'next/link'
import { ArrowRight, MessageCircle, Zap, Shield, Users, Heart, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient">CreatorChat Hub</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/apply" className="text-gray-600 hover:text-purple-600 transition-colors">
                Become a Creator
              </Link>
              <Link href="/c/jess" className="text-gray-600 hover:text-purple-600 transition-colors">
                Browse Creators
              </Link>
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect with creators
              <span className="text-gradient block">like never before</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience personalized chats, exclusive content, and direct connections with your favorite creators. 
              Join the future of creator-fan interactions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/c/jess" 
                className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors"
              >
                Start Chatting <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/apply" 
                className="inline-flex items-center px-8 py-4 border-2 border-purple-600 text-purple-600 font-semibold rounded-full hover:bg-purple-50 transition-colors"
              >
                Become a Creator
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why CreatorChat Hub?</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the next generation of creator-fan connections with our innovative platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Personal Chats</h4>
              <p className="text-gray-600">Direct one-on-one conversations with creators, powered by AI and human representatives</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-pink-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Exclusive Content</h4>
              <p className="text-gray-600">Unlock premium content, behind-the-scenes moments, and personalized messages</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Secure Payments</h4>
              <p className="text-gray-600">Safe and secure transactions with automatic revenue splits and instant payouts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Creator Section */}
      <section className="py-20 bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Meet Jess - Our Demo Creator</h3>
          <p className="text-xl mb-8 opacity-90">
            Experience the platform with our lifestyle creator sharing wellness tips and daily adventures
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b0f4?w=100&h=100&fit=crop&crop=face" 
                alt="Jess Williams"
                className="w-20 h-20 rounded-full border-4 border-white/20"
              />
              <div className="ml-4 text-left">
                <h4 className="text-xl font-semibold">Jess Williams</h4>
                <p className="opacity-80">@jess • Lifestyle Creator</p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-300 mr-1" />
                  <span className="text-sm">248 fans • $1,250 earned</span>
                </div>
              </div>
            </div>
            
            <p className="mb-6 opacity-90">
              &ldquo;Join my community for exclusive wellness content, behind-the-scenes moments, and personal chats! 💕&rdquo;
            </p>
            
            <Link 
              href="/c/jess" 
              className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Chat with Jess <Heart className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">1,248</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-2">$45,670</div>
              <div className="text-gray-600">Creator Earnings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">3,421</div>
              <div className="text-gray-600">Content Unlocks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">892</div>
              <div className="text-gray-600">Active Chats</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">CreatorChat Hub</h4>
              <p className="text-gray-400">Connecting creators and fans through personalized chat experiences.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Platform</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/apply" className="hover:text-white transition-colors">Become a Creator</Link></li>
                <li><Link href="/c/jess" className="hover:text-white transition-colors">Browse Creators</Link></li>
                <li><Link href="/admin/dashboard" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refunds" className="hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link href="/content-policy" className="hover:text-white transition-colors">Content Policy</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Connect</h5>
              <p className="text-gray-400 text-sm">© 2024 CreatorChat Hub. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}