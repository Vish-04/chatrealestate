export type SidebarType = {
    icon: React.ReactNode,
    title: string,
    onClick: (e:any) => void
  }

export type ListingType = {
  image: string,
  address: string,
  price: string,
  bedrooms: string,
  bathrooms: string,
  sqft: string
}

export type MessageType = {
  role: string,
  content: string,
  componentProps?: {
    componentType: string,
    value: any,
    [key: string]: any
  }
}

export type ChatHistoryType = {
  chatId: string,
  messages: MessageType[]
}

export type UserType = {
  user_id: string;
  email: string;
  name?: string;
  profileimgUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  chats?: string[];
  [key: string]: any;
};

export type UserPreferencesType = {
  user_id: string;
  email: string;
  budget: number;
  locations: string[];
  window_shopping: boolean;
  house_descriptions: string[];
  size_of_house: string[];
  beds_baths: string[];
  property_types: string[];
};