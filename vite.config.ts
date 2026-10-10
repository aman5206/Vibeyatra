import fs from 'node:fs'
import path from 'node:path'
import https from 'node:https'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function downloadFile(url: string, dest: string, force = false): Promise<boolean> {
  if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 10000 && fs.statSync(dest).size !== 1177802) {
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
    },
    {
      name: 'sync-sahastradhara-photos',
      async buildStart() {
        const sahastradharaDir = path.resolve(__dirname, 'public/assets/sahastradhara')
        if (!fs.existsSync(sahastradharaDir)) {
          fs.mkdirSync(sahastradharaDir, { recursive: true })
        }

        const sahastradharaPhotos = [
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/18_expanse_of_Narmada_in_Maheshwar_%2816673851680%29.jpg',
            fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/18_expanse_of_Narmada_in_Maheshwar_%2816673851680%29.jpg/1094px-18_expanse_of_Narmada_in_Maheshwar_%2816673851680%29.jpg',
            name: 'sahastradhara_aerial_landscape.jpg'
          },
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/View_of_Narmada_from_fort_of_maheshwar.jpg',
            fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/View_of_Narmada_from_fort_of_maheshwar.jpg/1920px-View_of_Narmada_from_fort_of_maheshwar.jpg',
            name: 'sahastradhara_river_streams.jpg'
          },
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/19_expanse_of_Narmada_in_Maheshwar2_%2816860201711%29.jpg',
            fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/19_expanse_of_Narmada_in_Maheshwar2_%2816860201711%29.jpg/1094px-19_expanse_of_Narmada_in_Maheshwar2_%2816860201711%29.jpg',
            name: 'sahastradhara_rocks_flowing_water.jpg'
          },
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Ek_Mukhi_Datta_Temple%2CSahastradhara%2CJalkoti%2CMaheshwar.jpg',
            fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Ek_Mukhi_Datta_Temple%2CSahastradhara%2CJalkoti%2CMaheshwar.jpg/800px-Ek_Mukhi_Datta_Temple%2CSahastradhara%2CJalkoti%2CMaheshwar.jpg',
            name: 'sahastradhara_temple_heritage.jpg'
          },
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/River_Narmada_from_Maheshwar_Fort.jpg',
            fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/River_Narmada_from_Maheshwar_Fort.jpg/1920px-River_Narmada_from_Maheshwar_Fort.jpg',
            name: 'sahastradhara_river_bank_scenic.jpg',
            altName: 'sahastradhara_riverbank_scenic.jpg'
          },
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Lit_by_twilight_%2C_Narmada.jpg',
            fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Lit_by_twilight_%2C_Narmada.jpg/1920px-Lit_by_twilight_%2C_Narmada.jpg',
            name: 'sahastradhara_golden_hour.jpg'
          }
        ]

        const defaultSeed = path.resolve(__dirname, 'public/assets/sahastradhara.jpg')

        for (const item of sahastradharaPhotos) {
          const dest = path.join(sahastradharaDir, item.name)
          const altDest = item.altName ? path.join(sahastradharaDir, item.altName) : null
          
          if (!fs.existsSync(dest) || fs.statSync(dest).size === 1177802 || fs.statSync(dest).size < 10000) {
            let ok = await downloadFile(item.url, dest, true)
            if (!ok && item.fallbackUrl) {
              ok = await downloadFile(item.fallbackUrl, dest, true)
            }
            if (!ok && (!fs.existsSync(dest) || fs.statSync(dest).size < 1000)) {
              if (fs.existsSync(defaultSeed)) {
                fs.copyFileSync(defaultSeed, dest)
              }
            }
          }
          if (altDest) {
            if (fs.existsSync(dest) && fs.statSync(dest).size > 10000) {
              fs.copyFileSync(dest, altDest)
            } else if (!fs.existsSync(altDest) && fs.existsSync(defaultSeed)) {
              fs.copyFileSync(defaultSeed, altDest)
            }
          }
        }
      }
    }
  ],
})
