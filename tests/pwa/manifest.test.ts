import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

describe('PWA Manifest', () => {
  const manifestPath = resolve(__dirname, '../../public/manifest.json')
  let manifest: any

  beforeEach(() => {
    // Load manifest file
    if (existsSync(manifestPath)) {
      const manifestContent = readFileSync(manifestPath, 'utf-8')
      manifest = JSON.parse(manifestContent)
    }
  })

  it('should have manifest.json file in public folder', () => {
    expect(existsSync(manifestPath)).toBe(true)
  })

  it('should have all required fields', () => {
    expect(manifest).toBeDefined()
    expect(manifest.name).toBeDefined()
    expect(manifest.short_name).toBeDefined()
    expect(manifest.start_url).toBeDefined()
    expect(manifest.display).toBeDefined()
    expect(manifest.background_color).toBeDefined()
    expect(manifest.theme_color).toBeDefined()
    expect(manifest.icons).toBeDefined()
    expect(Array.isArray(manifest.icons)).toBe(true)
  })

  it('should have western theme name', () => {
    expect(manifest.name).toBe('Western Pistolero Game')
    expect(manifest.short_name).toBe('Pistolero')
  })

  it('should have western theme colors', () => {
    expect(manifest.background_color).toBe('#e8d5a3')
    expect(manifest.theme_color).toBe('#d4c5a0')
  })

  it('should start at root URL', () => {
    expect(manifest.start_url).toBe('/')
    expect(manifest.display).toBe('standalone')
  })

  it('should have icons defined', () => {
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2)

    // Check for required sizes
    const has192 = manifest.icons.some((icon: any) => icon.sizes === '192x192')
    const has512 = manifest.icons.some((icon: any) => icon.sizes === '512x512')

    expect(has192).toBe(true)
    expect(has512).toBe(true)

    // Check that all icons have src and type
    manifest.icons.forEach((icon: any) => {
      expect(icon.src).toBeDefined()
      expect(icon.type).toBeDefined()
      expect(icon.type).toMatch(/^image\/(png|jpg|jpeg|svg|webp)$/)
    })
  })

  it('should have proper description', () => {
    expect(manifest.description).toBeDefined()
    expect(manifest.description.length).toBeGreaterThan(0)
  })

  it('should have proper orientation', () => {
    expect(manifest.orientation).toBeDefined()
    expect(['portrait', 'landscape', 'any']).toContain(manifest.orientation)
  })
})
