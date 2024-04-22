import { isNil } from './helpers'
import type { Box } from '../types'

const listOfRequiredKey: string[] = [
  'topLeftX',
  'topLeftY',

  'topRightX',
  'topRightY',

  'bottomRightX',
  'bottomRightY',

  'bottomLeftX',
  'bottomLeftY',
]

export function drawBoxOnImage(imageUrl: string, listOfBox: Box[]) {
  listOfBox = listOfBox.filter((box) => {
    return listOfRequiredKey.every(
      (key) => key in box && typeof box[key] === 'number'
    )
  })

  return new Promise<string>((resolve, reject) => {
    const image = new Image()

    image.onerror = reject
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject('CANT CREATE CANVAS CONTEXT')
        return
      }

      canvas.width = image.width
      canvas.height = image.height

      const ratioX = 1
      const ratioY = 1

      ctx.drawImage(image, 0, 0)

      for (const box of listOfBox) {
        ctx.beginPath()

        ctx.moveTo(box.topLeftX * ratioX, box.topLeftY * ratioY)
        ctx.lineTo(box.topRightX * ratioX, box.topRightY * ratioY)
        ctx.lineTo(box.bottomRightX * ratioX, box.bottomRightY * ratioY)
        ctx.lineTo(box.bottomLeftX * ratioX, box.bottomLeftY * ratioY)

        ctx.fillStyle = 'rgba(255, 255, 255, 1)'
        ctx.fill()
      }

      const dataUrl = canvas.toDataURL('image/png', 1)
      resolve(dataUrl)
    }

    image.src = imageUrl
  })
}

async function drawRetangleOnImage() {
  const image = new Image()
}
