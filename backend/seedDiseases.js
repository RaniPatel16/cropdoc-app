
require("dotenv").config();

const mongoose = require("mongoose");
const Disease = require("./models/Disease");

const diseases = [
  // TOMATO DISEASES

  {
    diseaseId: "tomato-early-blight",
    name: "Early Blight",
    crop: "Tomato",
    description:
      "A fungal disease that commonly affects older tomato leaves and can spread to stems and fruits.",
    symptoms: [
      "Brown spots on older leaves",
      "Concentric ring patterns inside spots",
      "Yellowing around affected areas",
      "Premature leaf drop",
    ],
    causes: [
      "Fungus Alternaria solani",
      "Infected plant debris",
      "Wet foliage and favourable environmental conditions",
    ],
    prevention: [
      "Remove infected plant debris",
      "Avoid overhead irrigation",
      "Maintain proper spacing between plants",
      "Practice crop rotation",
    ],
    treatment: [
      "Remove and dispose of severely affected leaves.",
      "Improve airflow around plants.",
      "Consult a local agricultural expert for approved disease-management options.",
    ],
    sources: [
      {
        organization: "University of Minnesota Extension",
        title: "Early blight in tomato and potato",
        url: "https://extension.umn.edu/disease-management/early-blight-tomato-and-potato",
      },
    ],
  },

  {
    diseaseId: "tomato-late-blight",
    name: "Late Blight",
    crop: "Tomato",
    description:
      "A serious disease that can rapidly damage tomato foliage, stems and fruits.",
    symptoms: [
      "Water-soaked-looking leaf lesions",
      "Dark brown or black patches",
      "White growth may appear under leaves in humid conditions",
      "Dark lesions on stems and fruits",
    ],
    causes: [
      "Oomycete pathogen Phytophthora infestans",
      "Cool and humid weather",
      "Prolonged leaf wetness",
    ],
    prevention: [
      "Use healthy planting material",
      "Avoid overhead irrigation",
      "Maintain good air circulation",
      "Remove infected plant material safely",
    ],
    treatment: [
      "Remove severely infected plant material.",
      "Avoid moving through wet infected plants.",
      "Seek prompt advice from an agricultural expert because this disease can spread rapidly.",
    ],
    sources: [
      {
        organization: "University of Minnesota Extension",
        title: "Late blight in tomato and potato",
        url: "https://extension.umn.edu/disease-management/late-blight",
      },
    ],
  },

  {
    diseaseId: "tomato-bacterial-leaf-spot",
    name: "Bacterial Leaf Spot",
    crop: "Tomato",
    description:
      "A bacterial disease that causes spots on leaves and may also affect stems and fruits.",
    symptoms: [
      "Small dark or water-soaked spots",
      "Yellow halos around some spots",
      "Affected leaf tissue may dry out",
      "Spots may also appear on fruits",
    ],
    causes: [
      "Xanthomonas bacterial species",
      "Infected seeds or transplants",
      "Splashing water and wet foliage",
    ],
    prevention: [
      "Use disease-free seeds and transplants",
      "Avoid handling wet plants",
      "Remove infected plant debris",
      "Use crop rotation",
    ],
    treatment: [
      "Remove severely affected plant material.",
      "Avoid overhead watering.",
      "Consult an agricultural expert for locally approved management options.",
    ],
    sources: [
      {
        organization: "University of Minnesota Extension",
        title: "Bacterial spot of tomato and pepper",
        url: "https://extension.umn.edu/disease-management/bacterial-spot-tomato-and-pepper",
      },
    ],
  },

  {
    diseaseId: "tomato-leaf-curl-virus",
    name: "Tomato Leaf Curl Virus",
    crop: "Tomato",
    description:
      "A viral disease complex that can cause leaf curling and stunted tomato plant growth.",
    symptoms: [
      "Upward or downward curling of leaves",
      "Yellowing of leaf margins",
      "Reduced leaf size",
      "Stunted plant growth",
    ],
    causes: [
      "Tomato yellow leaf curl virus and related begomoviruses",
      "Transmission by whiteflies",
      "Infected plant material",
    ],
    prevention: [
      "Use healthy seedlings",
      "Monitor and manage whitefly populations",
      "Remove infected plants when advised",
      "Remove weeds that may host whiteflies or viruses",
    ],
    treatment: [
      "There is no curative treatment for a virus-infected plant.",
      "Focus on prevention and whitefly management.",
      "Seek local agricultural advice to confirm the virus.",
    ],
    sources: [
      {
        organization: "University of Minnesota Extension",
        title: "Tomato diseases",
        url: "https://extension.umn.edu/plant-diseases/tomato-diseases",
      },
    ],
  },

  {
    diseaseId: "tomato-powdery-mildew",
    name: "Powdery Mildew",
    crop: "Tomato",
    description:
      "A fungal disease that can produce powdery white growth on tomato foliage.",
    symptoms: [
      "White powder-like patches",
      "Yellowing of affected leaves",
      "Drying of leaves",
      "Premature leaf drop in severe cases",
    ],
    causes: [
      "Powdery mildew fungi",
      "Favourable humidity and temperature conditions",
      "Dense plant growth",
    ],
    prevention: [
      "Maintain good air circulation",
      "Avoid excessive plant crowding",
      "Remove severely affected leaves",
      "Monitor plants regularly",
    ],
    treatment: [
      "Remove severely affected leaves where practical.",
      "Improve airflow around plants.",
      "Ask an agricultural expert about suitable locally approved management options.",
    ],
    sources: [
      {
        organization: "University of Minnesota Extension",
        title: "Tomato diseases",
        url: "https://extension.umn.edu/plant-diseases/tomato-diseases",
      },
    ],
  },

  // CHILLI DISEASES

  {
    diseaseId: "chilli-leaf-curl",
    name: "Chilli Leaf Curl",
    crop: "Chilli",
    description:
      "A viral disease complex that can cause distorted leaves and reduced plant growth.",
    symptoms: [
      "Upward or downward leaf curling",
      "Small and distorted leaves",
      "Thickened leaf veins",
      "Stunted plant growth",
    ],
    causes: [
      "Chilli leaf curl-associated begomoviruses",
      "Whitefly transmission",
      "Infected plant material",
    ],
    prevention: [
      "Use healthy seedlings",
      "Monitor whitefly populations",
      "Remove virus-affected plants when advised",
      "Manage weeds around the crop",
    ],
    treatment: [
      "There is no curative treatment for a virus-infected plant.",
      "Focus on prevention and whitefly management.",
      "Confirm the disease with an agricultural expert.",
    ],
    sources: [
      {
        organization: "ICAR",
        title: "Agricultural crop protection guidance",
        url: "https://icar.org.in/",
      },
    ],
  },

  {
    diseaseId: "chilli-anthracnose",
    name: "Anthracnose",
    crop: "Chilli",
    description:
      "A fungal disease that commonly damages chilli fruits and can also affect other plant parts.",
    symptoms: [
      "Dark sunken lesions on fruits",
      "Circular spots on affected fruits",
      "Fruit rot",
      "Small dark spots may occur on leaves",
    ],
    causes: [
      "Colletotrichum fungal species",
      "Infected seeds or plant debris",
      "Warm and humid conditions",
    ],
    prevention: [
      "Use healthy seeds",
      "Remove infected fruits",
      "Avoid excessive moisture on plants",
      "Practice crop rotation",
    ],
    treatment: [
      "Remove and safely dispose of infected fruits.",
      "Avoid leaving diseased fruits in the field.",
      "Seek local agricultural advice for suitable management options.",
    ],
    sources: [
      {
        organization: "ICAR",
        title: "Agricultural crop protection guidance",
        url: "https://icar.org.in/",
      },
    ],
  },

  {
    diseaseId: "chilli-bacterial-leaf-spot",
    name: "Bacterial Leaf Spot",
    crop: "Chilli",
    description:
      "A bacterial disease that causes dark spots and damage to chilli leaves.",
    symptoms: [
      "Small dark leaf spots",
      "Water-soaked lesions",
      "Yellowing around spots",
      "Leaf drop in severe cases",
    ],
    causes: [
      "Xanthomonas bacterial species",
      "Infected seeds or transplants",
      "Water splashing between plants",
    ],
    prevention: [
      "Use healthy seeds and seedlings",
      "Avoid overhead irrigation",
      "Remove infected plant debris",
      "Maintain proper plant spacing",
    ],
    treatment: [
      "Remove severely affected plant material.",
      "Avoid handling wet plants.",
      "Consult a local agricultural expert for management advice.",
    ],
    sources: [
      {
        organization: "ICAR",
        title: "Agricultural crop protection guidance",
        url: "https://icar.org.in/",
      },
    ],
  },

  {
    diseaseId: "chilli-powdery-mildew",
    name: "Powdery Mildew",
    crop: "Chilli",
    description:
      "A fungal disease that produces powdery white growth on chilli leaves.",
    symptoms: [
      "White powdery patches",
      "Yellowing of leaves",
      "Drying of affected leaves",
      "Premature leaf drop",
    ],
    causes: [
      "Powdery mildew fungi",
      "Favourable humidity conditions",
      "Dense plant growth",
    ],
    prevention: [
      "Maintain good air circulation",
      "Avoid overcrowding",
      "Remove severely affected leaves",
      "Monitor crops regularly",
    ],
    treatment: [
      "Remove severely affected leaves where practical.",
      "Improve airflow around plants.",
      "Consult an agricultural expert for locally approved management options.",
    ],
    sources: [
      {
        organization: "ICAR",
        title: "Agricultural crop protection guidance",
        url: "https://icar.org.in/",
      },
    ],
  },

  {
    diseaseId: "chilli-phytophthora-blight",
    name: "Phytophthora Blight",
    crop: "Chilli",
    description:
      "A soil- and water-associated disease that can damage chilli roots, stems and foliage.",
    symptoms: [
      "Sudden wilting",
      "Dark lesions near the stem base",
      "Root and collar rot",
      "Plant collapse in severe cases",
    ],
    causes: [
      "Phytophthora capsici",
      "Waterlogged soil",
      "Poor drainage",
      "Movement of contaminated water or soil",
    ],
    prevention: [
      "Maintain proper field drainage",
      "Avoid waterlogging",
      "Use healthy seedlings",
      "Practice crop rotation",
    ],
    treatment: [
      "Improve drainage and avoid waterlogging.",
      "Remove severely affected plants when advised.",
      "Seek prompt agricultural advice for suitable management options.",
    ],
    sources: [
      {
        organization: "ICAR",
        title: "Agricultural crop protection guidance",
        url: "https://icar.org.in/",
      },
    ],
  },
];

async function seedDiseases() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected for disease seeding.");

    for (const disease of diseases) {
      await Disease.updateOne(
        { diseaseId: disease.diseaseId },
        {
          $set: disease,
          $setOnInsert: {
            verificationStatus: "draft",
          },
        },
        { upsert: true }
      );
    }

    console.log("Disease records inserted or updated successfully.");
    console.log(`Total disease records processed: ${diseases.length}`);
  } catch (error) {
    console.error("Disease seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
}

seedDiseases();
