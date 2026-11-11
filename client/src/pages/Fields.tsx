import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ParcelMap } from "@/components/ParcelMap";
import { trpc } from "@/lib/trpc";
import { isBangladeshCoordinate } from "@shared/parcel";
import { Leaf, Plus, MapPin, Loader2, ExternalLink, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

const emptyForm = {
  fieldName: "", latitude: "", longitude: "", locationAccuracyMeters: "", boundaryGeoJson: "", address: "",
  district: "", upazila: "", unionName: "", mouzaName: "", sheetNumber: "", plotNumber: "",
  cadastralStatus: "Not verified", areaInBigha: "", soilTexture: "", landType: "", notes: "",
};

type FormData = typeof emptyForm;

export default function Fields() {
  useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const fieldsQuery = trpc.fields.list.useQuery();
  const createFieldMutation = trpc.fields.create.useMutation({
    onSuccess: () => {
      fieldsQuery.refetch();
      setFormData(emptyForm);
      setIsOpen(false);
      toast.success("Field and parcel location saved.");
    },
    onError: error => toast.error("Failed to create field: " + error.message),
  });

  const update = (key: keyof FormData, value: string) => setFormData(current => ({ ...current, [key]: value }));
  const mapCenter = formData.latitude && formData.longitude
    ? { lat: Number(formData.latitude), lng: Number(formData.longitude) }
    : undefined;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("This browser does not support GPS location.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        update("latitude", position.coords.latitude.toString());
        update("longitude", position.coords.longitude.toString());
        update("locationAccuracyMeters", Math.round(position.coords.accuracy).toString());
        toast.success("GPS captured. Review the pin and trace the boundary if available.");
      },
      error => toast.error(error.code === error.PERMISSION_DENIED ? "Please allow location access to use GPS." : "Unable to get GPS location."),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const handleCreateField = () => {
    if (!formData.fieldName.trim()) return toast.error("Please enter a field name.");
    if (!formData.latitude || !formData.longitude) return toast.error("Capture the field GPS location first.");
    if (!isBangladeshCoordinate({ lat: Number(formData.latitude), lng: Number(formData.longitude) })) return toast.error("Please confirm the GPS point is inside Bangladesh.");
    createFieldMutation.mutate({
      ...Object.fromEntries(Object.entries(formData).map(([key, value]) => [key, value || undefined])),
      fieldName: formData.fieldName,
    } as Parameters<typeof createFieldMutation.mutate>[0]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/"><div className="flex cursor-pointer items-center gap-2"><Leaf className="h-8 w-8 text-green-600" /><h1 className="text-2xl font-bold text-gray-900">Precision Khamari</h1></div></Link>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4"><div><h2 className="text-3xl font-bold text-gray-900">My Fields</h2><p className="mt-1 text-sm text-gray-600">Save GPS location and trace each parcel once for better soil advice.</p></div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild><Button className="bg-green-600 hover:bg-green-700"><Plus className="mr-2 h-4 w-4" />Add Field</Button></DialogTrigger>
            <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
              <DialogHeader><DialogTitle>Add field parcel</DialogTitle><DialogDescription>GPS and boundary data stay with your field record. Mouza and plot numbers are only saved when you verify them.</DialogDescription></DialogHeader>
              <div className="space-y-5">
                <div><Label htmlFor="fieldName">Field name *</Label><Input id="fieldName" placeholder="e.g., North Field, Char Land" value={formData.fieldName} onChange={e => update("fieldName", e.target.value)} /></div>
                <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                  <div className="space-y-3"><ParcelMap center={mapCenter} onLocationChange={location => setFormData(current => ({ ...current, ...location }))} onBoundaryChange={boundaryGeoJson => update("boundaryGeoJson", boundaryGeoJson)} /><Button type="button" variant="outline" className="w-full" onClick={handleGetLocation}><MapPin className="mr-2 h-4 w-4" />Get current GPS location</Button></div>
                  <div className="space-y-3 rounded-xl border bg-slate-50 p-4"><div className="grid grid-cols-2 gap-3"><div><Label>Latitude</Label><Input value={formData.latitude} readOnly /></div><div><Label>Longitude</Label><Input value={formData.longitude} readOnly /></div></div><div><Label>GPS accuracy (m)</Label><Input value={formData.locationAccuracyMeters} readOnly placeholder="Captured from device" /></div><div><Label>Reverse-geocoded address</Label><Textarea value={formData.address} readOnly rows={3} placeholder="Tap the map or capture GPS" /></div><div className="flex items-start gap-2 text-xs text-slate-600"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />GPS identifies the field location. It is not a legal land boundary or ownership proof.</div></div>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><div className="mb-3 flex items-center justify-between gap-3"><div><p className="font-semibold text-amber-950">Mouza / plot reference</p><p className="text-xs text-amber-900">Google reverse geocoding does not provide cadastral plot numbers. Verify these in the official land map.</p></div><a className="inline-flex items-center gap-1 text-xs font-semibold text-green-800 underline" href="https://map.land.gov.bd/" target="_blank" rel="noreferrer">Open Smart Bhumi Naksha <ExternalLink className="h-3 w-3" /></a></div><div className="grid gap-3 sm:grid-cols-2"><div><Label>Mouza name (verified)</Label><Input value={formData.mouzaName} onChange={e => update("mouzaName", e.target.value)} /></div><div><Label>Sheet / sit no. (verified)</Label><Input value={formData.sheetNumber} onChange={e => update("sheetNumber", e.target.value)} /></div><div><Label>Plot no. (verified)</Label><Input value={formData.plotNumber} onChange={e => update("plotNumber", e.target.value)} /></div><div><Label>Verification status</Label><Select value={formData.cadastralStatus} onValueChange={value => update("cadastralStatus", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Not verified">Not verified</SelectItem><SelectItem value="Verified in Smart Bhumi Naksha">Verified in Smart Bhumi Naksha</SelectItem><SelectItem value="Verified from land record">Verified from land record</SelectItem></SelectContent></Select></div></div></div>
                <div className="grid gap-4 sm:grid-cols-2"><div><Label>Area (Bigha)</Label><Input placeholder="e.g., 2.5" value={formData.areaInBigha} onChange={e => update("areaInBigha", e.target.value)} /></div><div><Label>Land type</Label><Select value={formData.landType} onValueChange={value => update("landType", value)}><SelectTrigger><SelectValue placeholder="Select land type" /></SelectTrigger><SelectContent>{["High Land", "Medium High Land", "Medium Land", "Low Land", "Very Low Land", "Char Land"].map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div></div>
                <div><Label>Notes</Label><Textarea placeholder="Any additional information..." value={formData.notes} onChange={e => update("notes", e.target.value)} rows={3} /></div>
                <Button onClick={handleCreateField} disabled={createFieldMutation.isPending} className="w-full bg-green-600 hover:bg-green-700">{createFieldMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving parcel...</> : "Save field parcel"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {fieldsQuery.isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div> : fieldsQuery.data && fieldsQuery.data.length > 0 ? <div className="grid gap-6">{fieldsQuery.data.map(field => <Link key={field.id} href={`/field/${field.id}`}><Card className="cursor-pointer transition-shadow hover:shadow-lg"><CardHeader><div className="flex items-start justify-between gap-4"><div><CardTitle>{field.fieldName}</CardTitle><CardDescription>{field.areaInBigha || "Area not set"} Bigha · {field.landType || "Land type not specified"}</CardDescription></div>{field.latitude && field.longitude && <div className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">{field.latitude}, {field.longitude}</div>}</div></CardHeader><CardContent><div className="grid grid-cols-2 gap-4"><div><p className="text-sm text-gray-600">Location</p><p className="font-semibold">{field.address || "GPS saved"}</p></div><div><p className="text-sm text-gray-600">Mouza / Plot</p><p className="font-semibold">{field.mouzaName || "Not verified"}{field.plotNumber ? ` / ${field.plotNumber}` : ""}</p></div></div></CardContent></Card></Link>)}</div> : <Card><CardContent className="py-12 text-center"><Leaf className="mx-auto mb-4 h-12 w-12 text-gray-300" /><p className="mb-4 text-gray-600">No fields yet. Create your first field to get started.</p><Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsOpen(true)}><Plus className="mr-2 h-4 w-4" />Add your first field</Button></CardContent></Card>}
      </div>
    </div>
  );
}
