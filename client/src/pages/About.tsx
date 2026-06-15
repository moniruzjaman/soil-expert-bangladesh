import { Leaf, Mail, MapPin, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Leaf className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Precision Khamari</h1>
            </div>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Precision Khamari</h1>
          <p className="text-xl text-gray-600">
            Professional soil advisory and agricultural guidance powered by 2024 Bangladesh agronomic data and AI
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg text-gray-700 mb-4">
                Precision Khamari is dedicated to empowering Bangladeshi farmers with professional-grade soil science and agricultural advisory services. We combine traditional farming wisdom with modern agronomic research to help farmers make informed decisions about soil health, fertilizer management, irrigation, and crop selection.
              </p>
              <p className="text-lg text-gray-700">
                Our platform provides GPS-based AEZ detection, FRG 2024 fertilizer recommendations, and AI-powered expert guidance in both Bangla and English—all tailored to Bangladesh's diverse agricultural regions.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">GPS-based AEZ detection with auto-populated soil data</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">FRG 2024 fertilizer recommendations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">AWD irrigation technique for rice</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">AI-powered soil expert chat (Bangla/English)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Efficiency analysis and yield tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Sources & References</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fertilizer Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">
                  Based on the official <strong>Fertilizer Recommendation Guide (FRG) 2024</strong> published by the Bangladesh Agricultural Research Council (BARC).
                </p>
                <p className="text-sm text-gray-600">
                  Includes NPK recommendations, micronutrient guidance, liming requirements, and organic/bio-fertilizer suggestions for all major crops.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AEZ Soil Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">
                  Soil data derived from Bangladesh's <strong>Agroecological Zones (AEZ)</strong> classification system covering all 30 AEZs.
                </p>
                <p className="text-sm text-gray-600">
                  Includes default soil pH, organic matter status, fertility class, and crop suitability for each zone.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Irrigation Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">
                  Irrigation advisory based on <strong>Bangladesh Water Development Board (BWDB)</strong> guidelines and crop water requirement research.
                </p>
                <p className="text-sm text-gray-600">
                  Includes AWD technique for rice, region-specific tips for Kurigram/Rangpur, and water-saving strategies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Crop Suitability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">
                  Crop recommendations based on <strong>Bangladesh Agricultural Research Institute (BARI)</strong> research and AEZ compatibility matrices.
                </p>
                <p className="text-sm text-gray-600">
                  Covers Kharif, Rabi, and Zaid seasons with cropping patterns and climate-smart agriculture practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Credibility Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Credibility & Expertise</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-green-600 pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900">Scientific Foundation</h3>
              <p className="text-gray-700 mt-2">
                All recommendations are grounded in peer-reviewed agricultural research, official government guidelines (BARC, BARI, BWDB), and 2024 Bangladesh agronomic data.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900">Local Expertise</h3>
              <p className="text-gray-700 mt-2">
                The platform is specifically designed for Bangladesh's agricultural context, including region-specific guidance for Kurigram, Rangpur, and all other districts.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Intelligence</h3>
              <p className="text-gray-700 mt-2">
                Our AI assistant is trained on Bangladesh soil science, fertilizer management, irrigation techniques, and crop advisory—providing contextual answers in Bangla and English.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-6 py-2">
              <h3 className="text-lg font-semibold text-gray-900">Farmer-Centric Design</h3>
              <p className="text-gray-700 mt-2">
                Built with input from agricultural extension officers, soil scientists, and farmers to ensure practical, actionable guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-gray-700">support@precisionkhamari.bd</p>
                <p className="text-sm text-gray-600 mt-1">For questions, feedback, or technical support</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Location</h3>
                <p className="text-gray-700">Bangladesh</p>
                <p className="text-sm text-gray-600 mt-1">Serving farmers across all AEZs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Improve Your Farm?</h2>
          <p className="text-lg text-green-100 mb-6">
            Start using Precision Khamari today for professional soil advisory and crop guidance
          </p>
          <Link href="/">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Precision Khamari. All rights reserved.</p>
          <p className="text-sm mt-2">Professional Soil Advisory for Bangladeshi Farmers</p>
        </div>
      </footer>
    </div>
  );
}
