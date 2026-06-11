/**
 * Bangladesh AEZ (Agro-Ecological Zone) Soil Profile Data
 * Based on 2024 agronomic data and Fertilizer Recommendation Guide 2018
 * Focus on Kurigram and surrounding regions
 */

export const aezSoilData = [
  {
    aezCode: "AEZ-3",
    aezName: "Tista Meander Floodplain",
    district: "Kurigram, Rangpur",
    upazila: "Kurigram Sadar, Nageswari, Raiganj",
    description: "Tista Meander Floodplain with medium to high fertility in pockets, drainage congestion risk",
    defaultSoilPH: "5.5-6.5",
    organicMatterStatus: "Low to Medium",
    fertilityClass: "Medium",
    dominantSoilTexture: "Silty Loam, Clay Loam",
    landType: "Medium High Land",
  },
  {
    aezCode: "AEZ-7",
    aezName: "Active Brahmaputra-Jamuna Floodplain",
    district: "Kurigram, Jamalpur",
    upazila: "Kurigram Sadar, Char Rajibpur, Kurigram Sadar",
    description: "Active Brahmaputra-Jamuna Floodplain with high flood risk, char land instability, medium-low fertility",
    defaultSoilPH: "5.0-6.0",
    organicMatterStatus: "Low",
    fertilityClass: "Low to Medium",
    dominantSoilTexture: "Sandy Loam, Loamy Sand",
    landType: "Low Land, Char Land",
  },
  {
    aezCode: "AEZ-1",
    aezName: "Himalayan Foothills",
    district: "Rangpur",
    upazila: "Rangpur Sadar, Mithapukur",
    description: "Himalayan foothills with moderate to high fertility, well-drained soils",
    defaultSoilPH: "6.0-7.0",
    organicMatterStatus: "Medium",
    fertilityClass: "Medium to High",
    dominantSoilTexture: "Loam, Clay Loam",
    landType: "Medium High Land",
  },
  {
    aezCode: "AEZ-2",
    aezName: "Active Tista Floodplain",
    district: "Rangpur, Nilphamari",
    upazila: "Rangpur Sadar, Saidpur, Nilphamari Sadar",
    description: "Active Tista Floodplain with seasonal flooding, medium fertility",
    defaultSoilPH: "5.5-6.5",
    organicMatterStatus: "Low to Medium",
    fertilityClass: "Medium",
    dominantSoilTexture: "Silty Loam, Sandy Loam",
    landType: "Medium High Land, Low Land",
  },
  {
    aezCode: "AEZ-4",
    aezName: "Karatoya-Bangali Floodplain",
    district: "Rangpur, Dinajpur",
    upazila: "Rangpur Sadar, Dinajpur Sadar",
    description: "Karatoya-Bangali Floodplain with moderate fertility and drainage issues",
    defaultSoilPH: "5.5-6.5",
    organicMatterStatus: "Low to Medium",
    fertilityClass: "Medium",
    dominantSoilTexture: "Clay Loam, Silty Clay",
    landType: "Medium High Land",
  },
  {
    aezCode: "AEZ-5",
    aezName: "Piedmont Floodplain",
    district: "Rangpur, Gaibandha",
    upazila: "Rangpur Sadar, Gaibandha Sadar",
    description: "Piedmont Floodplain with variable fertility and seasonal waterlogging",
    defaultSoilPH: "6.0-7.0",
    organicMatterStatus: "Medium",
    fertilityClass: "Medium",
    dominantSoilTexture: "Loam, Sandy Clay Loam",
    landType: "Medium High Land",
  },
];

/**
 * Crop suitability matrix for Bangladesh AEZs
 * Based on FRG 2018 and agronomic research
 */
