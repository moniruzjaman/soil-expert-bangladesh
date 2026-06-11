import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, BookOpen, Beaker, Droplets } from "lucide-react";
import { Link } from "wouter";

export default function Knowledge() {
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Library</h2>
          <p className="text-gray-600">Learn about soil science, fertilizers, and sustainable agriculture practices</p>
        </div>

        <Tabs defaultValue="soil" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="soil">Soil Science</TabsTrigger>
            <TabsTrigger value="fertilizer">Fertilizers</TabsTrigger>
            <TabsTrigger value="irrigation">Irrigation</TabsTrigger>
            <TabsTrigger value="climate">Climate Smart</TabsTrigger>
          </TabsList>

          {/* Soil Science */}
          <TabsContent value="soil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-blue-600" />
                  Soil pH Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What is Soil pH?</h4>
                  <p className="text-gray-700">
                    Soil pH measures the acidity or alkalinity of soil on a scale of 0-14. A pH of 7 is neutral; below 7 is acidic, above 7 is alkaline. Most crops prefer slightly acidic to neutral soil (pH 6.0-7.5).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">pH Ranges for Bangladesh Crops:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Rice:</strong> 5.5-7.0 (tolerates acidic soils)</li>
                    <li><strong>Wheat:</strong> 6.0-7.5</li>
                    <li><strong>Potato:</strong> 5.5-7.0</li>
                    <li><strong>Vegetables:</strong> 6.0-7.0</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Correcting Acidic Soil:</h4>
                  <p className="text-gray-700 mb-2">Apply agricultural lime (CaCO3) at 2-3 tons/ha to raise pH. Effects take 2-3 months to appear.</p>
                  <p className="text-gray-700">Organic matter also helps buffer soil pH. Add 5-10 tons/ha compost annually.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Soil Organic Matter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Importance:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Improves soil structure and water retention</li>
                    <li>Provides nutrients through decomposition</li>
                    <li>Increases microbial activity</li>
                    <li>Reduces soil compaction</li>
                    <li>Sequesters carbon (climate benefit)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Target Levels:</h4>
                  <p className="text-gray-700">2-3% organic matter is ideal for Bangladesh soils. Most soils are deficient (0.5-1.5%).</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How to Increase:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Add 5-10 tons/ha compost annually</li>
                    <li>Use green manuring (grow and plow in legumes)</li>
                    <li>Crop residue incorporation</li>
                    <li>Vermicompost application</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Soil Texture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Soil Texture Triangle:</h4>
                  <p className="text-gray-700 mb-2">Soil texture is determined by the proportion of sand, silt, and clay:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Sandy:</strong> Fast drainage, low water retention, needs frequent irrigation</li>
                    <li><strong>Loamy:</strong> Ideal balance, good drainage and water retention</li>
                    <li><strong>Clay:</strong> Slow drainage, high water retention, prone to waterlogging</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Improving Soil Texture:</h4>
                  <p className="text-gray-700">Add organic matter to improve structure regardless of texture type.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fertilizers */}
          <TabsContent value="fertilizer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>NPK Nutrients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Nitrogen (N):</h4>
                  <p className="text-gray-700 mb-2"><strong>Function:</strong> Promotes leaf and stem growth, chlorophyll production</p>
                  <p className="text-gray-700"><strong>Deficiency:</strong> Yellowing leaves, stunted growth</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Phosphorus (P):</h4>
                  <p className="text-gray-700 mb-2"><strong>Function:</strong> Root development, flower/fruit formation, energy transfer</p>
                  <p className="text-gray-700"><strong>Deficiency:</strong> Purple/red discoloration, poor root growth</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Potassium (K):</h4>
                  <p className="text-gray-700 mb-2"><strong>Function:</strong> Disease resistance, drought tolerance, fruit quality</p>
                  <p className="text-gray-700"><strong>Deficiency:</strong> Leaf scorch, weak stems</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Micronutrients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Zinc (Zn):</h4>
                  <p className="text-gray-700">Critical for rice in Bangladesh. Deficiency causes bronzing in rice leaves. Apply 2-3 kg/ha.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Boron (B):</h4>
                  <p className="text-gray-700">Important for potato, vegetables. Deficiency causes hollow heart in potato. Apply 1-2 kg/ha.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Iron (Fe), Manganese (Mn), Copper (Cu):</h4>
                  <p className="text-gray-700">Apply based on soil test results. Foliar spray is effective for quick correction.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organic vs Chemical Fertilizers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Organic Fertilizers:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Slow release, long-term soil improvement</li>
                    <li>Improve soil structure and microbial activity</li>
                    <li>Examples: compost, manure, vermicompost</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Chemical Fertilizers:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Quick nutrient availability</li>
                    <li>Precise nutrient content</li>
                    <li>Cost-effective for immediate needs</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Best Practice:</h4>
                  <p className="text-gray-700">Combine both: Use organic fertilizers as base (5-10 tons/ha) + chemical fertilizers for specific crop needs.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Irrigation */}
          <TabsContent value="irrigation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-cyan-600" />
                  Alternate Wetting and Drying (AWD)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What is AWD?</h4>
                  <p className="text-gray-700">AWD is a water-saving irrigation technique for rice where fields are alternately flooded and allowed to dry between irrigations.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Saves 20-30% water</li>
                    <li>Reduces methane emissions</li>
                    <li>Improves soil structure</li>
                    <li>Reduces disease incidence</li>
                    <li>Lower production costs</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Implementation:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    <li>Maintain 5-7 cm standing water for first 30 days</li>
                    <li>Drain field when soil cracks appear</li>
                    <li>Irrigate when soil becomes hard</li>
                    <li>Stop AWD 15-20 days before harvest</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Climate Smart */}
          <TabsContent value="climate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Climate-Smart Agriculture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Adaptation Strategies for Bangladesh:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Use flood-tolerant rice varieties</li>
                    <li>Adopt drought-tolerant crops in dry regions</li>
                    <li>Implement water harvesting</li>
                    <li>Practice crop diversification</li>
                    <li>Use improved varieties suited to local conditions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Mitigation Strategies:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Increase soil carbon through organic matter addition</li>
                    <li>Use AWD to reduce methane emissions</li>
                    <li>Reduce tillage (conservation agriculture)</li>
                    <li>Plant trees and maintain vegetation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
