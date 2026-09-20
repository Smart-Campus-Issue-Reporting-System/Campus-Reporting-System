import 'dotenv/config'
import cors from 'cors'
import express from 'express'

const app = express()
const port = Number(process.env.PORT || 4000)

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'smart-campus-api', timestamp: new Date().toISOString() })
})

app.get('/api/meta', (_request, response) => {
  response.json({
    roles: ['Student', 'Admin', 'Maintenance'],
    complaintStatuses: ['Pending', 'Assigned', 'In progress', 'Resolved'],
    categories: ['Furniture', 'AC / Cooler', 'Electrical', 'Washroom', 'Cleanliness', 'Other'],
    persistence: 'PostgreSQL integration is prepared for the next backend section',
  })
})

app.post('/api/auth/login', (_request, response) => {
  response.status(501).json({ message: 'JWT login will be connected after the database schema is added.' })
})

app.post('/api/complaints', (_request, response) => {
  response.status(501).json({ message: 'Complaint persistence will be connected after the database schema is added.' })
})

app.use((_request, response) => {
  response.status(404).json({ message: 'Route not found' })
})

app.listen(port, () => {
  console.log(`Smart Campus API listening on http://localhost:${port}`)
})
