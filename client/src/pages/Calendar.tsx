import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Calendar as CalendarIcon, AlertCircle, Droplets, Sprout } from "lucide-react";
import { Link } from "wouter";

const bangladeshCalendar = [
  {
    month: "January",
    season: "Rabi (Winter)",
    crops: ["Wheat", "Potato", "Lentil", "Chickpea", "Mustard"],
    activities: ["Harvesting of Rabi crops", "Land preparation for Kharif"],
    irrigation: "Moderate - 3-4 irrigations for wheat",
    awd: false,
  },
  {
    month: "February",
    season: "Rabi (Winter)",
    crops: ["Wheat", "Potato", "Lentil", "Chickpea", "Mustard"],
    activities: ["Harvesting continues", "Fertilizer application for Kharif"],
    irrigation: "Moderate - 2-3 irrigations",
    awd: false,
  },
  {
    month: "March",
    season: "Rabi/Zaid",
    crops: ["Wheat", "Potato", "Summer vegetables", "Mungbean"],
    activities: ["Final Rabi harvest", "Zaid crop planting"],
    irrigation: "Moderate - 2 irrigations",
    awd: false,
  },
  {
    month: "April",
    season: "Zaid (Summer)",
    crops: ["Mungbean", "Jute", "Okra", "Cucumber", "Watermelon"],
    activities: ["Zaid crop establishment", "Kharif land preparation"],
    irrigation: "High - 4-5 irrigations",
    awd: false,
  },
  {
    month: "May",
    season: "Zaid/Kharif",
    crops: ["Mungbean", "Jute", "Summer vegetables", "Rice seedbed"],
    activities: ["Zaid crop growth", "Rice seedbed preparation"],
    irrigation: "High - 4-5 irrigations",
    awd: false,
  },
  {
    month: "June",
    season: "Kharif (Monsoon)",
    crops: ["Rice (T. Aman)", "Jute", "Eggplant", "Okra"],
    activities: ["Rice transplanting", "Monsoon crop establishment"],
    irrigation: "Low - Rainfall sufficient",
    awd: true,
  },
  {
    month: "July",
    season: "Kharif (Monsoon)",
    crops: ["Rice (T. Aman)", "Jute", "Eggplant", "Okra", "Brinjal"],
    activities: ["Rice growth phase", "AWD technique application"],
    irrigation: "Apply AWD for rice",
    awd: true,
  },
  {
    month: "August",
    season: "Kharif (Monsoon)",
    crops: ["Rice (T. Aman)", "Jute", "Eggplant", "Okra"],
    activities: ["Rice panicle initiation", "Jute harvesting"],
    irrigation: "Apply AWD for rice",
    awd: true,
  },
  {
    month: "September",
    season: "Kharif (Monsoon)",
    crops: ["Rice (T. Aman)", "Eggplant", "Okra", "Brinjal"],
    activities: ["Rice grain filling", "Kharif crop maintenance"],
    irrigation: "Apply AWD for rice",
    awd: true,
  },
  {
    month: "October",
    season: "Kharif/Rabi",
    crops: ["Rice (T. Aman)", "Potato", "Lentil", "Wheat"],
    activities: ["Rice harvesting", "Rabi crop planting"],
    irrigation: "Reduce for rice, start for Rabi",
    awd: true,
  },
  {
    month: "November",
    season: "Rabi (Winter)",
    crops: ["Wheat", "Potato", "Lentil", "Chickpea", "Mustard"],
    activities: ["Rabi crop establishment", "Rice harvesting"],
    irrigation: "Moderate - 2-3 irrigations",
    awd: false,
  },
  {
    month: "December",
    season: "Rabi (Winter)",
    crops: ["Wheat", "Potato", "Lentil", "Chickpea", "Mustard"],
    activities: ["Rabi crop growth", "Fertilizer application"],
    irrigation: "Moderate - 2-3 irrigations",
    awd: false,
  },
];

export default function Calendar() {
  const { user } = useAuth();
  const currentMonth = new Date().getMonth();
  const currentMonthData = bangladeshCalendar[currentMonth];

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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bangladesh Agricultural Calendar</h2>
          <p className="text-gray-600">Seasonal crop calendar and advisory for optimal farming practices</p>
        </div>

        {/* Current Month Advisory */}
        {currentMonthData && (
          <Card className="mb-8 border-l-4 border-l-green-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-green-600" />
                Current Month Advisory - {currentMonthData.month}
              </CardTitle>
              <CardDescription>{currentMonthData.season}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-green-600" />
                    Recommended Crops
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentMonthData.crops.map((crop) => (
                      <span key={crop} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    Farm Activities
                  </h4>
                  <ul className="space-y-2">
                    {currentMonthData.activities.map((activity) => (
                      <li key={activity} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-cyan-600" />
                  Irrigation Guidance
                </h4>
                <p className="text-gray-700">{currentMonthData.irrigation}</p>
                {currentMonthData.awd && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-2">💧 AWD Technique Active</p>
                    <p className="text-sm text-blue-800">
                      Apply Alternate Wetting and Drying (AWD) technique for rice to save water and improve soil health.
                      Keep field flooded for 5-7 days, then allow it to dry until soil cracks appear (2-3 cm depth).
                      Repeat this cycle until 2 weeks before harvest.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Full Year Calendar */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Full Year Calendar</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bangladeshCalendar.map((month, index) => (
              <Card key={index} className={month.month === currentMonthData?.month ? "border-2 border-green-600" : ""}>
                <CardHeader>
                  <CardTitle className="text-lg">{month.month}</CardTitle>
                  <CardDescription>{month.season}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2">CROPS</p>
                    <div className="flex flex-wrap gap-1">
                      {month.crops.map((crop) => (
                        <span key={crop} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2">ACTIVITIES</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {month.activities.map((activity) => (
                        <li key={activity}>• {activity}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">IRRIGATION</p>
                    <p className="text-xs text-gray-700">{month.irrigation}</p>
                  </div>

                  {month.awd && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-2">
                      <p className="text-xs font-semibold text-blue-900">AWD Active</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Seasonal Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Seasonal Farming Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">🌾 Rabi Season (Nov-Mar)</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Prepare field after monsoon by removing excess water</li>
                <li>• Apply lime if soil pH is below 5.5</li>
                <li>• Use FRG 2024 recommendations for wheat and lentil</li>
                <li>• Maintain 2-3 irrigations for winter crops</li>
                <li>• Monitor for pest and disease outbreaks</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">☀️ Zaid Season (Apr-May)</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Grow short-duration crops like mungbean and jute</li>
                <li>• Ensure adequate irrigation (4-5 times)</li>
                <li>• Apply organic matter before planting</li>
                <li>• Use bio-fertilizers for sustainable production</li>
                <li>• Prepare seedbeds for monsoon rice</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">🌧️ Kharif Season (Jun-Oct)</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Transplant rice during monsoon onset</li>
                <li>• Apply AWD technique to save water and improve soil</li>
                <li>• Use micronutrients (Zn, B) as per soil test</li>
                <li>• Monitor water level during panicle initiation</li>
                <li>• Prepare for harvesting in September-October</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
