import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Leaf, Droplets, Beaker, BookOpen, MessageSquare, BarChart3, BookMarked, Calendar as CalendarIcon, TestTube, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Precision Khamari</h1>
            </div>
            <Button asChild>
              <a href={getLoginUrl()}>Sign In</a>
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Professional Soil Advisory for Bangladeshi Farmers
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Get expert guidance on soil health, fertilizer recommendations, irrigation strategies, and crop management—all powered by 2024 Bangladesh agronomic data and AI.
              </p>
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <a href={getLoginUrl()}>Get Started Free</a>
              </Button>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Beaker className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Soil Health Assessment</h3>
                    <p className="text-sm text-gray-600">GPS-based AEZ detection with auto-populated soil data</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Droplets className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Irrigation Advisory</h3>
                    <p className="text-sm text-gray-600">AWD technique and water-saving strategies for rice</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Leaf className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Fertilizer Recommendations</h3>
                    <p className="text-sm text-gray-600">FRG 2024 based NPK, organic, and bio-fertilizer guidance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Comprehensive Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Beaker,
                  title: "Soil Assessment",
                  description: "Analyze soil texture, pH, and organic matter with AEZ-based auto-detection",
                },
                {
                  icon: Leaf,
                  title: "Crop Suitability",
                  description: "Get crop recommendations based on your land type, season, and soil conditions",
                },
                {
                  icon: Droplets,
                  title: "Irrigation Guide",
                  description: "Learn AWD technique and water-saving strategies for your crops",
                },
                {
                  icon: BarChart3,
                  title: "Fertilizer Engine",
                  description: "Precise NPK, micronutrient, and bio-fertilizer recommendations",
                },
                {
                  icon: MessageSquare,
                  title: "AI Assistant",
                  description: "Chat with our soil expert in Bangla or English for personalized advice",
                },
                {
                  icon: BookOpen,
                  title: "Knowledge Library",
                  description: "Learn soil science, fertilizer types, and climate-smart agriculture",
                },
              ].map((feature, idx) => (
                <Card key={idx} className="border-0 shadow-md">
                  <CardHeader>
                    <feature.icon className="w-8 h-8 text-green-600 mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Improve Your Farm?</h2>
            <p className="text-green-50 text-lg mb-8">
              Join thousands of farmers using Precision Khamari for better soil health and higher yields.
            </p>
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <a href={getLoginUrl()}>Start Free Today</a>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-white font-semibold mb-4">About</h3>
                <p className="text-sm">Precision Khamari provides professional soil advisory for Bangladeshi farmers.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Features</h3>
                <ul className="text-sm space-y-2">
                  <li><a href="#" className="hover:text-white">Soil Assessment</a></li>
                  <li><a href="#" className="hover:text-white">Fertilizer Guide</a></li>
                  <li><a href="#" className="hover:text-white">AI Assistant</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Resources</h3>
                <ul className="text-sm space-y-2">
                  <li><a href="#" className="hover:text-white">Knowledge Base</a></li>
                  <li><a href="#" className="hover:text-white">FAQ</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="text-sm space-y-2">
                  <li><a href="#" className="hover:text-white">Privacy</a></li>
                  <li><a href="#" className="hover:text-white">Terms</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-sm">
              <p>&copy; 2026 Precision Khamari. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Precision Khamari</h1>
          </div>
          <div className="text-sm text-gray-600">Welcome, {user?.name || "Farmer"}!</div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/fields">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <Leaf className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>My Fields</CardTitle>
                <CardDescription>Manage your farm fields</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">View and manage all your fields with soil data and recommendations.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/soil-assessment">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <Beaker className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Soil Assessment</CardTitle>
                <CardDescription>Analyze your soil</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Get soil health insights with GPS-based AEZ detection.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/fertilizer">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <Leaf className="w-8 h-8 text-amber-600 mb-2" />
                <CardTitle>Fertilizer Guide</CardTitle>
                <CardDescription>FRG 2024 recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Get NPK and micronutrient recommendations for your crops.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/irrigation">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <Droplets className="w-8 h-8 text-cyan-600 mb-2" />
                <CardTitle>Irrigation Advisory</CardTitle>
                <CardDescription>Water management</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Learn AWD technique and water-saving strategies.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/crops">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>Crop Suitability</CardTitle>
                <CardDescription>Crop recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Get crop recommendations based on your soil and AEZ.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/chat">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageSquare className="w-8 h-8 text-pink-600 mb-2" />
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>Ask questions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Chat with our soil expert in Bangla or English.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/knowledge">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="w-8 h-8 text-indigo-600 mb-2" />
                <CardTitle>Knowledge Library</CardTitle>
                <CardDescription>Learning resources</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Learn soil science, fertilizers, and climate-smart agriculture.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/records">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CalendarIcon className="w-8 h-8 text-cyan-600 mb-2" />
                <CardTitle>Record Keeping</CardTitle>
                <CardDescription>Track activities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Log soil tests, fertilizer, irrigation, and crop activities.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/soil-test">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <TestTube className="w-8 h-8 text-orange-600 mb-2" />
                <CardTitle>Soil Tests</CardTitle>
                <CardDescription>Lab results</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Record and track soil test results with detailed parameters.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/calendar">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CalendarIcon className="w-8 h-8 text-teal-600 mb-2" />
                <CardTitle>Seasonal Calendar</CardTitle>
                <CardDescription>Crop calendar</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">View Bangladesh agricultural calendar with seasonal crop recommendations.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/yield">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>Yield Tracking</CardTitle>
                <CardDescription>Harvest records</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Record harvest data and monitor productivity trends over time.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
