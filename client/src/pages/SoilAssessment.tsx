import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Beaker, Leaf, MapPin, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

// Simple AEZ detection based on coordinates (latitude/longitude ranges)
const detectAEZFromCoordinates = (lat: number, lng: number): string | null => {
  // Kurigram region coordinates (approximate)
  // AEZ-7: Active Brahmaputra-Jamuna Floodplain (25.5-26.5°N, 89.0-90.0°E)
  // AEZ-3: Tista Meander Floodplain (25.8-26.5°N, 88.5-89.5°E)
  // AEZ-1: Himalayan Foothills (26.0-26.8°N, 89.5-90.5°E)

  if (lat >= 25.5 && lat <= 26.5 && lng >= 89.0 && lng <= 90.0) {
    if (lng >= 88.5 && lng <= 89.5) return "AEZ-3";
    return "AEZ-7";
  }
  if (lat >= 26.0 && lat <= 26.8 && lng >= 89.5 && lng <= 90.5) {
    return "AEZ-1";
  }
  if (lat >= 25.8 && lat <= 26.5 && lng >= 88.5 && lng <= 89.5) {
    return "AEZ-3";
  }
  // Default to AEZ-3 for Kurigram region
  return "AEZ-3";
};

export default function SoilAssessment() {
  const { user } = useAuth();
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    latitude: "",
    longitude: "",
    soilTexture: "",
    landType: "",
    testDate: "",
    soilPH: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    organicMatter: "",
    zinc: "",
    boron: "",
    notes: "",
  });
  const [detectedAEZ, setDetectedAEZ] = useState<string | null>(null);
  const [aezData, setAezData] = useState<any>(null);

  const fieldsQuery = trpc.fields.list.useQuery();
  const aezProfileQuery = trpc.aez.getByCode.useQuery(
    { aezCode: detectedAEZ || "AEZ-3" },
    { enabled: !!detectedAEZ }
  );
  const createSoilTestMutation = trpc.soilTest.create.useMutation({
    onSuccess: () => {
      toast.success("Soil test recorded successfully!");
      setFormData({
        latitude: "",
        longitude: "",
        soilTexture: "",
        landType: "",
        testDate: "",
        soilPH: "",
        nitrogen: "",
        phosphorus: "",
        potassium: "",
        organicMatter: "",
        zinc: "",
        boron: "",
        notes: "",
      });
      setIsOpen(false);
      setDetectedAEZ(null);
    },
    onError: (error) => {
      toast.error("Failed to record soil test: " + error.message);
    },
  });

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setFormData({
            ...formData,
            latitude: lat.toString(),
            longitude: lng.toString(),
          });
          const aez = detectAEZFromCoordinates(lat, lng);
          setDetectedAEZ(aez);
          toast.success(`Location captured! Detected AEZ: ${aez}`);
        },
        () => {
          toast.error("Unable to get location. Please enable location services.");
        }
      );
    }
  };

  const handleCreateSoilTest = () => {
    if (!selectedField) {
      toast.error("Please select a field");
      return;
    }

    createSoilTestMutation.mutate({
      fieldId: selectedField,
      testDate: formData.testDate ? new Date(formData.testDate) : undefined,
      soilPH: formData.soilPH || undefined,
      nitrogen: formData.nitrogen || undefined,
      phosphorus: formData.phosphorus || undefined,
      potassium: formData.potassium || undefined,
      organicMatter: formData.organicMatter || undefined,
      zinc: formData.zinc || undefined,
      boron: formData.boron || undefined,
      notes: formData.notes || undefined,
    });
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Soil Assessment</h2>
          <p className="text-gray-600">Analyze your soil health with GPS-based AEZ detection and soil test results</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Record Soil Test</CardTitle>
                <CardDescription>Enter your soil test results and location data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Field Selection */}
                <div>
                  <Label htmlFor="field">Select Field *</Label>
                  <Select value={selectedField?.toString() || ""} onValueChange={(v) => setSelectedField(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldsQuery.data?.map((field) => (
                        <SelectItem key={field.id} value={field.id.toString()}>
                          {field.fieldName} ({field.areaInBigha} Bigha)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Section */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Location & AEZ Detection
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        placeholder="e.g., 25.9124"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        placeholder="e.g., 89.2681"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        disabled
                      />
                    </div>
                  </div>
                  <Button type="button" variant="outline" className="w-full mb-4" onClick={handleGetLocation}>
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Current Location
                  </Button>
                  {detectedAEZ && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Detected AEZ:</p>
                      <p className="font-semibold text-green-700">{detectedAEZ}</p>
                      {aezProfileQuery.data && (
                        <p className="text-sm text-gray-600 mt-2">{aezProfileQuery.data.description}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Soil Test Results */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Beaker className="w-5 h-5 text-blue-600" />
                    Soil Test Results
                  </h3>
                  <div>
                    <Label htmlFor="testDate">Test Date</Label>
                    <Input
                      id="testDate"
                      type="date"
                      value={formData.testDate}
                      onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                      className="mb-4"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="soilPH">Soil pH</Label>
                      <Input
                        id="soilPH"
                        placeholder="e.g., 6.5"
                        value={formData.soilPH}
                        onChange={(e) => setFormData({ ...formData, soilPH: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="organicMatter">Organic Matter (%)</Label>
                      <Input
                        id="organicMatter"
                        placeholder="e.g., 2.5"
                        value={formData.organicMatter}
                        onChange={(e) => setFormData({ ...formData, organicMatter: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor="nitrogen">N (ppm)</Label>
                      <Input
                        id="nitrogen"
                        placeholder="e.g., 25"
                        value={formData.nitrogen}
                        onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phosphorus">P (ppm)</Label>
                      <Input
                        id="phosphorus"
                        placeholder="e.g., 15"
                        value={formData.phosphorus}
                        onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="potassium">K (ppm)</Label>
                      <Input
                        id="potassium"
                        placeholder="e.g., 120"
                        value={formData.potassium}
                        onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor="zinc">Zn (ppm)</Label>
                      <Input
                        id="zinc"
                        placeholder="e.g., 1.5"
                        value={formData.zinc}
                        onChange={(e) => setFormData({ ...formData, zinc: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="boron">B (ppm)</Label>
                      <Input
                        id="boron"
                        placeholder="e.g., 0.5"
                        value={formData.boron}
                        onChange={(e) => setFormData({ ...formData, boron: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any observations about the soil..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreateSoilTest}
                  disabled={createSoilTestMutation.isPending || !selectedField}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {createSoilTestMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Recording...
                    </>
                  ) : (
                    "Record Soil Test"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: AEZ Information */}
          <div className="space-y-6">
            {detectedAEZ && aezProfileQuery.data && (
              <>
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-900">AEZ Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Zone Code</p>
                      <p className="font-semibold">{aezProfileQuery.data.aezCode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Zone Name</p>
                      <p className="font-semibold">{aezProfileQuery.data.aezName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Default Soil pH</p>
                      <p className="font-semibold">{aezProfileQuery.data.defaultSoilPH}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Organic Matter Status</p>
                      <p className="font-semibold">{aezProfileQuery.data.organicMatterStatus}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fertility Class</p>
                      <p className="font-semibold">{aezProfileQuery.data.fertilityClass}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dominant Soil Texture</p>
                      <p className="font-semibold">{aezProfileQuery.data.dominantSoilTexture}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Soil Health Tips for {aezProfileQuery.data.aezCode}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">pH Management:</p>
                      <p className="text-gray-600">
                        {aezProfileQuery.data?.defaultSoilPH?.includes("5") 
                          ? "This zone tends to be acidic. Consider liming (2-3 t/ha) to raise pH."
                          : "Soil pH is relatively neutral. Maintain through proper nutrient management."}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Organic Matter:</p>
                      <p className="text-gray-600">
                        {aezProfileQuery.data?.organicMatterStatus?.includes("Low")
                          ? "Add 5-10 t/ha compost or green manure annually to improve soil health."
                          : "Continue adding 3-5 t/ha organic matter to maintain fertility."}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Micronutrients:</p>
                      <p className="text-gray-600">
                        Apply Zinc (2-3 kg/ha) and Boron (1-2 kg/ha) based on soil test results.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!detectedAEZ && (
              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="py-8 text-center">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Get your location to detect your AEZ and see soil profile data.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
