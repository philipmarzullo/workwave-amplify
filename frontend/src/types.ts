export type Track = 'joint' | 'pestpac' | 'realgreen' | 'winteam'

export type SessionType = 'thought-leadership' | 'innovation' | 'how-to'

export type Day = 'sat' | 'sun' | 'mon' | 'tue'

export type Role = 'owner' | 'admin' | 'tech'

export type Product = 'pestpac' | 'realgreen' | 'winteam'

export type Interest =
  | 'wavelytics'
  | 'ai'
  | 'integrations'
  | 'security'
  | 'ui-modernization'
  | 'routing'
  | 'marketing'
  | 'mobile'
  | 'leadership'
  | 'job-costing'

export interface Session {
  id: number
  title: string
  description: string
  track: Track
  type: SessionType
  day: Day
  time: string
  speaker: string
  interests: Interest[]
  roles: Role[]
  products: Product[]
  customerLed: boolean
  bootCamp: boolean
}

export interface TrackConfig {
  id: Track
  label: string
  color: string
  bgClass: string
  textClass: string
  borderClass: string
}

export interface PersonaSelection {
  role: Role | null
  product: Product | null
  interests: Interest[]
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
