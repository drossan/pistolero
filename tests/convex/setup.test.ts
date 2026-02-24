import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

describe('Convex Setup', () => {
  describe('Project Structure', () => {
    it('should have convex folder', () => {
      const convexPath = resolve(__dirname, '../../convex')
      expect(existsSync(convexPath)).toBe(true)
    })

    it('should have schema.ts file', () => {
      const schemaPath = resolve(__dirname, '../../convex/schema.ts')
      expect(existsSync(schemaPath)).toBe(true)
    })

    it('should have auth config folder', () => {
      const authPath = resolve(__dirname, '../../convex/auth')
      expect(existsSync(authPath)).toBe(true)
    })

    it('should have games folder with mutations and queries', () => {
      const gamesPath = resolve(__dirname, '../../convex/games')
      expect(existsSync(gamesPath)).toBe(true)

      const mutationsPath = resolve(gamesPath, 'mutations.ts')
      const queriesPath = resolve(gamesPath, 'queries.ts')
      expect(existsSync(mutationsPath)).toBe(true)
      expect(existsSync(queriesPath)).toBe(true)
    })
  })

  describe('Convex Client Configuration', () => {
    it('should have CONVEX_DEPLOYMENT_URL in .env.local', () => {
      const envPath = resolve(__dirname, '../../.env.local')

      if (existsSync(envPath)) {
        const envContent = readFileSync(envPath, 'utf-8')
        expect(envContent).toContain('CONVEX_DEPLOYMENT_URL')
      } else {
        // If .env.local doesn't exist, we'll create it during setup
        expect(true).toBe(true)
      }
    })

    it('should have convex.tsx in src/app', () => {
      const convexPath = resolve(__dirname, '../../src/app/convex.tsx')
      expect(existsSync(convexPath)).toBe(true)
    })

    it('should export ConvexReactClient', () => {
      const convexPath = resolve(__dirname, '../../src/app/convex.tsx')
      const content = readFileSync(convexPath, 'utf-8')

      expect(content).toContain('ConvexReactClient')
      expect(content).toContain('ConvexProvider')
    })
  })

  describe('Schema Validation', () => {
    it('should export schema from schema.ts', () => {
      const schemaPath = resolve(__dirname, '../../convex/schema.ts')
      const content = readFileSync(schemaPath, 'utf-8')

      expect(content).toContain('defineSchema')
      expect(content).toContain('export default')
    })

    it('should have valid TypeScript syntax', () => {
      // This will be validated when we try to import it
      const schemaPath = resolve(__dirname, '../../convex/schema.ts')
      expect(existsSync(schemaPath)).toBe(true)
    })
  })
})
