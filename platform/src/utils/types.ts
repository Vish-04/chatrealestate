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
    value?: any,
    [key: string]: any
  }
}

export type ChatHistoryType = {
  chatId: string,
  messages: MessageType[]
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