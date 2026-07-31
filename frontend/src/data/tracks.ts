import type { TrackConfig } from '../types'

export const tracks: TrackConfig[] = [
  {
    id: 'joint',
    label: 'Joint',
    color: '#8B3DFF',
    bgClass: 'bg-track-joint',
    textClass: 'text-track-joint',
    borderClass: 'border-track-joint',
  },
  {
    id: 'pestpac',
    label: 'PestPac',
    color: '#E8005E',
    bgClass: 'bg-track-pestpac',
    textClass: 'text-track-pestpac',
    borderClass: 'border-track-pestpac',
  },
  {
    id: 'realgreen',
    label: 'RealGreen',
    color: '#22c55e',
    bgClass: 'bg-track-realgreen',
    textClass: 'text-track-realgreen',
    borderClass: 'border-track-realgreen',
  },
  {
    id: 'winteam',
    label: 'WinTeam',
    color: '#264BEE',
    bgClass: 'bg-track-winteam',
    textClass: 'text-track-winteam',
    borderClass: 'border-track-winteam',
  },
]

export function getTrack(id: string): TrackConfig {
  return tracks.find(t => t.id === id) ?? tracks[0]
}
