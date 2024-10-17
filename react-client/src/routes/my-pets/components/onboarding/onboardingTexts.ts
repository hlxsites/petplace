export const ONBOARDING_STEPS_TEXTS = {
  1: {
    imgAlt: "Comfy dog and cat",
    message:
      "Your go-to destination for keeping pets happy and healthy. Discover sound advice, trusted providers, and indispensable services all in one place.",
    title: "Welcome to PetPlace!",
  },
  2: {
    imgAlt24Pet: "24 Pet Watch Logo",
    imgAltPetPlace: "Pet Place Logo",
    message:
      "Your and your pet's information has moved to PetPlace. You can now access your 24Petwatch account from PetPlace.",
    title: "Important notice for 24Petwatch customers.",
  },
  3: {
    imgAlt: "Friendly dog and cat",
    message:
      "MyPets is where you keep track of all your pet's important stuff. Plus, recommendations on how to keep your pet protected!",
    title: "It's all about your pet!",
  },
  4: {
    approved: {
      title: "Upload Successful!",
      message:
        "Your pet’s documents have been uploaded successfully and are now available.",
    },
    failed: {
      title: "Upload Failed",
      message:
        "There was an issue uploading your pet’s documents. Please try again or upload them manually.",
    },
    inProgress: {
      title: "Upload In Progress",
      message:
        "Your pet’s documents are being uploaded. They will be available within 24 hours.",
    },
    none: {
      title: "At PetPlace you can access all your pet's adoption documents.",
      imgAlt: "Icons representing available pet services",
      message: (name?: string) => [
        "Update, add files, download, or print. It's the one place to keep all your pet's details. ",
        `If available, would you like PetPlace to access and upload ${name ?? "your pet"}'s shelter documents for you?`,
      ],
    },
    sent: {
      title: "Uploading...",
      message:
        "Your pet’s documents are being processed. Please wait a moment while we complete the upload.",
    },
  },
  5: {
    message:
      "Your pet's microchip is registered. Now let’s ensure your pet's safety with added layers of protection.",
    title: "Almost there!",
    microchip: "Microchip registration",
    documents: "Digital documents",
    protection: "Enhanced pet protection",
  },
};
