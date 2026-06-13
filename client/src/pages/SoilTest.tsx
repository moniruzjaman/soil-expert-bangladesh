import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Leaf, Plus, TestTube, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function SoilTest() {
  const { user } = useAuth();
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [testDate, setTestDate] = useState(new Date().toISOString().split("T")[0]);
  const [soilPH, setSoilPH] = useState("");
  const [organicMatter, setOrganicMatter] = useState("");
  const [nitrogen, setNitrogen] = useState("");
  const [phosphorus, setPhosphorus] = useState("");
  const [potassium, setPotassium] = useState("");
  const [zinc, setZinc] = useState("");
  const [boron, setBoron] = useState("");
  const [notes, setNotes] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fieldsQuery = trpc.fields.list.useQuery();
  const soilTestsQuery = trpc.soilTest.getFieldTests.useQuery(
    { fieldId: selectedField || 0 },
    { enabled: !!selectedField }
  );
  const createTestMutation = trpc.soilTest.create.useMutation({
    onSuccess: () => {
      toast.success("Soil test recorded successfully");
      setSoilPH("");
      setOrganicMatter("");
      setNitrogen("");
      setPhosphorus("");
      setPotassium("");
      setZinc("");
      setBoron("");
      setNotes("");
      setIsOpen(false);
      soilTestsQuery.refetch();
    },
    onError: (error) => {
      toast.error("Failed to record soil test: " + error.message);
    },
  });

  const handleCreateTest = () => {
    if (!selectedField) {
      toast.error("Please select a field");
      return;
    }

    if (!soilPH && !organicMatter && !nitrogen) {
      toast.error("Please enter at least one soil parameter");
      return;
    }

    // Validate date
    if (!testDate) {
      toast.error("Please select a test date");
      return;
    }

    createTestMutation.mutate({
      fieldId: selectedField,
      testDate: new Date(testDate),
      soilPH: soilPH || undefined,
      organicMatter: organicMatter || undefined,
      nitrogen: nitrogen || undefined,
      phosphorus: phosphorus || undefined,
      potassium: potassium || undefined,
      zinc: zinc || undefined,
      boron: boron || undefined,
      notes: notes || undefined,
    });
  };

  const getHealthStatus = (pH: number | null | undefined) => {
    if (!pH) return "Unknown";
    if (pH < 5.5) return "Acidic";
    if (pH < 6.0) return "Slightly Acidic";
    if (pH <= 7.5) return "Neutral";
    if (pH <= 8.5) return "Slightly Alkaline";
    return "Alkaline";
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Soil Test Records</h2>
          <p className="text-gray-600">Log and track soil test results for your fields</p>
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

          {/* Add Test Button */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow lg:col-span-2 flex items-center justify-center">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Plus className="w-8 h-8 text-green-600 mb-2" />
                  <p className="font-semibold text-gray-900">Add Soil Test</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Record Soil Test</DialogTitle>
                <DialogDescription>Enter soil test parameters for your field</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="test-date">Test Date</Label>
                  <Input
                    id="test-date"
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="soil-ph">Soil pH</Label>
                    <Input
                      id="soil-ph"
                      type="number"
                      step="0.1"
                      min="3"
                      max="10"
                      placeholder="6.5"
                      value={soilPH}
                      onChange={(e) => setSoilPH(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="organic-matter">Organic Matter (%)</Label>
                    <Input
                      id="organic-matter"
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      placeholder="2.5"
                      value={organicMatter}
                      onChange={(e) => setOrganicMatter(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="font-semibold text-sm text-gray-700 mb-3">NPK (kg/ha)</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="nitrogen">Nitrogen (N)</Label>
                      <Input
                        id="nitrogen"
                        type="number"
                        step="0.1"
                        placeholder="25"
                        value={nitrogen}
                        onChange={(e) => setNitrogen(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phosphorus">Phosphorus (P)</Label>
                      <Input
                        id="phosphorus"
                        type="number"
                        step="0.1"
                        placeholder="15"
                        value={phosphorus}
                        onChange={(e) => setPhosphorus(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="potassium">Potassium (K)</Label>
                      <Input
                        id="potassium"
                        type="number"
                        step="0.1"
                        placeholder="150"
                        value={potassium}
                        onChange={(e) => setPotassium(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="font-semibold text-sm text-gray-700 mb-3">Micronutrients (ppm)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="zinc">Zinc (Zn)</Label>
                      <Input
                        id="zinc"
                        type="number"
                        step="0.1"
                        placeholder="1.5"
                        value={zinc}
                        onChange={(e) => setZinc(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="boron">Boron (B)</Label>
                      <Input
                        id="boron"
                        type="number"
                        step="0.1"
                        placeholder="0.5"
                        value={boron}
                        onChange={(e) => setBoron(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Lab name, test method, or additional observations..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleCreateTest}
                  disabled={createTestMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {createTestMutation.isPending ? "Recording..." : "Record Soil Test"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Soil Tests */}
        {selectedField && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Test History</h3>
            {soilTestsQuery.data && soilTestsQuery.data.length > 0 ? (
              <div className="space-y-4">
                {soilTestsQuery.data.map((test: any) => (
                  <Card key={test.id} className="border-l-4 border-l-blue-600">
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <TestTube className="w-5 h-5 text-blue-600" />
                            Test Results
                          </h4>
                          <div className="space-y-2 text-sm">
                            {test.soilPH && (
                              <div>
                                <p className="text-gray-600">Soil pH: <span className="font-semibold">{test.soilPH}</span></p>
                                <p className="text-xs text-gray-500">{getHealthStatus(typeof test.soilPH === 'string' ? parseFloat(test.soilPH) : test.soilPH)}</p>
                              </div>
                            )}
                            {test.organicMatter && (
                              <p className="text-gray-600">Organic Matter: <span className="font-semibold">{test.organicMatter}%</span></p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            Nutrients (kg/ha)
                          </h4>
                          <div className="space-y-2 text-sm">
                            {test.nitrogen && <p className="text-gray-600">N: <span className="font-semibold">{test.nitrogen}</span></p>}
                            {test.phosphorus && <p className="text-gray-600">P: <span className="font-semibold">{test.phosphorus}</span></p>}
                            {test.potassium && <p className="text-gray-600">K: <span className="font-semibold">{test.potassium}</span></p>}
                          </div>
                        </div>

                        {(test.zinc || test.boron) && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Micronutrients (ppm)</h4>
                            <div className="space-y-2 text-sm">
                              {test.zinc && <p className="text-gray-600">Zn: <span className="font-semibold">{test.zinc}</span></p>}
                              {test.boron && <p className="text-gray-600">B: <span className="font-semibold">{test.boron}</span></p>}
                            </div>
                          </div>
                        )}

                        <div>
                          <p className="text-sm text-gray-500">
                            Test Date: {new Date(test.testDate).toLocaleDateString("en-BD")}
                          </p>
                          {test.notes && (
                            <p className="text-sm text-gray-600 mt-2">Notes: {test.notes}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <TestTube className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No soil tests recorded yet for this field</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!selectedField && (
          <Card>
            <CardContent className="py-12 text-center">
              <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Select a field to view and record soil tests</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
