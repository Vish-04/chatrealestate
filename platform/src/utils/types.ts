export type SidebarType = {
    icon: React.ReactNode,
    title: string,
    onClick: (e:any) => void
  }

export type ListingType = {
  image: {S: string},
  address: {S: string},
  price: {S: string},
  bedrooms: {S: string},
  bathrooms: {S: string},
  sqft: {S: string}
}

export type MessageType = {M: {
  role: {S: string},
  content: {S: string},
  componentProps?: {
      M: {
        componentType: {S: string},
        value?: {S: string},
        [key: string]: any
      }
  }
}}

export type ChatHistoryType = {
  chatId: {S: string},
  email: {S:string},
  messages:{L: MessageType[]}
}

type UserChatType = {
  M: {
    chat_id: {S: string},
    title: {S: string},
  }
}

export type UserType = {
  user_id: {S: string};
  email: {S: string};
  name?: {S: string};
  profileimgUrl?: {S: string};
  createdAt?: {S: string};
  updatedAt?: {S: string};
  chats?: {L: UserChatType[]};
  [key: string]: any;
};

export type UserPreferencesType = {
  user_id: {S: string};
  email: {S: string};
  budget: {L: number[]};
  locations: {L: string[]};
  window_shopping: {BOOL: boolean};
  house_descriptions: {L: string[]};
  size_of_house: {L: number[]};
  beds_baths: {L: number[]};
  property_types: {L: string[]};
};

export type DrawerContentType = {
  title: string,
  component: string,
  props: any
}

// LISTINGTYPE

export type ListingDetailType = {
  listings_detail_label: { S: string }, // Address
  zipcode: { S: string },
  "#_of_fireplaces"?: { N: number },
  "#_of_rooms"?: { N: number },
  "#_of_units"?: { N: number },
  agent_link?: { S: string },
  appliances?: { S: string },
  architectural_style?: { S: string },
  "area/district"?: { S: string },
  association_features?: { S: string },
  bath_features?: { S: string },
  bathrooms?: { N: number },
  bedrooms?: { N: number },
  cooling?: { S: string },
  county?: { S: string },
  dining_room_features?: { S: string },
  elementary_school_district?: { S: string },
  flooring?: { S: string },
  full_bathrooms?: { N: number },
  half_bathrooms?: { N: number },
  heating?: { S: string },
  highlights_text?: { S: string },
  interior_features?: { S: string },
  kitchen_features?: { S: string },
  laundry_features?: { S: string },
  listing_agent_name?: { S: string },
  listing_detail_monthly_cost?: { S: string },
  listing_detail_price?: { N: number },
  listing_office_name?: { S: string },
  listing_url?: { S: string },
  living_room_features?: { S: string },
  lot_features?: { S: string },
  master_bathroom_features?: { S: string },
  master_bedroom_features?: { S: string },
  middle_or_junior_school_district?: { S: string },
  mls_number: { S: string },
  num_clicks: { N: number },
  num_views: { N: number },
  open_parking_spaces?: { N: number },
  parking_features?: { S: string },
  patio_and_porch_features?: { S: string },
  pool?: { S: string },
  property_condition?: { S: string },
  property_description?: { S: string },
  property_images?: { L: { S: string }[] },
  rank?: { N: number },
  "remodeled/updated"?: { S: string },
  roof?: { S: string },
  "school_district_(county)"?: { S: string },
  senior_high_school_district?: { S: string },
  square_footage?: { N: number },
  total_parking_spaces?: { N: number },
  window_features?: { S: string },
  year_built?: { S: string },
  [key: string]: any
}