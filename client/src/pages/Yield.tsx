import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Leaf, Plus, TrendingUp, BarChart3 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Yield() {
  const { user } = useAuth();
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [cropName, setCropName] = useState("");
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split("T")[0]);
  const [quantityProduced, setQuantityProduced] = useState("");
  const [unit, setUnit] = useState("ton/ha");
  const [expectedYield, setExpectedYield] = useState("");
  const [notes, setNotes] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fieldsQuery = trpc.fields.list.useQuery();
  const yieldsQuery = trpc.yield.getFieldYields.useQuery(
    { fieldId: selectedField || 0 },
    { enabled: !!selectedField }
  );
  const analyticsQuery = trpc.yield.getYieldAnalytics.useQuery(
    { fieldId: selectedField || 0 },
    { enabled: !!selectedField }
  );

  const recordYieldMutation = trpc.yield.recordYield.useMutation({
    onSuccess: () => {
      toast.success("Yield record saved successfully");
      setCropName("");
      setQuantityProduced("");
      setExpectedYield("");
      setNotes("");
      setIsOpen(false);
      yieldsQuery.refetch();
      analyticsQuery.refetch();
    },
    onError: (error) => {
      toast.error("Failed to record yield: " + error.message);
    },
  });

  const handleRecordYield = () => {
    if (!selectedField) {
      toast.error("Please select a field");
      return;
    }

    if (!cropName || !quantityProduced) {
      toast.error("Please enter crop name and quantity produced");
      return;
    }

    recordYieldMutation.mutate({
      fieldId: selectedField,
      cropName,
      harvestDate: new Date(harvestDate),
      quantityProduced: parseFloat(quantityProduced),
      unit,
      expectedYield: expectedYield ? parseFloat(expectedYield) : undefined,
      notes: notes || undefined,
    });
  };

  const getYieldStatus = (percentage: number) => {
    if (percentage >= 100) return { label: "Excellent", color: "text-green-600", bg: "bg-green-50" };
    if (percentage >= 90) return { label: "Good", color: "text-blue-600", bg: "bg-blue-50" };
    if (percentage >= 80) return { label: "Fair", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { label: "Below Target", color: "text-red-600", bg: "bg-red-50" };
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Yield Tracking</h2>
          <p className="text-gray-600">Record harvest data and monitor productivity trends</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Field Selection */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Select Field</CardTitle>
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

          {/* Record Yield Button */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow lg:col-span-2 flex items-center justify-center">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Plus className="w-8 h-8 text-green-600 mb-2" />
                  <p className="font-semibold text-gray-900">Record Harvest</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Yield/Harvest</DialogTitle>
                <DialogDescription>Enter harvest data for your field</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="crop-name">Crop Name</Label>
                  <Input
                    id="crop-name"
                    placeholder="e.g., Rice, Wheat, Potato"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="harvest-date">Harvest Date</Label>
                  <Input
                    id="harvest-date"
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity Produced</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.1"
                      placeholder="5.5"
                      value={quantityProduced}
                      onChange={(e) => setQuantityProduced(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger id="unit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ton/ha">ton/ha</SelectItem>
                        <SelectItem value="kg/ha">kg/ha</SelectItem>
                        <SelectItem value="bags">bags</SelectItem>
                        <SelectItem value="maund">maund</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="expected-yield">Expected Yield (optional)</Label>
                  <Input
                    id="expected-yield"
                    type="number"
                    step="0.1"
                    placeholder="5.0"
                    value={expectedYield}
                    onChange={(e) => setExpectedYield(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Weather conditions, pest issues, or other observations..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleRecordYield}
                  disabled={recordYieldMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {recordYieldMutation.isPending ? "Recording..." : "Record Harvest"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Yield Analytics */}
        {selectedField && analyticsQuery.data && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Average Yield</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">{analyticsQuery.data.averageYield}</p>
                <p className="text-xs text-gray-500">ton/ha</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Best Yield</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">{analyticsQuery.data.bestYield}</p>
                <p className="text-xs text-gray-500">ton/ha</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Harvests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">{analyticsQuery.data.totalHarvests}</p>
                <p className="text-xs text-gray-500">records</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600 capitalize">{analyticsQuery.data.yieldTrend}</p>
                <p className="text-xs text-gray-500">over time</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Yield Records */}
        {selectedField && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Harvest Records</h3>
            {yieldsQuery.data && yieldsQuery.data.length > 0 ? (
              <div className="space-y-4">
                {yieldsQuery.data.map((record: any) => {
                  const status = getYieldStatus(record.yieldPercentage);
                  return (
                    <Card key={record.id} className="border-l-4 border-l-green-600">
                      <CardContent className="pt-6">
                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-green-600" />
                              Harvest Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p className="text-gray-600">Crop: <span className="font-semibold">{record.cropName}</span></p>
                              <p className="text-gray-600">Date: <span className="font-semibold">{new Date(record.harvestDate).toLocaleDateString("en-BD")}</span></p>
                              <p className="text-gray-600">Quantity: <span className="font-semibold">{record.quantityProduced} {record.unit}</span></p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <BarChart3 className="w-5 h-5 text-blue-600" />
                              Performance
                            </h4>
                            {record.expectedYield && (
                              <div className="space-y-2 text-sm">
                                <p className="text-gray-600">Expected: <span className="font-semibold">{record.expectedYield} {record.unit}</span></p>
                                <p className={`${status.color} font-semibold`}>Achievement: {record.yieldPercentage.toFixed(1)}%</p>
                                <div className={`${status.bg} px-3 py-1 rounded text-sm font-medium ${status.color}`}>
                                  {status.label}
                                </div>
                              </div>
                            )}
                          </div>

                          <div>
                            {record.notes && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                                <p className="text-sm text-gray-600">{record.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No harvest records yet for this field</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!selectedField && (
          <Card>
            <CardContent className="py-12 text-center">
              <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Select a field to view and record harvest data</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
