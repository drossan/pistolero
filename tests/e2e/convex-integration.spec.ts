import { test, expect } from '@playwright/test'

test.describe('Convex Integration - Multiplayer Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/')

    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear())
  })

  test('should login and create room successfully', async ({ page }) => {
    // Navigate to multiplayer
    await page.click('text=MULTIJUGADOR')

    // Click create room button
    await page.click('text=CREAR SALA')

    // Login modal should appear
    await expect(page.locator('text=IDENTIFÍCATE')).toBeVisible()
    await expect(page.locator('text=Elige un nombre de vaquero para el duelo')).toBeVisible()

    // Fill username
    await page.fill('input[placeholder="Sheriff"]', 'TestPlayer1')

    // Click begin
    await page.click('text=COMENZAR')

    // Login modal should close
    await expect(page.locator('text=IDENTIFÍCATE')).not.toBeVisible()

    // Should show difficulty selection
    await expect(page.locator('text=DIFICULTAD')).toBeVisible()

    // Select Easy difficulty
    await page.click('button:has-text("EASY")')

    // Create room
    await page.click('text=CREAR')

    // Should show waiting room with room code
    await expect(page.locator('text=SALA CREADA')).toBeVisible()
    await expect(page.locator('text=Comparte este código con tu oponente')).toBeVisible()

    // Room code should be 5 characters
    const roomCodeElement = page.locator('text=/^[A-Z0-9]{5}$/')
    await expect(roomCodeElement).toBeVisible()
  })

  test('should join existing room with code', async ({ page, context }) => {
    // Create two browser contexts for two players
    const context1 = context
    const context2 = await context.browser()?.newContext()

    if (!context2) {
      throw new Error('Could not create second context')
    }

    const page1 = page
    const page2 = await context2.newPage()

    // Player 1: Create room
    await page1.goto('/multijugador')
    await page1.click('text=CREAR SALA')
    await page1.fill('input[placeholder="Sheriff"]', 'SheriffPlayer')
    await page1.click('text=COMENZAR')
    await page1.click('button:has-text("NORMAL")')
    await page1.click('text=CREAR')

    // Get room code
    const roomCode = await page1.locator('text=/^[A-Z0-9]{5}$/').textContent()
    expect(roomCode).toBeTruthy()

    // Player 2: Join room
    await page2.goto('/multijugador')
    await page2.click('text=UNIRSE A SALA')

    // Login first
    await page2.fill('input[placeholder="Sheriff"]', 'OutlawPlayer')
    await page2.click('text=COMENZAR')

    // Fill room code
    await page2.fill('input[placeholder="XXXXX"]', roomCode || '')
    await page2.click('text=UNIRSE')

    // Player 2 should be in waiting room
    await expect(page2.locator('text=SALA DE ESPERA')).toBeVisible()

    // Both players should see each other
    await expect(page1.locator('text=SheriffPlayer')).toBeVisible()
    await expect(page1.locator('text=OutlawPlayer')).toBeVisible()
    await expect(page2.locator('text=SheriffPlayer')).toBeVisible()
    await expect(page2.locator('text=OutlawPlayer')).toBeVisible()

    await context2.close()
  })

  test('should handle room creation error with invalid username', async ({ page }) => {
    await page.goto('/multijugador')
    await page.click('text=CREAR SALA')

    // Fill with short username
    await page.fill('input[placeholder="Sheriff"]', 'AB')

    // Click begin
    await page.click('text=COMENZAR')

    // Should show alert (we can't test alert content easily in Playwright)
    // But the modal should still be visible
    await expect(page.locator('text=IDENTIFÍCATE')).toBeVisible()
  })

  test('should handle player ready state', async ({ page, context }) => {
    // Create two browser contexts
    const context2 = await context.browser()?.newContext()

    if (!context2) {
      throw new Error('Could not create second context')
    }

    const page1 = page
    const page2 = await context2.newPage()

    // Player 1: Create room
    await page1.goto('/multijugador')
    await page1.click('text=CREAR SALA')
    await page1.fill('input[placeholder="Sheriff"]', 'PlayerOne')
    await page1.click('text=COMENZAR')
    await page1.click('button:has-text("HARD")')
    await page1.click('text=CREAR')

    // Get room code
    const roomCode = await page1.locator('text=/^[A-Z0-9]{5}$/').textContent()

    // Player 2: Join room
    await page2.goto('/multijugador')
    await page2.click('text=UNIRSE A SALA')
    await page2.fill('input[placeholder="Sheriff"]', 'PlayerTwo')
    await page2.click('text=COMENZAR')
    await page2.fill('input[placeholder="XXXXX"]', roomCode || '')
    await page2.click('text=UNIRSE')

    // Both players click ready
    await page1.click('text=LISTO')
    await page2.click('text=LISTO')

    // Both players should see countdown or game starting
    // This might take a moment, so we wait
    await page1.waitForTimeout(2000)
    await page2.waitForTimeout(2000)

    // Check if game phase changed (countdown or choose)
    const countdownVisible1 = await page1.locator('text=/¡LISTO!|¡APUNTA!|¡FUEGO!/').count() > 0
    const countdownVisible2 = await page2.locator('text=/¡LISTO!|¡APUNTA!|¡FUEGO!/').count() > 0

    // At least one of them should be in game phase
    expect(countdownVisible1 || countdownVisible2).toBe(true)

    await context2.close()
  })

  test('should handle leaving room', async ({ page }) => {
    await page.goto('/multijugador')

    // Create room
    await page.click('text=CREAR SALA')
    await page.fill('input[placeholder="Sheriff"]', 'LeaveTest')
    await page.click('text=COMENZAR')
    await page.click('button:has-text("EASY")')
    await page.click('text=CREAR')

    // Leave room button should be present
    await expect(page.locator('text=SALIR DE LA SALA')).toBeVisible()

    // Click leave
    await page.click('text=SALIR DE LA SALA')

    // Should return to menu
    await expect(page.locator('text=CREAR SALA')).toBeVisible()
    await expect(page.locator('text=UNIRSE A SALA')).toBeVisible()
  })
})

test.describe('Convex Real-time Sync', () => {
  test('should update participant list in real-time', async ({ page, context }) => {
    const context2 = await context.browser()?.newContext()

    if (!context2) {
      throw new Error('Could not create second context')
    }

    const page1 = page
    const page2 = await context2.newPage()

    // Player 1 creates room
    await page1.goto('/multijugador')
    await page1.click('text=CREAR SALA')
    await page1.fill('input[placeholder="Sheriff"]', 'SyncTest1')
    await page1.click('text=COMENZAR')
    await page1.click('button:has-text("NORMAL")')
    await page1.click('text=CREAR')

    // Get room code
    const roomCode = await page1.locator('text=/^[A-Z0-9]{5}$/').textContent()

    // Player 2 joins
    await page2.goto('/multijugador')
    await page2.click('text=UNIRSE A SALA')
    await page2.fill('input[placeholder="Sheriff"]', 'SyncTest2')
    await page2.click('text=COMENZAR')
    await page2.fill('input[placeholder="XXXXX"]', roomCode || '')
    await page2.click('text=UNIRSE')

    // Player 1 should see Player 2 appear (real-time sync)
    await expect(page1.locator('text=SyncTest2')).toBeVisible({ timeout: 3000 })

    await context2.close()
  })
})
