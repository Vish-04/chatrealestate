

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
  