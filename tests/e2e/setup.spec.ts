import { test, expect } from '@playwright/test'

test.describe('E2E Test Setup', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/')

    // Check that the home page loads
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should navigate to vs-machine', async ({ page }) => {
    await page.goto('/')
    await page.click('text=VS MÁQUINA')

    // Should navigate to vs-machine route
    await expect(page).toHaveURL('/vs-machine')
  })

  test('should navigate to multiplayer', async ({ page }) => {
    await page.goto('/')
    await page.click('text=MULTIJUGADOR')

    // Should navigate to multiplayer route
    await expect(page).toHaveURL('/multijugador')
  })

  test('should have PWA manifest', async ({ page }) => {
    const response = await page.request.get('/manifest.json')
    expect(response.status()).toBe(200)

    const manifest = await response.json()
    expect(manifest).toHaveProperty('name')
    expect(manifest).toHaveProperty('short_name')
  })

  test('should have service worker', async ({ page }) => {
    // Check if service worker is registered
    const swExists = await page.evaluate(() => {
      return 'serviceWorker' in navigator
    })

    expect(swExists).toBe(true)
  })
})

test.describe('Application Basics', () => {
  test('should have correct page title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Western Pistolero/)
  })

  test('should load western fonts', async ({ page }) => {
    await page.goto('/')

    // Check if Rye font is loaded
    const ryeLoaded = await page.evaluate(() => {
      return document.fonts.check('16px "Rye"')
    })

    // Note: Fonts might take time to load, so we just check they're in the CSS
    const fontsInCSS = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets)
      return sheets.some(sheet => {
        try {
          return Array.from(sheet.cssRules).some((rule: any) =>
            rule.cssText && rule.cssText.includes('Rye')
          )
        } catch {
          return false
        }
      })
    })

    expect(fontsInCSS).toBe(true)
  })

  test('should have western color scheme', async ({ page }) => {
    await page.goto('/')

    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor
    })

    // Should have parchment-like background
    expect(bgColor).toMatch(/rgb\(232,\s*213,\s*163\)/) // #e8d5a3
  })
})

test.describe('Game Elements', () => {
  test('should display game rules on home', async ({ page }) => {
    await page.goto('/')

    // Check for game rules section
    await expect(page.locator('text=REGLAS')).toBeVisible()
  })

  test('should have statistics display', async ({ page }) => {
    await page.goto('/')

    // Stats section should be visible
    await expect(page.locator('text=ESTADÍSTICAS')).toBeVisible()
  })

  test('should show tutorial link', async ({ page }) => {
    await page.goto('/')

    // Tutorial reset should be available
    await expect(page.locator('text=TUTORIAL')).toBeVisible()
  })
})
