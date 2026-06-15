import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Leaf, Printer, Download } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function PrintReport() {
  const { user } = useAuth();
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [selectedSeason, setSelectedSeason] = useState("Kharif");
  const [reportType, setReportType] = useState<"field" | "seasonal">("field");

  const fieldsQuery = trpc.fields.list.useQuery();
  const reportQuery = trpc.export.getFieldReport.useQuery(
    { fieldId: selectedField || 0 },
    { enabled: !!selectedField && reportType === "field" }
  );
  const seasonalSummaryQuery = trpc.export.getSeasonalSummary.useQuery(
    { fieldId: selectedField || 0, season: selectedSeason },
    { enabled: !!selectedField && reportType === "seasonal" }
  );

  const handlePrint = () => {
    window.print();
  };

  const getFieldName = () => {
    if (!selectedField) return "Field Report";
    const field = fieldsQuery.data?.find((f) => f.id === selectedField);
    return field?.fieldName || "Field Report";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print Controls - Hidden on Print */}
      <div className="print:hidden bg-gray-50 border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-4">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Leaf className="w-8 h-8 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900">Precision Khamari</h1>
              </div>
            </Link>
            <div className="flex gap-2">
              <Button onClick={handlePrint} variant="outline" className="print:hidden">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={() => window.history.back()} variant="outline" className="print:hidden">
                Back
              </Button>
            </div>
          </div>

          {/* Report Configuration */}
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Field</label>
              <Select value={selectedField?.toString() || ""} onValueChange={(v) => setSelectedField(v ? parseInt(v) : null)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select field" />
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
              <label className="text-sm font-medium text-gray-700">Report Type</label>
              <Select value={reportType} onValueChange={(v: any) => setReportType(v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="field">Field Report</SelectItem>
                  <SelectItem value="seasonal">Seasonal Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reportType === "seasonal" && (
              <div>
                <label className="text-sm font-medium text-gray-700">Season</label>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kharif">Kharif (May-Sep)</SelectItem>
                    <SelectItem value="Rabi">Rabi (Oct-Feb)</SelectItem>
                    <SelectItem value="Zaid">Zaid (Mar-Apr)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Printable Report Content */}
      {selectedField && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {reportType === "field" && reportQuery.data && (
            <div className="space-y-8">
              {/* Header */}
              <div className="border-b-2 border-gray-300 pb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Field Report</h1>
                <p className="text-gray-600">
                  {getFieldName()} • Generated on {new Date().toLocaleDateString("en-BD")}
                </p>
              </div>

              {/* Field Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Field Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Field Name</p>
                    <p className="text-lg font-semibold text-gray-900">{reportQuery.data.fieldInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Area</p>
                    <p className="text-lg font-semibold text-gray-900">{reportQuery.data.fieldInfo.area} Bigha</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Soil Texture</p>
                    <p className="text-lg font-semibold text-gray-900">{reportQuery.data.fieldInfo.soilTexture}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Land Type</p>
                    <p className="text-lg font-semibold text-gray-900">{reportQuery.data.fieldInfo.landType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">AEZ Code</p>
                    <p className="text-lg font-semibold text-gray-900">{reportQuery.data.fieldInfo.location.aezCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Coordinates</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {reportQuery.data.fieldInfo.location.latitude}, {reportQuery.data.fieldInfo.location.longitude}
                    </p>
                  </div>
                </div>
              </div>

              {/* Latest Soil Test */}
              {reportQuery.data.latestSoilTest && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Soil Test</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Soil pH</p>
                      <p className="text-lg font-semibold text-gray-900">{reportQuery.data.latestSoilTest.soilPH}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Organic Matter</p>
                      <p className="text-lg font-semibold text-gray-900">{reportQuery.data.latestSoilTest.organicMatter}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Test Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {reportQuery.data.latestSoilTest.testDate ? new Date(reportQuery.data.latestSoilTest.testDate).toLocaleDateString("en-BD") : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Fertilizer Recommendations */}
              {reportQuery.data.fertilizerRecommendations.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Fertilizer Recommendations</h2>
                  <div className="space-y-4">
                    {reportQuery.data.fertilizerRecommendations.map((rec: any, idx: number) => (
                      <div key={idx} className="border border-gray-300 p-4 rounded">
                        <p className="font-semibold text-gray-900">{rec.cropName}</p>
                        <p className="text-sm text-gray-600">
                          NPK: {rec.nitrogenKg}kg N, {rec.phosphorusKg}kg P, {rec.potassiumKg}kg K
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity Summary */}
              {reportQuery.data.activityRecords.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity Records</h2>
                  <p className="text-gray-600">Total activities logged: {reportQuery.data.activityRecords.length}</p>
                </div>
              )}

              {/* Yield Summary */}
              {reportQuery.data.yieldRecords.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Yield Records</h2>
                  <p className="text-gray-600">Total harvests recorded: {reportQuery.data.yieldRecords.length}</p>
                </div>
              )}

              {/* Footer */}
              <div className="border-t-2 border-gray-300 pt-6 text-center text-sm text-gray-600">
                <p>Precision Khamari - Professional Soil Advisory for Bangladeshi Farmers</p>
                <p>Report generated: {new Date().toLocaleString("en-BD")}</p>
              </div>
            </div>
          )}

          {reportType === "seasonal" && seasonalSummaryQuery.data && (
            <div className="space-y-8">
              {/* Header */}
              <div className="border-b-2 border-gray-300 pb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{seasonalSummaryQuery.data.season} Season Summary</h1>
                <p className="text-gray-600">
                  {getFieldName()} • Generated on {new Date().toLocaleDateString("en-BD")}
                </p>
              </div>

              {/* Summary Statistics */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Season Overview</h2>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="border border-gray-300 p-4 rounded">
                    <p className="text-sm text-gray-600">Total Activities</p>
                    <p className="text-3xl font-bold text-gray-900">{seasonalSummaryQuery.data.totalActivities}</p>
                  </div>
                  <div className="border border-gray-300 p-4 rounded">
                    <p className="text-sm text-gray-600">Total Cost (BDT)</p>
                    <p className="text-3xl font-bold text-gray-900">৳{seasonalSummaryQuery.data.totalCost.toFixed(0)}</p>
                  </div>
                  <div className="border border-gray-300 p-4 rounded">
                    <p className="text-sm text-gray-600">Harvests</p>
                    <p className="text-3xl font-bold text-gray-900">{seasonalSummaryQuery.data.totalYields}</p>
                  </div>
                  <div className="border border-gray-300 p-4 rounded">
                    <p className="text-sm text-gray-600">Average Yield</p>
                    <p className="text-3xl font-bold text-gray-900">{seasonalSummaryQuery.data.averageYield}</p>
                  </div>
                </div>
              </div>

              {/* Activities */}
              {seasonalSummaryQuery.data.activities.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Activities</h2>
                  <p className="text-gray-600 mb-4">Total activities recorded: {seasonalSummaryQuery.data.activities.length}</p>
                </div>
              )}

              {/* Yields */}
              {seasonalSummaryQuery.data.yields.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Harvest Records</h2>
                  <p className="text-gray-600">Total harvests recorded: {seasonalSummaryQuery.data.yields.length}</p>
                </div>
              )}

              {/* Footer */}
              <div className="border-t-2 border-gray-300 pt-6 text-center text-sm text-gray-600">
                <p>Precision Khamari - Professional Soil Advisory for Bangladeshi Farmers</p>
                <p>Report generated: {new Date().toLocaleString("en-BD")}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {!selectedField && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Select a field above to generate a printable report</p>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
          }
          div {
            page-break-inside: avoid;
          }
          .max-w-4xl {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
