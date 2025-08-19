'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get theme from localStorage on mount, safely
    try {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme') as Theme
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setTheme(savedTheme)
        }
      }
    } catch (error) {
      console.warn('Could not access localStorage for theme:', error)
    }
  }, [])

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      // Update document class when theme changes
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      // Save to localStorage safely
      try {
        localStorage.setItem('theme', theme)
      } catch (error) {
        console.warn('Could not save theme to localStorage:', error)
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