export const cropSuitabilityMatrix = {
  "AEZ-3": {
    kharif: [
      { crop: "T. Aman Rice", suitability: "Highly Suitable", yieldPotential: "4.5-5.5 t/ha" },
      { crop: "Jute", suitability: "Suitable", yieldPotential: "3.0-3.5 t/ha" },
      { crop: "Mungbean", suitability: "Suitable", yieldPotential: "1.2-1.8 t/ha" },
      { crop: "Groundnut", suitability: "Marginally Suitable", yieldPotential: "1.5-2.0 t/ha" },
    ],
    rabi: [
      { crop: "Boro Rice", suitability: "Highly Suitable", yieldPotential: "5.5-6.5 t/ha" },
      { crop: "Wheat", suitability: "Suitable", yieldPotential: "4.0-4.5 t/ha" },
      { crop: "Mustard", suitability: "Suitable", yieldPotential: "1.8-2.2 t/ha" },
      { crop: "Lentil", suitability: "Suitable", yieldPotential: "1.5-2.0 t/ha" },
      { crop: "Potato", suitability: "Suitable", yieldPotential: "20-25 t/ha" },
    ],
    zaid: [
      { crop: "Watermelon", suitability: "Suitable", yieldPotential: "25-30 t/ha" },
      { crop: "Cucumber", suitability: "Suitable", yieldPotential: "20-25 t/ha" },
    ],
  },
  "AEZ-7": {
    kharif: [
      { crop: "B. Aus Rice (Early)", suitability: "Highly Suitable", yieldPotential: "2.5-3.5 t/ha" },
      { crop: "T. Aman Rice (Short Duration)", suitability: "Suitable", yieldPotential: "3.0-4.0 t/ha" },
      { crop: "Mungbean", suitability: "Highly Suitable", yieldPotential: "1.2-1.8 t/ha" },
      { crop: "Jute", suitability: "Marginally Suitable", yieldPotential: "2.0-2.5 t/ha" },
    ],
    rabi: [
      { crop: "Potato (Early)", suitability: "Highly Suitable", yieldPotential: "18-22 t/ha" },
      { crop: "Wheat", suitability: "Suitable", yieldPotential: "3.5-4.0 t/ha" },
      { crop: "Mustard", suitability: "Suitable", yieldPotential: "1.5-2.0 t/ha" },
    ],
    zaid: [
      { crop: "Watermelon", suitability: "Suitable", yieldPotential: "20-25 t/ha" },
    ],
  },
};

/**
 * Cropping patterns recommended for Bangladesh AEZs
 */
export const croppingPatterns = {
  "AEZ-3": [
    {
      pattern: "Boro Rice - T. Aman Rice",
      profitability: "High",
      description: "Traditional double rice cropping system with high productivity",
    },
    {
      pattern: "Potato - Kenaf - T. Aman Rice",
      profitability: "Very High",
      description: "High-value cropping pattern with improved profitability over traditional Potato-Jute-T.Aman",
    },
    {
      pattern: "Wheat - Mungbean - T. Aman Rice",
      profitability: "High",
      description: "Diversified pattern with legume inclusion for soil health",
    },
  ],
  "AEZ-7": [
    {
      pattern: "Early Potato - Mungbean - T. Aman Rice",
      profitability: "Very High",
      description: "Optimized for char lands with short-duration crops between flood events",
    },
    {
      pattern: "B. Aus Rice - Mungbean",
      profitability: "Medium",
      description: "Short-duration pattern suitable for flood-prone areas",
    },
    {
      pattern: "Potato - Wheat - Mungbean",
      profitability: "High",
      description: "Alternative pattern for areas with reduced flood risk",
    },
  ],
};

/**
 * Fertilizer recommendation data based on FRG 2018
 * NPK values in kg/ha for different crops and yield goals
 */
