import Link from 'next/link';
import { BookOpen, Trophy, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col font-sans">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#1e3a5f]">
            <span className="block">Prepare Smarter.</span>
            <span className="block text-[#3b82f6] mt-2">Quiz Better.</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A focused practice platform for PABSON SMART MIND 2083.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-[#3b82f6] text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-sm text-lg flex items-center justify-center"
            >
              Start Practice
            </Link>
            <Link 
              href="/about" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#1e3a5f] font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors shadow-sm text-lg flex items-center justify-center"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 text-[#3b82f6] rounded-xl mb-6">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">Practice Everything</h3>
            <p className="text-gray-600 leading-relaxed">
              Academic · GK · Current Affairs · Science · Sports · Audio Visual
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 text-[#3b82f6] rounded-xl mb-6">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">Train Like Competition</h3>
            <p className="text-gray-600 leading-relaxed">
              General · Buzzer · Rapid Fire · Audio Visual
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 text-[#3b82f6] rounded-xl mb-6">
              <BarChart3 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">Know Your Weakness</h3>
            <p className="text-gray-600 leading-relaxed">
              Track accuracy, speed and topic mastery
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-auto py-12 text-center text-sm text-gray-500">
        <p className="font-semibold text-[#1e3a5f] mb-2">SMART MIND — PABSON Inter-School Quiz Training 2083</p>
        <p>Learn • Practice • Improve • Compete</p>
      </footer>
    </div>
  );
}
