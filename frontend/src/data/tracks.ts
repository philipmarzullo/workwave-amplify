import type { TrackConfig } from '../types'

export const tracks: TrackConfig[] = [
  {
    id: 'joint',
    label: 'Joint',
    color: '#8b5cf6',
    bgClass: 'bg-track-joint',
    textClass: 'text-track-joint',
    borderClass: 'border-track-joint',
  },
  {
    id: 'pestpac',
    label: 'PestPac',
    color: '#ef4444',
    bgClass: 'bg-track-pestpac',
    textClass: 'text-track-pestpac',
    borderClass: 'border-track-pestpac',
  },
  {
    id: 'realgreen',
    label: 'Real Green',
    color: '#22c55e',
    bgClass: 'bg-track-realgreen',
    textClass: 'text-track-realgreen',
    borderClass: 'border-track-realgreen',
  },
  {
    id: 'winteam',
    label: 'WinTeam',
    color: '#3b82f6',
    bgClass: 'bg-track-winteam',
    textClass: 'text-track-winteam',
    borderClass: 'border-track-winteam',
  },
]

export function getTrack(id: string): TrackConfig {
  return tracks.find(t => t.id === id) ?? tracks[0]
}
