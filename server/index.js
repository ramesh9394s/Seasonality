const express = require('express')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())

// Serve static files from the Vite build output
app.use(express.static(path.join(__dirname, '../dist')))

// Helper to determine the current season
function getCurrentSeason() {
  const month = new Date().getMonth()
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'
  return 'winter'
}

// API route: current season info
app.get('/api/season', (req, res) => {
  const season = getCurrentSeason()
  const messages = {
    spring: 'Spring is here! Fresh strawberries and asparagus are in season.',
    summer: 'Summer vibes! Enjoy tomatoes, corn, and watermelon.',
    autumn: 'Autumn harvest! Apples, pumpkins, and grapes are at their best.',
    winter: 'Winter warmth! Bright oranges and hearty kale brighten the table.',
  }
  res.json({ season, message: messages[season] })
})

// API route: all seasons
app.get('/api/seasons', (req, res) => {
  res.json({
    seasons: ['spring', 'summer', 'autumn', 'winter'],
    current: getCurrentSeason(),
  })
})

// Catch-all: serve the React app for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log('Seasonality server running on port ' + PORT)
})
