import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Leaf, Plus, MapPin, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Fields() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fieldName: "",
    latitude: "",
    longitude: "",
    areaInBigha: "",
    soilTexture: "",
    landType: "",
    notes: "",
  });

  const fieldsQuery = trpc.fields.list.useQuery();
  const createFieldMutation = trpc.fields.create.useMutation({
    onSuccess: () => {
      fieldsQuery.refetch();
      setFormData({
        fieldName: "",
        latitude: "",
        longitude: "",
        areaInBigha: "",
        soilTexture: "",
        landType: "",
        notes: "",
      });
      setIsOpen(false);
      toast.success("Field created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create field: " + error.message);
    },
  });

  const handleCreateField = () => {
    if (!formData.fieldName) {
      toast.error("Please enter a field name");
      return;
    }

    createFieldMutation.mutate({
      fieldName: formData.fieldName,
      latitude: formData.latitude || undefined,
      longitude: formData.longitude || undefined,
      areaInBigha: formData.areaInBigha || undefined,
      soilTexture: formData.soilTexture || undefined,
      landType: formData.landType || undefined,
      notes: formData.notes || undefined,
    });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
          toast.success("Location captured!");
        },
        () => {
          toast.error("Unable to get location. Please enable location services.");
        }
      );
    }
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Fields</h2>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Field</DialogTitle>
                <DialogDescription>Enter details about your field</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fieldName">Field Name *</Label>
                  <Input
                    id="fieldName"
                    placeholder="e.g., North Field, Char Land"
                    value={formData.fieldName}
                    onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGetLocation}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Get Current Location
                </Button>

                <div>
                  <Label htmlFor="areaInBigha">Area (Bigha)</Label>
                  <Input
                    id="areaInBigha"
                    placeholder="e.g., 2.5"
                    value={formData.areaInBigha}
                    onChange={(e) => setFormData({ ...formData, areaInBigha: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="soilTexture">Soil Texture</Label>
                  <Select value={formData.soilTexture} onValueChange={(value) => setFormData({ ...formData, soilTexture: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil texture" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sandy">Sandy</SelectItem>
                      <SelectItem value="Loamy Sand">Loamy Sand</SelectItem>
                      <SelectItem value="Sandy Loam">Sandy Loam</SelectItem>
                      <SelectItem value="Loam">Loam</SelectItem>
                      <SelectItem value="Silty Loam">Silty Loam</SelectItem>
                      <SelectItem value="Silt">Silt</SelectItem>
                      <SelectItem value="Sandy Clay Loam">Sandy Clay Loam</SelectItem>
                      <SelectItem value="Clay Loam">Clay Loam</SelectItem>
                      <SelectItem value="Silty Clay Loam">Silty Clay Loam</SelectItem>
                      <SelectItem value="Sandy Clay">Sandy Clay</SelectItem>
                      <SelectItem value="Silty Clay">Silty Clay</SelectItem>
                      <SelectItem value="Clay">Clay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="landType">Land Type</Label>
                  <Select value={formData.landType} onValueChange={(value) => setFormData({ ...formData, landType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select land type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High Land">High Land</SelectItem>
                      <SelectItem value="Medium High Land">Medium High Land</SelectItem>
                      <SelectItem value="Medium Land">Medium Land</SelectItem>
                      <SelectItem value="Low Land">Low Land</SelectItem>
                      <SelectItem value="Very Low Land">Very Low Land</SelectItem>
                      <SelectItem value="Char Land">Char Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleCreateField}
                  disabled={createFieldMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {createFieldMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Field"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {fieldsQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : fieldsQuery.data && fieldsQuery.data.length > 0 ? (
          <div className="grid gap-6">
            {fieldsQuery.data.map((field) => (
              <Link key={field.id} href={`/field/${field.id}`}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{field.fieldName}</CardTitle>
                        <CardDescription>
                          {field.areaInBigha} Bigha • {field.landType || "Land type not specified"}
                        </CardDescription>
                      </div>
                      {field.latitude && field.longitude && (
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {field.latitude}, {field.longitude}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Soil Texture</p>
                        <p className="font-semibold">{field.soilTexture || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Soil pH</p>
                        <p className="font-semibold">{field.soilPH || "Not tested"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No fields yet. Create your first field to get started.</p>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Field
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
