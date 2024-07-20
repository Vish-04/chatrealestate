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

export type UserType = {
  user_id: {S: string};
  email: {S: string};
  name?: {S: string};
  profileimgUrl?: {S: string};
  createdAt?: {S: string};
  updatedAt?: {S: string};
  chats?: {L: string[]};
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