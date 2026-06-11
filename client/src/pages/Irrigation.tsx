import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Leaf, Droplets, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const CROPS = ["Boro Rice", "Wheat", "Potato", "Mungbean"];

export default function Irrigation() {
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const irrigationQuery = trpc.irrigation.getAdvisory.useQuery(
    { cropName: selectedCrop },
    { enabled: !!selectedCrop }
  );

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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Irrigation Advisory</h2>
          <p className="text-gray-600">Learn water management strategies including AWD technique for rice and water-saving tips</p>
        </div>

        {/* Crop Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Crop</CardTitle>
            <CardDescription>Choose a crop to view irrigation recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Choose a crop" />
              </SelectTrigger>
              <SelectContent>
                {CROPS.map((crop) => (
                  <SelectItem key={crop} value={crop}>
                    {crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Irrigation Advisory */}
        {irrigationQuery.data && (
          <div className="space-y-6">
            {/* Water Requirement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  Total Water Requirement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  {irrigationQuery.data.totalWaterRequirement}
                </p>
                <p className="text-gray-600">
                  This is the total water needed for the entire crop season, including rainfall.
                </p>
              </CardContent>
            </Card>

            {/* Irrigation Method */}
            <Card>
              <CardHeader>
                <CardTitle>Irrigation Method</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-gray-900 mb-2">{irrigationQuery.data.irrigationMethod}</p>
                <p className="text-gray-600">
                  {selectedCrop === "Boro Rice"
                    ? "Flood irrigation with AWD (Alternate Wetting and Drying) is recommended for water efficiency."
                    : "Choose the method that best suits your farm infrastructure and water availability."}
                </p>
              </CardContent>
            </Card>

            {/* AWD Technique (for rice) */}
            {irrigationQuery.data && "awd" in irrigationQuery.data && irrigationQuery.data.awd && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Alternate Wetting and Drying (AWD) Technique
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold text-blue-900 mb-2">{irrigationQuery.data.awd.description}</p>
                    <p className="text-blue-800 font-semibold mb-2">
                      Water Saving: {irrigationQuery.data.awd.waterSaving}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-blue-900 mb-2">Application Stages:</p>
                    <ul className="space-y-2">
                      {irrigationQuery.data.awd.stages.map((stage: string, idx: number) => (
                        <li key={idx} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                            {idx + 1}
                          </span>
                          <span className="text-blue-900">{stage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Irrigation Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Irrigation Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{irrigationQuery.data.irrigationSchedule}</p>
              </CardContent>
            </Card>

            {/* Water Saving Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Water-Saving Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {irrigationQuery.data.waterSavingTips.map((tip: string, idx: number) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-semibold">
                        ✓
                      </span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Regional Context */}
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-900">Kurigram/Rangpur Region Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-amber-900">
                <p>
                  <strong>Groundwater Availability:</strong> The Brahmaputra-Jamuna floodplain has variable groundwater availability. During flood season, surface water is abundant but may be contaminated. During dry season, rely on tube wells.
                </p>
                <p>
                  <strong>Flood Risk:</strong> In char lands (AEZ-7), plan irrigation around flood cycles. Short-duration crops and early planting can help avoid peak flood periods.
                </p>
                <p>
                  <strong>Water Quality:</strong> Test groundwater for salinity and iron content before use. High iron content may require aeration or settling.
                </p>
                <p>
                  <strong>Monsoon Planning:</strong> During monsoon (June-September), minimize irrigation and rely on rainfall. Ensure proper drainage to prevent waterlogging.
                </p>
              </CardContent>
            </Card>

            {/* Additional Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600">
                  For more information about irrigation management and water conservation, consult with your local DAE (Department of Agricultural Extension) office or agricultural extension worker.
                </p>
                <Button variant="outline" className="w-full">
                  <Link href="/chat">Ask AI Assistant</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {!selectedCrop && (
          <Card>
            <CardContent className="py-12 text-center">
              <Droplets className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Select a crop above to view irrigation recommendations</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
