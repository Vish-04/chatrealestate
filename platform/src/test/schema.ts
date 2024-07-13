// USER
// - id : UUID
// - email: string
// - profileimgUrl: string
// - name: string
// - createdAt : Date
// - updatedAt : Date
// - chats : string[]



// User Preferences
// - user_id
// - budget
// - locations
// - windowShopping
// - ideal house descriptions
// - size of house
// - property types

// Listings
// active: boolean
// listing_url: string
// Zipcode: string
// property_description:
// Year_built:
// property_images:
// Property Condition:
// listing_detail_price:  
// Features: {
//       Dining Room Features:
//       Patio And Porch Features:
//       Living Room Features:
//       Window Features:
//       Bath Features:
//       Parking Features:
//       Master Bathroom Features:
//       Master Bedroom Features:
//       Cooling:
//       Heating:
//       Laundry Features:
//       Lot Features:
//       Interior Features:
//       Kitchen Features:
//       Association Features:
//       Appliances:
//       # of Fireplaces:
//       
// }
// mls_number:
// Bathrooms:
// Half Bathrooms:
// Full Bathrooms:
// Square Footage:
// # of Rooms
// Area/District:
// listing_detail_monthly_cost:
// Total Parking Spaces:
// Elementary School District:
// Senior High School District:
// Middle or Junior School District:
// Roof:
// agent_link:
// Listing Agent Name:
// Listing Office Name:
// Remodeled/Updated:
// Open Parking Spaces:
// Area/District:
// listing_detail_monthly_cost:
// # of Units:
// highlights_text:
// School District (County):
// Flooring:
// Architectural Style:
// County:
// Pool:








// Relation - Listings leads
// - user_id : string
// - viewed_listing_ids = []
// - duration: number
// - clicked_listing_ids= []

//Chats - DynamoDB
// object_id : string
// message history: {
//   user_id: string
//   role: string
//   message: string
//   createdAt: Date
// }