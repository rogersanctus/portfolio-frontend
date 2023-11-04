export function unmaskedPhone(masked: string): string | null {
  if (!masked) {
    return null
  }

  return '+' + masked.replace(/\D/g, '')
}

export interface ApiErrors {
  [key: string]: string | string[] | ApiErrors
}

export interface Errors {
  [key: string]: string | Errors
}

export interface SimplifieldErrors {
  [key: string]: string
}

export function apiErrors(error: { errors: ApiErrors }): {
  errors: Errors
  simplifiedErrors: SimplifieldErrors
  paths: string[]
} {
  const paths: string[] = []
  const simplifiedErrors: SimplifieldErrors = {}

  function walk(
    error: string | string[] | ApiErrors,
    path?: string
  ): { error: string | Errors; path?: string } {
    if (typeof error === 'string') {
      if (path) {
        paths.push(path)
        simplifiedErrors[path] = error
      }
      return { error, path }
    }

    if (Array.isArray(error)) {
      const joinedError = error.join(', ')

      if (path) {
        paths.push(path)
        simplifiedErrors[path] = joinedError
      }
      return { error: joinedError, path }
    }

    if (typeof error === 'object') {
      const mappedError = Object.keys(error).reduce<Errors>((acc, key) => {
        const value = error[key]
        const { error: newError } = walk(value, path ? `${path}.${key}` : key)

        return {
          ...acc,
          [key]: newError
        }
      }, {} as Errors)

      return { error: mappedError, path }
    }

    return { error: {}, path }
  }

  if (!error || !('errors' in error)) {
    return { errors: {}, simplifiedErrors, paths: [] }
  }

  const { error: errors } = walk(error.errors)

  if (typeof errors === 'string') {
    return { errors: {}, simplifiedErrors, paths: [] }
  }

  return { errors, simplifiedErrors, paths }
}
