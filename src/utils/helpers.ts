// AUTHOR: KRISTJAN SUURSOHO

export function nullToUndefined<T extends {}>(
  value: T | null | undefined
): T | undefined {
  return value === null ? undefined : value
}

export function undefinedToNull<T extends {}>(
  value: T | undefined | null
): T | null {
  return value === undefined ? null : value
}

export function isNil<T extends {}>(
  value: T | null | undefined
): value is null | undefined {
  return value === null || value === undefined
}

export function isString<T extends {}>(
  value: T | null | undefined | string
): value is string {
  return notNil(value) && typeof value === 'string'
}

export function isInt<T extends {}>(
  value: T | null | undefined | number
): value is number {
  return notNil(value) && typeof value === 'number'
}

export function notNil<T extends {}>(value: T | null | undefined): value is T {
  return !isNil(value)
}

export function isArray<T extends {}>(
  value: T | null | undefined | unknown[]
): value is T {
  return notNil(value) && Array.isArray(value)
}

export async function promiseMapAll<T, R>(
  targets: T[],
  callback: (target: T) => Promise<R>
): Promise<R[]> {
  return Promise.all(targets.map(callback)).catch((error: any) => {
    console.log('@promiseMapAll - ERROR', error)
    return []
  })
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

export async function convertDataUrlToFile(dataUrl: string, filename: string) {
  return fetch(dataUrl)
    .then((res) => res.arrayBuffer())
    .then((buf) => new File([buf], filename, { type: 'image/png' }))
}

export function convertFiletoDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onerror = reject
    reader.onload = () => {
      if (isNil(reader.result)) return reject('CANT READ RESULT')
      resolve(reader.result.toString().normalize())
    }
  })
}
