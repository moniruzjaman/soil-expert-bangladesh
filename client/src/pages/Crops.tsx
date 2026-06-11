import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Leaf, TrendingUp, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const AEZ_CODES = ["AEZ-1", "AEZ-2", "AEZ-3", "AEZ-4", "AEZ-5", "AEZ-7"];
const SEASONS = ["Kharif", "Rabi", "Zaid"];

export default function Crops() {
  const [selectedAEZ, setSelectedAEZ] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>("");

  const cropSuitabilityQuery = trpc.aez.getCropSuitability.useQuery(
    { aezCode: selectedAEZ },
    { enabled: !!selectedAEZ }
  );
  const croppingPatternsQuery = trpc.aez.getCroppingPatterns.useQuery(
    { aezCode: selectedAEZ },
    { enabled: !!selectedAEZ }
  );

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case "Highly Suitable":
        return "bg-green-100 text-green-800 border-green-300";
      case "Suitable":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Marginally Suitable":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getProfitabilityColor = (profitability: string) => {
    switch (profitability) {
      case "Very High":
        return "text-green-700 font-bold";
      case "High":
        return "text-green-600 font-semibold";
      case "Medium":
        return "text-blue-600 font-semibold";
      default:
        return "text-gray-600";
    }
  };

  const seasonCrops = selectedSeason && cropSuitabilityQuery.data
    ? cropSuitabilityQuery.data[selectedSeason.toLowerCase() as keyof typeof cropSuitabilityQuery.data]
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Leaf className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Precision Khamari</h1>
            </div>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Crop Suitability Advisor</h2>
          <p className="text-gray-600">Get crop recommendations based on your AEZ and season</p>
        </div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select AEZ</CardTitle>
              <CardDescription>Choose your Agro-Ecological Zone</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedAEZ} onValueChange={setSelectedAEZ}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose AEZ" />
                </SelectTrigger>
                <SelectContent>
                  {AEZ_CODES.map((code) => (
                    <SelectItem key={code} value={code}>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Season</CardTitle>
              <CardDescription>Choose growing season</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedSeason} onValueChange={setSelectedSeason} disabled={!selectedAEZ}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose season" />
                </SelectTrigger>
                <SelectContent>
                  {SEASONS.map((season) => (
                    <SelectItem key={season} value={season}>
                      {season}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Crop Recommendations */}
        {seasonCrops && (
          <div className="space-y-8">
            {/* Suitable Crops */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-green-600" />
                Recommended Crops
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {seasonCrops.map((crop: any, idx: number) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{crop.crop}</CardTitle>
                          <CardDescription className="mt-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm border ${
                              getSuitabilityColor(crop.suitability)
                            }`}>
                              {crop.suitability}
                            </span>
                          </CardDescription>
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">Yield Potential:</p>
                      <p className="font-semibold text-gray-900">{crop.yieldPotential}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Cropping Patterns */}
            {croppingPatternsQuery.data && croppingPatternsQuery.data.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-green-600" />
                  Recommended Cropping Patterns
                </h3>
                <div className="space-y-4">
                  {croppingPatternsQuery.data.map((pattern: any, idx: number) => (
                    <Card key={idx} className="border-l-4 border-l-green-600">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{pattern.pattern}</CardTitle>
                            <CardDescription className="mt-2">{pattern.description}</CardDescription>
                          </div>
                          <span className={`text-sm px-3 py-1 rounded-full bg-gray-100 ${getProfitabilityColor(pattern.profitability)}`}>
                            {pattern.profitability} Profit
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm text-green-900">
                            <strong>Why this pattern?</strong> This cropping pattern is optimized for {selectedAEZ} during {selectedSeason} season, providing better profitability and soil health compared to traditional patterns.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Tips for Success
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-blue-900">
                <p>
                  <strong>Soil Testing:</strong> Get a soil test done before planting to adjust fertilizer recommendations based on actual soil conditions.
                </p>
                <p>
                  <strong>Variety Selection:</strong> Choose high-yielding, disease-resistant varieties suited to your region.
                </p>
                <p>
                  <strong>Irrigation:</strong> Plan irrigation schedule based on crop water requirements and rainfall patterns.
                </p>
                <p>
                  <strong>Pest Management:</strong> Use integrated pest management (IPM) to minimize pesticide use.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {!selectedAEZ && (
          <Card>
            <CardContent className="py-12 text-center">
              <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Select an AEZ above to view crop recommendations</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
