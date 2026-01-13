import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const usersFile = path.join(dataDir, 'users.json')
const notificationsFile = path.join(dataDir, 'notifications.json')

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

export function getUsers() {
  try {
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading users:', error)
  }
  return []
}

export function saveUsers(users) {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error saving users:', error)
  }
}

export function getNotifications() {
  try {
    if (fs.existsSync(notificationsFile)) {
      const data = fs.readFileSync(notificationsFile, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading notifications:', error)
  }
  return []
}

export function saveNotifications(notifications) {
  try {
    fs.writeFileSync(notificationsFile, JSON.stringify(notifications, null, 2))
  } catch (error) {
    console.error('Error saving notifications:', error)
  }
}