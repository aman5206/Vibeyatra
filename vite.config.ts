import fs from 'node:fs'
import path from 'node:path'
import https from 'node:https'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function downloadFile(url: string, dest: string): Promise<boolean> {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 10000) {
    return Promise.resolve(true)
  }
  return new Promise((resolve) => {
    const options = {
      headers: {
        'User-Agent': 'VibeyatraWeb/1.0 (https://vibeyatra.local; travel-project@vibeyatra.local)'
      }
    }
    const makeReq = (targetUrl: string) => {
      https.get(targetUrl, options, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          makeReq(res.headers.location)
          return
        }
        if (res.statusCode !== 200) {
          console.warn(`[Vite Asset Sync] Download returned status ${res.statusCode} for ${targetUrl}`)
          resolve(false)
          return
        }
        const fileStream = fs.createWriteStream(dest)
        res.pipe(fileStream)
        fileStream.on('finish', () => {
          fileStream.close()
          resolve(true)
        })
      }).on('error', (err) => {
        console.warn(`[Vite Asset Sync] Download error for ${targetUrl}:`, err.message)
        resolve(false)
      })
    }
    makeReq(url)
  })
}

// Ensure base public/assets directories exist
try {
  const brainDir = 'C:/Users/amanm/.gemini/antigravity-ide/brain/7fd327e5-1ca7-41f8-9a73-c148938ede27'
  const publicAssets = path.resolve(__dirname, 'public/assets')
  const jaamDir = path.join(publicAssets, 'jaam-gate')

  if (!fs.existsSync(jaamDir)) {
    fs.mkdirSync(jaamDir, { recursive: true })
  }

  // Copy AI-generated illustrative images
  const aiHistoricSrc = path.join(brainDir, 'jaam_gate_historic_1791647319897.jpg')
  const aiHistoricDest = path.join(jaamDir, 'jaam_gate_ai_illustrative.jpg')
  if (fs.existsSync(aiHistoricSrc)) {
    fs.copyFileSync(aiHistoricSrc, aiHistoricDest)
  }

  // Copy scenic hero & destination default images
  const assetMap: Record<string, string> = {
    'vibeyatra_scenic_hero_1791647301126.jpg': 'scenic_hero.jpg',
    'jaam_gate_historic_1791647319897.jpg': 'jaam_gate.jpg',
    'maheshwar_ahilya_fort_1791647342115.jpg': 'maheshwar_fort.jpg',
    'sahastradhara_rapids_1791647368038.jpg': 'sahastradhara.jpg'
  }

  for (const [srcName, destName] of Object.entries(assetMap)) {
    const src = path.join(brainDir, srcName)
    const dest = path.join(publicAssets, destName)
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest)
    }
  }

  const oldRef = path.join(publicAssets, 'hero_reference.jpg')
  if (fs.existsSync(oldRef)) {
    fs.unlinkSync(oldRef)
  }
} catch {
  // Silent fallback
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'sync-jaam-gate-photos',
      async buildStart() {
        const jaamDir = path.resolve(__dirname, 'public/assets/jaam-gate')
        if (!fs.existsSync(jaamDir)) {
          fs.mkdirSync(jaamDir, { recursive: true })
        }

        const wikimediaPhotos = [
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Jaam_gate_at_its_best.jpg',
            fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Jaam_gate_at_its_best.jpg/1920px-Jaam_gate_at_its_best.jpg',
            name: 'jaam_gate_at_its_best.jpg'
          },
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Jamgate.jpg',
            fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Jamgate.jpg/1920px-Jamgate.jpg',
            name: 'jamgate.jpg'
          },
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Jam_gate_indore.jpg',
            fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Jam_gate_indore.jpg/1920px-Jam_gate_indore.jpg',
            name: 'jam_gate_indore.jpg'
          }
        ]

        for (const item of wikimediaPhotos) {
          const dest = path.join(jaamDir, item.name)
          if (!fs.existsSync(dest) || fs.statSync(dest).size < 10000) {
            const ok = await downloadFile(item.url, dest)
            if (!ok && item.fallbackUrl) {
              await downloadFile(item.fallbackUrl, dest)
            }
          }
        }
      }
    }
  ],
})
