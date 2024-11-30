export const countries = [
  {
    code: "IN",
    name: "India",
    supportedIds: [
      "Aadhaar Card",
      "Driving License",
      "Voter ID"
    ],
    isSupported: true
  },
  {
    code: "US",
    name: "United States",
    supportedIds: [
      "Social Security Number",
      "Driver's License",
      "State ID"
    ],
    isSupported: false
  },
  // Add more countries as needed
] as const;

export const verificationMethods = {
  "most-advanced": [
    {
      id: "aadhaar-otp",
      name: "Aadhaar ID + OTP",
      requirements: [
        "Aadhaar number",
        "Aadhaar card photo/PDF (front and back)",
        "Person's photo",
        "OTP verification"
      ]
    },
    {
      id: "driving-license-aadhaar",
      name: "Driving License + Aadhaar",
      requirements: [
        "Aadhaar number",
        "Driving license photo/PDF",
        "Driving license number",
        "Date of birth",
        "Person's photo",
        "OTP verification"
      ]
    },
    {
      id: "voter-id-aadhaar",
      name: "Voter ID + Aadhaar",
      requirements: [
        "Aadhaar number",
        "Voter ID photo/PDF",
        "Voter ID number",
        "Date of birth",
        "Person's photo",
        "OTP verification"
      ]
    }
  ],
  "medium-advanced": [
    {
      id: "driving-license",
      name: "Driving License",
      requirements: [
        "Driving license photo/PDF",
        "Driving license number",
        "Date of birth",
        "Person's photo"
      ]
    }
  ],
  "less-advanced": [
    {
      id: "voter-id",
      name: "Voter ID",
      requirements: [
        "Voter ID photo/PDF",
        "Voter ID number",
        "Date of birth",
        "Person's photo"
      ]
    }
  ]
} as const;