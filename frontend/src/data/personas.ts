import type { Role, Product, Interest } from '../types'

export const roles: { id: Role; label: string; description: string }[] = [
  { id: 'owner', label: 'Owner / Executive', description: 'Business strategy, growth, and P&L' },
  { id: 'admin', label: 'Office / Admin', description: 'Operations, scheduling, and back-office' },
  { id: 'tech', label: 'Technician / Field', description: 'Service delivery and field operations' },
]

export const products: { id: Product; label: string; description: string }[] = [
  { id: 'pestpac', label: 'PestPac', description: 'Pest control management' },
  { id: 'realgreen', label: 'RealGreen', description: 'Lawn & landscape management' },
  { id: 'winteam', label: 'WinTeam', description: 'Janitorial & security management' },
]

export const interests: { id: Interest; label: string }[] = [
  { id: 'wavelytics', label: 'Wavelytics & Analytics' },
  { id: 'ai', label: 'AI & Automation' },
  { id: 'integrations', label: 'Integrations & APIs' },
  { id: 'security', label: 'Data Security' },
  { id: 'ui-modernization', label: 'UI Modernization' },
  { id: 'routing', label: 'Routing & Scheduling' },
  { id: 'marketing', label: 'Marketing Tools' },
  { id: 'mobile', label: 'Mobile & Field Tech' },
  { id: 'leadership', label: 'Leadership & Coaching' },
  { id: 'job-costing', label: 'Job Costing & Financials' },
]
