import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Leaf, TrendingUp, DollarSign, Zap, BarChart3 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Efficiency() {
  const { user } = useAuth();
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [selectedSeason, setSelectedSeason] = useState("Kharif");

  const fieldsQuery = trpc.fields.list.useQuery();
  const seasonalSummaryQuery = trpc.export.getSeasonalSummary.useQuery(
    { fieldId: selectedField || 0, season: selectedSeason },
    { enabled: !!selectedField }
  );

  const getFieldName = () => {
    if (!selectedField) return "Field";
    const field = fieldsQuery.data?.find((f) => f.id === selectedField);
    return field?.fieldName || "Field";
  };

  // Calculate efficiency metrics
  const calculateEfficiency = () => {
    if (!seasonalSummaryQuery.data) return null;

    const data = seasonalSummaryQuery.data;
    const totalCost = data.totalCost;
    const totalYield = parseFloat(data.averageYield) * (data.totalYields || 1);
    const costPerUnit = totalYield > 0 ? (totalCost / totalYield).toFixed(2) : "0";
    const costEfficiency = totalYield > 0 ? ((totalYield / totalCost) * 100).toFixed(2) : "0";

    return {
      totalCost,
      totalYield,
      costPerUnit,
      costEfficiency,
      activitiesCount: data.totalActivities,
      harvestsCount: data.totalYields,
    };
  };

  const efficiency = calculateEfficiency();

  if (fieldsQuery.isLoading) {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-gray-600 text-lg">Loading your fields...</p>
        </div>
      </div>
    );
  }

  if (fieldsQuery.isError) {
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
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-8 text-center">
              <p className="text-red-700 text-lg">Error loading fields. Please try again.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!fieldsQuery.data || fieldsQuery.data.length === 0) {
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
          <Card>
            <CardContent className="py-12 text-center">
              <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No fields yet. Create a field first to analyze efficiency.</p>
              <Link href="/fields">
                <Button className="mt-4 bg-green-600 hover:bg-green-700">Create Field</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Efficiency Analysis</h2>
          <p className="text-gray-600">Track input costs, productivity, and profitability metrics</p>
        </div>

        {/* Field & Season Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Field & Season</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Field</label>
                <Select value={selectedField?.toString() || ""} onValueChange={(v) => setSelectedField(v ? parseInt(v) : null)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldsQuery.data?.map((field) => (
                      <SelectItem key={field.id} value={field.id.toString()}>
                        {field.fieldName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Season</label>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kharif">Kharif (May-Sep)</SelectItem>
                    <SelectItem value="Rabi">Rabi (Oct-Feb)</SelectItem>
                    <SelectItem value="Zaid">Zaid (Mar-Apr)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedField && seasonalSummaryQuery.isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 text-lg">Loading efficiency data...</p>
            </CardContent>
          </Card>
        )}

        {selectedField && seasonalSummaryQuery.isError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-8 text-center">
              <p className="text-red-700 text-lg">Error loading efficiency data. Please try again.</p>
            </CardContent>
          </Card>
        )}

        {selectedField && efficiency && (
          <>
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    Total Input Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">৳{efficiency.totalCost.toFixed(0)}</p>
                  <p className="text-xs text-gray-500 mt-1">{efficiency.activitiesCount} activities logged</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Total Yield
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">{efficiency.totalYield.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">{efficiency.harvestsCount} harvests</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    Cost per Unit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">৳{efficiency.costPerUnit}</p>
                  <p className="text-xs text-gray-500 mt-1">Lower is better</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    Cost Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">{efficiency.costEfficiency}%</p>
                  <p className="text-xs text-gray-500 mt-1">Output per BDT spent</p>
                </CardContent>
              </Card>
            </div>

            {/* Analysis & Recommendations */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Cost Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost Analysis</CardTitle>
                  <CardDescription>Input cost distribution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium text-gray-700">Total Cost</p>
                        <p className="text-sm font-semibold text-gray-900">৳{efficiency.totalCost.toFixed(0)}</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-xs text-gray-600 mb-2">Average cost per activity:</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ৳{(efficiency.totalCost / (efficiency.activitiesCount || 1)).toFixed(0)}
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-xs text-gray-600 mb-2">Cost per harvest:</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ৳{(efficiency.totalCost / (efficiency.harvestsCount || 1)).toFixed(0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Productivity Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Productivity Analysis</CardTitle>
                  <CardDescription>Yield and efficiency metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium text-gray-700">Total Yield</p>
                        <p className="text-sm font-semibold text-gray-900">{efficiency.totalYield.toFixed(2)} units</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-xs text-gray-600 mb-2">Average yield per harvest:</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {(efficiency.totalYield / (efficiency.harvestsCount || 1)).toFixed(2)} units
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-xs text-gray-600 mb-2">Cost efficiency ratio:</p>
                      <p className="text-lg font-semibold text-gray-900">{efficiency.costEfficiency}%</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {parseFloat(efficiency.costEfficiency) > 50
                          ? "Good efficiency - strong output relative to costs"
                          : "Review cost management - consider optimizing inputs"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Efficiency Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {parseFloat(efficiency.costPerUnit) > 100 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                      <p className="text-sm font-semibold text-amber-900">💡 High Cost per Unit</p>
                      <p className="text-sm text-amber-800 mt-1">
                        Consider reviewing fertilizer application rates and irrigation efficiency to reduce input costs.
                      </p>
                    </div>
                  )}

                  {efficiency.harvestsCount < 2 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm font-semibold text-blue-900">📊 Limited Harvest Data</p>
                      <p className="text-sm text-blue-800 mt-1">
                        Record more harvest data across seasons to get better efficiency insights and trends.
                      </p>
                    </div>
                  )}

                  {efficiency.activitiesCount < 5 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm font-semibold text-green-900">✅ Track More Activities</p>
                      <p className="text-sm text-green-800 mt-1">
                        Log more fertilizer, irrigation, and crop activities to get comprehensive efficiency analysis.
                      </p>
                    </div>
                  )}

                  {parseFloat(efficiency.costEfficiency) > 75 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm font-semibold text-green-900">🎉 Excellent Efficiency!</p>
                      <p className="text-sm text-green-800 mt-1">
                        Your cost-to-yield ratio is excellent. Continue with current practices and share your success with other farmers.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!selectedField && !seasonalSummaryQuery.isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Select a field and season to view efficiency analysis</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