export const fertilizerRecommendationData = {
  "Boro Rice": {
    yieldGoals: {
      "4 t/ha": { N: 80, P: 20, K: 20, Zn: 2, B: 1 },
      "5 t/ha": { N: 100, P: 25, K: 25, Zn: 2.5, B: 1.5 },
      "6 t/ha": { N: 120, P: 30, K: 30, Zn: 3, B: 2 },
    },
    micronutrients: {
      Zinc: "2-3 kg/ha (as zinc sulfate)",
      Boron: "1-2 kg/ha (as borax)",
      Sulfur: "20-30 kg/ha (if deficient)",
    },
    organicFertilizer: "5-10 t/ha well-decomposed compost or cowdung",
    chemicalFertilizer: "Urea, TSP, MOP as per NPK recommendation",
    bioFertilizer: "Azospirillum or Azotobacter for N fixation",
    limingRecommendation: "2-3 t/ha lime if pH < 5.5",
    applicationSchedule: "Basal: 50% N, 100% P, K, Zn, B; Top dressing: 50% N at tillering and panicle initiation",
  },
  "T. Aman Rice": {
    yieldGoals: {
      "4 t/ha": { N: 60, P: 15, K: 15, Zn: 2, B: 1 },
      "5 t/ha": { N: 80, P: 20, K: 20, Zn: 2.5, B: 1.5 },
    },
    micronutrients: {
      Zinc: "2-3 kg/ha (as zinc sulfate)",
      Boron: "1-2 kg/ha (as borax)",
    },
    organicFertilizer: "5 t/ha well-decomposed compost",
    chemicalFertilizer: "Urea, TSP, MOP as per NPK recommendation",
    bioFertilizer: "Azospirillum for N fixation",
    limingRecommendation: "2-3 t/ha lime if pH < 5.5",
    applicationSchedule: "Basal: 50% N, 100% P, K, Zn, B; Top dressing: 50% N at tillering",
  },
  "Wheat": {
    yieldGoals: {
      "3 t/ha": { N: 60, P: 20, K: 20, Zn: 2, B: 1 },
      "4 t/ha": { N: 80, P: 25, K: 25, Zn: 2.5, B: 1.5 },
      "4.5 t/ha": { N: 100, P: 30, K: 30, Zn: 3, B: 2 },
    },
    micronutrients: {
      Zinc: "2-3 kg/ha (as zinc sulfate)",
      Boron: "1-2 kg/ha (as borax)",
    },
    organicFertilizer: "5 t/ha well-decomposed compost",
    chemicalFertilizer: "Urea, TSP, MOP as per NPK recommendation",
    bioFertilizer: "Azospirillum for N fixation",
    limingRecommendation: "2-3 t/ha lime if pH < 5.5",
    applicationSchedule: "Basal: 100% P, K, Zn, B, 50% N; Top dressing: 50% N at CRI stage",
  },
  "Potato": {
    yieldGoals: {
      "15 t/ha": { N: 100, P: 60, K: 100, Zn: 2, B: 1.5 },
      "20 t/ha": { N: 120, P: 80, K: 120, Zn: 2.5, B: 2 },
      "25 t/ha": { N: 150, P: 100, K: 150, Zn: 3, B: 2.5 },
    },
    micronutrients: {
      Zinc: "2-3 kg/ha (as zinc sulfate)",
      Boron: "1.5-2.5 kg/ha (as borax)",
    },
    organicFertilizer: "10-15 t/ha well-decomposed compost or cowdung",
    chemicalFertilizer: "Urea, TSP, MOP as per NPK recommendation",
    bioFertilizer: "Azospirillum for N fixation",
    limingRecommendation: "2-3 t/ha lime if pH < 5.5",
    applicationSchedule: "Basal: 100% P, K, Zn, B, 50% N; Top dressing: 50% N at earthing up",
  },
  "Mungbean": {
    yieldGoals: {
      "1 t/ha": { N: 20, P: 15, K: 15, Zn: 1.5, B: 1 },
      "1.5 t/ha": { N: 25, P: 20, K: 20, Zn: 2, B: 1.5 },
      "2 t/ha": { N: 30, P: 25, K: 25, Zn: 2.5, B: 2 },
    },
    micronutrients: {
      Zinc: "1.5-2.5 kg/ha (as zinc sulfate)",
      Boron: "1-1.5 kg/ha (as borax)",
    },
    organicFertilizer: "3-5 t/ha well-decomposed compost",
    chemicalFertilizer: "TSP, MOP as per P, K recommendation; minimal N due to N fixation",
    bioFertilizer: "Rhizobium for N fixation (essential for legumes)",
    limingRecommendation: "2-3 t/ha lime if pH < 5.5",
    applicationSchedule: "Basal: 100% P, K, Zn, B, Rhizobium inoculant",
  },
};

/**
 * Irrigation advisory for crops
 */
export const irrigationAdvisory = {
  "Boro Rice": {
    totalWaterRequirement: "1000-1200 mm",
    irrigationMethod: "Flood irrigation with AWD technique",
    awd: {
      description: "Alternate Wetting and Drying (AWD) - Allow field to dry to 15cm below water surface, then irrigate",
      waterSaving: "20-30% reduction in water use",
      stages: [
        "Nursery to transplanting: Maintain 5cm water depth",
        "Vegetative stage (0-60 DAS): Apply AWD - dry to 15cm below surface, then irrigate",
        "Reproductive stage (60-90 DAS): Maintain 5cm water depth",
        "Maturity (90+ DAS): Drain field 15 days before harvest",
      ],
    },
    irrigationSchedule: "7-10 days interval depending on soil type and weather",
    waterSavingTips: [
      "Use AWD technique to reduce water use by 20-30%",
      "Mulch to reduce evaporation",
      "Improve field leveling to ensure uniform water distribution",
      "Use drip irrigation where feasible",
      "Avoid standing water during maturity stage",
    ],
  },
  "Wheat": {
    totalWaterRequirement: "400-500 mm",
    irrigationMethod: "Sprinkler or flood irrigation",
    irrigationSchedule: "3-4 irrigations: CRI (Crown Root Initiation), Tillering, Grain filling",
    waterSavingTips: [
      "Apply first irrigation at CRI stage (20-25 DAS)",
      "Second irrigation at tillering (45-50 DAS)",
      "Third irrigation at grain filling (70-75 DAS)",
      "Use sprinkler irrigation to save 20-25% water",
      "Avoid irrigation during heading stage in high-temperature areas",
    ],
  },
  "Potato": {
    totalWaterRequirement: "400-500 mm",
    irrigationMethod: "Sprinkler or drip irrigation preferred",
    irrigationSchedule: "4-5 irrigations: Planting, Emergence, Tuber initiation, Tuber bulking, Pre-harvest",
    waterSavingTips: [
      "Use drip irrigation for 30-40% water saving",
      "Avoid water stress during tuber initiation and bulking",
      "Reduce irrigation in final 2 weeks before harvest",
      "Mulch to conserve soil moisture",
      "Monitor soil moisture regularly",
    ],
  },
  "Mungbean": {
    totalWaterRequirement: "300-400 mm",
    irrigationMethod: "Flood or sprinkler irrigation",
    irrigationSchedule: "2-3 irrigations: Flowering, Pod development, Pre-harvest",
    waterSavingTips: [
      "Apply irrigation at flowering stage",
      "Second irrigation at pod development",
      "Avoid water stress during critical growth stages",
      "Use mulch to reduce evaporation",
      "Reduce irrigation in final week before harvest",
    ],
  },
};

