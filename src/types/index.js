// Type definitions for reference (now as JSDoc comments)

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} full_name
 * @property {'donor' | 'volunteer' | 'recipient'} role
 * @property {string} [phone_number]
 * @property {string} [address]
 * @property {string} [avatar_url]
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} displayName
 * @property {string} uid
 */

/**
 * @typedef {Object} DonationRequest
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} food_type
 * @property {number} food_quantity
 * @property {string} food_weight
 * @property {string} expiration_date
 * @property {string} pickup_date_time
 * @property {string} donor_id
 * @property {string} donor_name
 * @property {'pending' | 'accepted' | 'in-progress' | 'delivered' | 'completed'} status
 * @property {string} [volunteer_id]
 * @property {string} [volunteer_name]
 * @property {string} [recipient_id]
 * @property {string} [recipient_name]
 * @property {number} location_lat
 * @property {number} location_lng
 * @property {string} location_address
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalDonations
 * @property {number} totalWeight
 * @property {number} totalVolunteers
 * @property {number} totalDonors
 * @property {number} pendingRequests
 * @property {number} completedDeliveries
 */

/**
 * @typedef {Object} UserStats
 * @property {number} totalDonatedWeight
 * @property {number} totalDonatedItems
 * @property {number} totalDeliveries
 * @property {number} totalReceivedItems
 */

/**
 * @typedef {Object} AnalyticsData
 * @property {Array<{name: string, value: number, color: string}>} foodTypeDistribution
 * @property {Array<{month: string, donations: number, weight: number}>} monthlyDonations
 * @property {Array<{name: string, value: number, color: string}>} userRoleDistribution
 */

export {};