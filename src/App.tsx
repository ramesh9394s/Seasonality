import { useState, useEffect } from 'react'
import './App.css'

type Season = 'spring' | 'summer' | 'autumn' | 'winter'

interface SeasonalItem {
  name: string
  emoji: string
  description: string
}

interface SeasonData {
  label: string
  emoji: string
  color: string
  items: SeasonalItem[]
}

const seasonData: Record<Season, SeasonData> = {
  spring: {
    label: 'Spring',
    emoji: '🌸',
    color: '#f9c6d0',
    items: [
      { name: 'Strawberries', emoji: '🍓', description: 'Sweet and juicy, peak season in spring.' },
      { name: 'Asparagus', emoji: '🌿', description: 'Tender stalks freshly harvested in spring.' },
      { name: 'Peas', emoji: '🫛', description: 'Sweet green peas, best eaten fresh.' },
    ],
  },
  summer: {
    label: 'Summer',
    emoji: '☀️',
    color: '#ffe08a',
    items: [
      { name: 'Tomatoes', emoji: '🍅', description: 'Sun-ripened tomatoes bursting with flavour.' },
      { name: 'Corn', emoji: '🌽', description: 'Sweet corn at its peak during summer.' },
      { name: 'Watermelon', emoji: '🍉', description: 'Refreshingly cool and hydrating.' },
    ],
  },
  autumn: {
    label: 'Autumn',
    emoji: '🍂',
    color: '#f4a261',
    items: [
      { name: 'Apples', emoji: '🍎', description: 'Crisp apples freshly picked in autumn.' },
      { name: 'Pumpkin', emoji: '🎃', description: 'Hearty pumpkins perfect for soups and pies.' },
      { name: 'Grapes', emoji: '🍇', description: 'Harvest-time grapes, rich in flavour.' },
    ],
  },
  winter: {
    label: 'Winter',
    emoji: '❄️',
    color: '#a8d8ea',
    items: [
      { name: 'Oranges', emoji: '🍊', description: 'Bright citrus to lift winter spirits.' },
      { name: 'Kale', emoji: '🥬', description: 'Hardy greens that thrive in cold weather.' },
      { name: 'Parsnips', emoji: '🥕', description: 'Sweet root vegetables perfect for roasting.' },
    ],
  },
}

function getCurrentSeason(): Season {
  const month = new Date().getMonth()
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'
  return 'winter'
}

function App() {
  const [activeSeason, setActiveSeason] = useState<Season>(getCurrentSeason())
  const [apiMessage, setApiMessage] = useState<string>('')

  useEffect(() => {
    fetch('/api/season')
      .then((r) => r.json())
      .then((data) => setApiMessage(data.message ?? ''))
      .catch(() => setApiMessage(''))
  }, [])

  const season = seasonData[activeSeason]

  return (
    <div className="app" style={{ '--season-color': season.color } as React.CSSProperties}>
      <header className="app-header">
        <h1>Seasonality {season.emoji}</h1>
        <p className="tagline">Discover what is fresh and in season near you.</p>
        {apiMessage && <p className="api-message">{apiMessage}</p>}
      </header>

      <nav className="season-nav">
        {(Object.keys(seasonData) as Season[]).map((s) => (
          <button
            key={s}
            className={"season-btn " + (s === activeSeason ? 'active' : '')}
            onClick={() => setActiveSeason(s)}
          >
            {seasonData[s].emoji} {seasonData[s].label}
          </button>
        ))}
      </nav>

      <main className="season-main">
        <h2>{season.emoji} {season.label} Produce</h2>
        <ul className="item-list">
          {season.items.map((item) => (
            <li key={item.name} className="item-card">
              <span className="item-emoji">{item.emoji}</span>
              <div>
                <strong>{item.name}</strong>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export default App
