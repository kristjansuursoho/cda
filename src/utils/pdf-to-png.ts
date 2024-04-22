import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc =
  '../../node_modules/pdfjs-dist/build/pdf.worker.mjs'

import {
  convertDataUrlToFile,
  convertFiletoDataUrl,
  isNil,
  promiseMapAll,
} from './helpers'

export async function convertPdfPageToImage(
  pdf: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  fileName: string
) {
  const page = await pdf.getPage(pageNumber)

  const viewport = page.getViewport({ scale: 1 })
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (isNil(ctx)) {
    alert('Something went wrong. Reseting')
    throw new Error('CANT CONVERT PAGE TO IMAGE')
  }

  const renderContext = { canvasContext: ctx, viewport: viewport }

  canvas.height = viewport.height
  canvas.width = viewport.width

  await page.render(renderContext).promise

  const dataUrl = canvas.toDataURL()

  const result = await convertDataUrlToFile(
    dataUrl,
    `${fileName}-${pageNumber}.png`
  )

  return result
}

export async function convertPdfToPNG(file: File) {
  if (file.type !== 'application/pdf') return file

  const worker = new pdfjsLib.PDFWorker()
  const fileUrl = await convertFiletoDataUrl(file)
  const pdf = await pdfjsLib.getDocument({ url: fileUrl, worker }).promise
  const listOfPageNum = [...Array(pdf.numPages).keys()].map((i) => i + 1)

  return await promiseMapAll(listOfPageNum, async (pageNum) => {
    return convertPdfPageToImage(pdf, pageNum, file.name)
  })
}