/**
 * Soil recharging and organic matter improvement strategies
 */
export const soilRechargingStrategies = {
  greenManuring: {
    description: "Growing leguminous crops and incorporating them into soil to improve fertility",
    crops: [
      "Dhaincha (Sesbania aculeata) - 40-50 days, adds 100-150 kg N/ha",
      "Sunhemp (Crotalaria juncea) - 60-70 days, adds 150-200 kg N/ha",
      "Cowpea (Vigna unguiculata) - 45-60 days, adds 80-120 kg N/ha",
    ],
    benefits: [
      "Adds 100-200 kg N/ha",
      "Improves soil structure and water retention",
      "Increases organic matter content",
      "Reduces pest and disease incidence",
    ],
    timing: "Best during fallow periods or between crop seasons",
  },
  compost: {
    description: "Decomposed organic matter from crop residues, animal manure, and kitchen waste",
    preparation: [
      "Collect organic materials (crop residues, animal manure, leaves)",
      "Layer materials in 15-20cm thick layers",
      "Maintain moisture at 50-60% (like squeezed sponge)",
      "Turn pile every 2-3 weeks",
      "Ready in 3-4 months when dark brown and crumbly",
    ],
    benefits: [
      "Adds 2-3% organic matter to soil",
      "Improves soil structure and water retention",
      "Provides slow-release nutrients",
      "Enhances microbial activity",
    ],
    applicationRate: "5-10 t/ha annually",
  },
  vermicompost: {
    description: "Organic matter decomposed by earthworms, rich in nutrients and microbes",
    preparation: [
      "Collect organic waste (crop residues, animal manure, kitchen waste)",
      "Layer materials in 10-15cm thick layers",
      "Introduce earthworms (Eisenia fetida or local species)",
      "Maintain moisture and aeration",
      "Ready in 2-3 months",
    ],
    benefits: [
      "High in plant-available nutrients (N, P, K)",
      "Rich in beneficial microorganisms",
      "Improves soil structure and water retention",
      "Reduces plant diseases",
    ],
    applicationRate: "2-5 t/ha annually",
  },
  bioFertilizer: {
    description: "Microbial inoculants that fix nitrogen or solubilize phosphorus",
    types: [
      "Azospirillum - N fixation for cereals",
      "Azotobacter - N fixation for non-legumes",
      "Rhizobium - N fixation for legumes",
      "Phosphate Solubilizing Bacteria (PSB) - P solubilization",
    ],
    benefits: [
      "Fixes 20-40 kg N/ha (Azospirillum/Azotobacter)",
      "Solubilizes fixed P in soil",
      "Improves nutrient uptake",
      "Reduces chemical fertilizer requirement",
    ],
    applicationMethod: "Seed treatment or soil application",
  },
  soilAmendments: {
    description: "Materials added to improve soil properties, especially for acidic soils",
    materials: [
      "Lime (CaCO3) - 2-3 t/ha for pH < 5.5",
      "Dolomite (CaMg(CO3)2) - 2-3 t/ha for Mg deficiency",
      "Gypsum (CaSO4) - 1-2 t/ha for S deficiency",
      "Biochar - 5-10 t/ha for improved water retention",
    ],
    benefits: [
      "Raises soil pH for acidic soils",
      "Provides Ca, Mg, S nutrients",
      "Improves soil structure",
      "Increases water retention",
    ],
  },
};
