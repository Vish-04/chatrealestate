import { SidebarType, ListingType } from "./types"

// ** Icons Imports
import { IconEdit, IconMessageCircle, IconSend } from '@tabler/icons-react'; 

export const chatStarter = {
    role: {S: "system"}, 
    content:  {S: "You are an ai real estate agent who is helping users find the perfect home. You are also a helpful assistant that can help users with their questions. Answer professionally and in 1-2 sentences. Additionally use any and all of the data about the user provided to you to help make ur descision"}
  }

export const examplePromptsOne = [
    "Cheap homes in Folsom",
    "4-bed in Sacramento",
    "Newest in Roseville",
    "Pools in El Dorado",
    "3+ baths in Rocklin",
    "Garages in Granite Bay",
  ]

export const examplePromptsTwo = [
    "Davis homes under $500k",
    "Citrus Heights 3-bed",
    "Auburn new listings",
    "Fair Oaks townhouses",
    "Rancho Cordova villas",
    "Placerville cottages"
  ]


export const exampleListings: ListingType[] = [
    {
      image: {S: 'https://mediarem.metrolist.net/metrolist/listingpics/bigphoto/2024/07/11/5e3707aa-bd89-49bd-927f-ebc6679955fa.jpg'},
      address: {S: '123 Main St, Folsom, CA'},
      price: {S: '$250,000'},
      bedrooms: {S: '5'},
      bathrooms: {S: '5'},
      sqft: {S: '4,500'}
    },
    {
      image: {S: 'https://mediarem.metrolist.net/metrolist/listingpics/bigphoto/2024/07/10/436450f6-5f36-4527-a340-0ed455e0ba8e.jpg'},
      address: {S: '456 Elm St, Folsom, CA'},
      price: {S: '$320,000'},
      bedrooms: {S: '6'},
      bathrooms: {S: '6'},
      sqft: {S: '5,200'}
    },
    {
      image: {S: 'https://mediarem.metrolist.net/metrolist/listingpics/bigphoto/2024/07/10/58b26077-e4cb-4605-8d1b-9242540a0d82.jpg'},
      address: {S: '789 Oak St, Folsom, CA'},
      price: {S: '$275,000'},
      bedrooms: {S: '5'},
      bathrooms: {S: '5'},
      sqft: {S: '4,900'}
    },
    {
      image: {S: 'https://mediarem.metrolist.net/metrolist/listingpics/bigphoto/2024/07/10/c6ac2e8f-3fbe-4de6-84ce-088b95857d6e.jpg'},
      address: {S: '101 Maple St, Folsom, CA'},
      price: {S: '$300,000'},
      bedrooms: {S: '6'},
      bathrooms: {S: '6'},
      sqft: {S: '5,100'}
    },
    {
      image: {S: 'https://mediarem.metrolist.net/metrolist/listingpics/bigphoto/2024/07/11/fca35bca-af04-4ed6-ac5c-2e35153e7b16.jpg'},
      address: {S: '202 Pine St, Folsom, CA'},
      price: {S: '$350,000'},
      bedrooms: {S: '5'},
      bathrooms: {S: '5'},
      sqft: {S: '6,500'}
    },
    {
      image: {S: 'https://mediarem.metrolist.net/metrolist/listingpics/bigphoto/2024/07/11/44f8b9af-4ede-4ea5-9bfe-b86cf99f666a.jpg'},
      address: {S: '303 Birch St, Folsom, CA'},
      price: {S: '$280,000'},
      bedrooms: {S: '6'},
      bathrooms: {S: '6'},
      sqft: {S: '4,800'}
    }
  ];

