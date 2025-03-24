// A simple encryption/decryption utility
// Note: This is not military-grade encryption but provides basic obfuscation
// for storing API keys in localStorage

// Create a simple encryption key based on domain and user agent
const getEncryptionKey = (): string => {
  const domain = typeof window !== "undefined" ? window.location.hostname : ""
  const browserInfo = typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 10) : ""
  return `${domain}-${browserInfo}-pdf-quiz-app`
}

// Simple XOR encryption
export function encrypt(text: string): string {
  const key = getEncryptionKey()
  let result = ""

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    result += String.fromCharCode(charCode)
  }

  // Convert to base64 for safe storage
  return btoa(result)
}

// Simple XOR decryption
export function decrypt(encryptedText: string): string {
  try {
    // Convert from base64
    const text = atob(encryptedText)
    const key = getEncryptionKey()
    let result = ""

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      result += String.fromCharCode(charCode)
    }

    return result
  } catch (error) {
    console.error("Decryption error:", error)
    return ""
  }
}

