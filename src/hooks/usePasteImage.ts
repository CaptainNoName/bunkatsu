import { useEffect, useState } from 'react'

export const usePasteImage = () => {
  const [pastedImage, setPastedImage] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)

  useEffect(() => {
    function handlePaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items

      if (items) {
        const imageItem = Array.from(items).find(
          (item) => item.type.indexOf('image') !== -1,
        )

        if (imageItem) {
          const blob = imageItem.getAsFile()
          if (blob) {
            const reader = new FileReader()
            reader.onload = (event) => {
              const dataUrl = event.target?.result as string
              setPastedImage(dataUrl)
              const base64 = dataUrl.split(',')[1]
              setImageBase64(base64)
            }
            reader.readAsDataURL(blob)
          }
        }
      }
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [])

  const clearImage = () => {
    setPastedImage(null)
    setImageBase64(null)
  }

  return {
    pastedImage,
    imageBase64,
    clearImage,
  }
}
