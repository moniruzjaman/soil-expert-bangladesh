import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Leaf, Plus, Calendar, Droplet, Sprout, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

const ACTIVITY_TYPES = [
  "Soil Testing",
  "Fertilizer Application",
  "Irrigation",
  "Crop Planting",
  "Crop Harvesting",
  "Pest Management",
  "Weed Management",
  "Other",
];

export default function Records() {
  const { user } = useAuth();
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [activityType, setActivityType] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [cost, setCost] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fieldsQuery = trpc.fields.list.useQuery();
  const activitiesQuery = trpc.activity.getFieldRecords.useQuery(
    { fieldId: selectedField || 0 },
    { enabled: !!selectedField }
  );
  const createActivityMutation = trpc.activity.create.useMutation({
    onSuccess: () => {
      toast.success("Activity recorded successfully");
      setActivityType("");
      setDescription("");
      setQuantity("");
      setUnit("");
      setCost("");
      setIsOpen(false);
      activitiesQuery.refetch();
    },
    onError: (error) => {
      toast.error("Failed to record activity: " + error.message);
    },
  });

  const handleCreateActivity = () => {
    if (!selectedField || !activityType) {
      toast.error("Please select a field and activity type");
      return;
    }

    createActivityMutation.mutate({
      fieldId: selectedField,
      activityType,
      description: description || undefined,
      quantity: quantity || undefined,
      unit: unit || undefined,
      cost: cost || undefined,
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "Soil Testing":
        return <Sprout className="w-5 h-5 text-green-600" />;
      case "Fertilizer Application":
        return <TrendingUp className="w-5 h-5 text-orange-600" />;
      case "Irrigation":
        return <Droplet className="w-5 h-5 text-blue-600" />;
      case "Crop Planting":
        return <Leaf className="w-5 h-5 text-green-600" />;
      case "Crop Harvesting":
        return <TrendingUp className="w-5 h-5 text-yellow-600" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-600" />;
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Farmer Record Keeping</h2>
          <p className="text-gray-600">Track soil tests, fertilizer applications, irrigation, and crop activities</p>
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

          {/* Add Activity Button */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow lg:col-span-2 flex items-center justify-center">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Plus className="w-8 h-8 text-green-600 mb-2" />
                  <p className="font-semibold text-gray-900">Record Activity</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Farm Activity</DialogTitle>
                <DialogDescription>Log soil tests, fertilizer, irrigation, and crop activities</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="activity-type">Activity Type</Label>
                  <Select value={activityType} onValueChange={setActivityType}>
                    <SelectTrigger id="activity-type">
                      <SelectValue placeholder="Choose activity" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVITY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Details about this activity..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      placeholder="Amount"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      placeholder="kg, liters, etc."
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cost">Cost (Taka)</Label>
                  <Input
                    id="cost"
                    placeholder="0"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleCreateActivity}
                  disabled={createActivityMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {createActivityMutation.isPending ? "Recording..." : "Record Activity"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Activity Records */}
        {selectedField && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Activity History</h3>
            {activitiesQuery.data && activitiesQuery.data.length > 0 ? (
              <div className="space-y-4">
                {activitiesQuery.data.map((activity) => (
                  <Card key={activity.id} className="border-l-4 border-l-green-600">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          {getActivityIcon(activity.activityType)}
                          <div>
                            <h4 className="font-semibold text-gray-900">{activity.activityType}</h4>
                            {activity.description && (
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            )}
                            {activity.quantity && (
                              <p className="text-sm text-gray-600">
                                Quantity: {activity.quantity} {activity.unit}
                              </p>
                            )}
                            {activity.cost && (
                              <p className="text-sm text-gray-600">Cost: ৳{activity.cost}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {activity.activityDate
                              ? new Date(activity.activityDate).toLocaleDateString("en-BD")
                              : "No date"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No activities recorded yet for this field</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!selectedField && (
          <Card>
            <CardContent className="py-12 text-center">
              <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Select a field to view and record activities</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
