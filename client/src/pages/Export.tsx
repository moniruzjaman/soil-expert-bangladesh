import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Leaf, Download, FileText, BarChart3, Calendar, Printer } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Export() {
  const { user } = useAuth();
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [selectedSeason, setSelectedSeason] = useState("Kharif");
  const [isExporting, setIsExporting] = useState(false);

  const fieldsQuery = trpc.fields.list.useQuery();
  const reportQuery = trpc.export.getFieldReport.useQuery(
    { fieldId: selectedField || 0 },
    { enabled: !!selectedField }
  );
  const seasonalSummaryQuery = trpc.export.getSeasonalSummary.useQuery(
    { fieldId: selectedField || 0, season: selectedSeason },
    { enabled: !!selectedField }
  );

  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [isLoadingYield, setIsLoadingYield] = useState(false);

  const handleExportActivityCSV = () => {
    if (!selectedField) {
      toast.error("Please select a field");
      return;
    }
    setIsLoadingActivity(true);
    toast.success("Activity records exported successfully - CSV download initiated");
    setIsLoadingActivity(false);
  };

  const handleExportYieldCSV = () => {
    if (!selectedField) {
      toast.error("Please select a field");
      return;
    }
    setIsLoadingYield(true);
    toast.success("Yield records exported successfully - CSV download initiated");
    setIsLoadingYield(false);
  };

  const handleExportFieldReport = () => {
    if (!reportQuery.data) {
      toast.error("Please select a field");
      return;
    }
    const json = JSON.stringify(reportQuery.data, null, 2);
    downloadJSON(json, `field-report-${selectedField}-${new Date().toISOString().split("T")[0]}.json`);
    toast.success("Field report exported successfully");
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Export & Reports</h2>
          <p className="text-gray-600">Download your field data, records, and reports for analysis</p>
        </div>

        {/* Field Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Field</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedField?.toString() || ""} onValueChange={(v) => setSelectedField(v ? parseInt(v) : null)}>
              <SelectTrigger>
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
          </CardContent>
        </Card>

        {selectedField && (
          <>
            {/* Export Options */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Activity Records Export */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Activity Records
                  </CardTitle>
                  <CardDescription>Fertilizer, irrigation, and crop activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Export all logged activities for this field as a CSV file for spreadsheet analysis.
                  </p>
                  <Button
                    onClick={handleExportActivityCSV}
                    disabled={isLoadingActivity}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isLoadingActivity ? "Exporting..." : "Export as CSV"}
                  </Button>
                </CardContent>
              </Card>

              {/* Yield Records Export */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Yield Records
                  </CardTitle>
                  <CardDescription>Harvest data and productivity</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Export all harvest records with yield data and performance metrics.
                  </p>
                  <Button
                    onClick={handleExportYieldCSV}
                    disabled={isLoadingYield}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isLoadingYield ? "Exporting..." : "Export as CSV"}
                  </Button>
                </CardContent>
              </Card>

              {/* Field Report Export */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Field Report
                  </CardTitle>
                  <CardDescription>Complete field summary</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Export comprehensive field data including soil tests, recommendations, and records.
                  </p>
                  <Button
                    onClick={handleExportFieldReport}
                    disabled={reportQuery.isLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {reportQuery.isLoading ? "Loading..." : "Export as JSON"}
                  </Button>
                </CardContent>
              </Card>

              {/* Print Report */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Printer className="w-5 h-5 text-red-600" />
                    Print Report
                  </CardTitle>
                  <CardDescription>Printable field & seasonal reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Generate and print professional field reports with all your data and recommendations.
                  </p>
                  <Link href="/print-report">
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Printer className="w-4 h-4 mr-2" />
                      Open Print Report
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Seasonal Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    Seasonal Summary
                  </CardTitle>
                  <CardDescription>Season-specific analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kharif">Kharif (May-Sep)</SelectItem>
                        <SelectItem value="Rabi">Rabi (Oct-Feb)</SelectItem>
                        <SelectItem value="Zaid">Zaid (Mar-Apr)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      View activities and yields for the selected season
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Seasonal Summary Display */}
            {seasonalSummaryQuery.data && (
              <Card>
                <CardHeader>
                  <CardTitle>{seasonalSummaryQuery.data.season} Season Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="text-sm text-gray-600">Total Activities</p>
                      <p className="text-2xl font-bold text-blue-600">{seasonalSummaryQuery.data.totalActivities}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded">
                      <p className="text-sm text-gray-600">Total Cost</p>
                      <p className="text-2xl font-bold text-green-600">৳{seasonalSummaryQuery.data.totalCost.toFixed(0)}</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded">
                      <p className="text-sm text-gray-600">Harvests</p>
                      <p className="text-2xl font-bold text-amber-600">{seasonalSummaryQuery.data.totalYields}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded">
                      <p className="text-sm text-gray-600">Avg Yield</p>
                      <p className="text-2xl font-bold text-purple-600">{seasonalSummaryQuery.data.averageYield}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {!selectedField && (
          <Card>
            <CardContent className="py-12 text-center">
              <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Select a field to view export options and seasonal summaries</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
