import baby1 from "../assets/images/baby1.png";
import baby2 from "../assets/images/baby2.png";
import baby3 from "../assets/images/baby3.png";
import baby4 from "../assets/images/baby4.png";

export const products = [
  {
    id: 1,
    name: "Baby Cotton Romper",
    brand: "Bindra Hosiery",
    category: "Rompers",
    mrp: 499,
    sellingPrice: 399,
    ageGroup: "0-12 Months",
    description: "Soft cotton romper for newborn babies.",
    images: [baby1],

    sizes: [
      { name: "0-3 M", stock: 10 },
      { name: "3-6 M", stock: 8 },
      { name: "6-9 M", stock: 7 },
    ],
  },

  {
    id: 2,
    name: "Kids Socks",
   brand: "Bindra Hosiery",
    category: "Socks",
    mrp: 149,
    sellingPrice: 99,
    ageGroup: "1-5 Years",
    description: "Comfortable cotton socks for kids.",
    images: [baby2],

    sizes: [
      { name: "Free Size", stock: 50 },
    ],
  },

  {
    id: 3,
    name: "Thermal Set",
   brand: "Bindra Hosiery",
    category: "Thermals",
    mrp: 999,
    sellingPrice: 799,
    ageGroup: "2-5 Years",
    description: "Warm thermal set for winter season.",
    images: [baby3],

    sizes: [
      { name: "S", stock: 8 },
      { name: "M", stock: 7 },
      { name: "L", stock: 5 },
    ],
  },

  {
    id: 4,
    name: "Baby Vest",
   brand: "Bindra Hosiery",
    category: "Vest",
    mrp: 249,
    sellingPrice: 199,
    ageGroup: "0-6 Months",
    description: "Soft baby vest for daily wear.",
    images: [baby4],

    sizes: [
      { name: "0-3 M", stock: 20 },
      { name: "3-6 M", stock: 20 },
    ],
  },
];