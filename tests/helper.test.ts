import { apiErrors, type ApiErrors } from '@src/lib/helper'
import { describe, it, expect } from 'vitest'

const validApiError = {
  errors: {
    a_field: {
      a_child_field: ['Oops from a_field.a_child_field', 'Another oops'],
      b_child_field: 'Oops from a_field.b_child_field'
    },
    b_field: ['Oops from b_field'],
    c_field: {
      a_child_field: ['Oops from c_field.a_child_field']
    }
  } as ApiErrors
}

describe('apiErrors', () => {
  it('should return valid paths for the errors', () => {
    const { paths } = apiErrors(validApiError)

    expect(paths).toEqual([
      'a_field.a_child_field',
      'a_field.b_child_field',
      'b_field',
      'c_field.a_child_field'
    ])
  })

  it('should return valid error map', () => {
    const { errors } = apiErrors(validApiError)

    expect(errors).toEqual({
      a_field: {
        a_child_field: 'Oops from a_field.a_child_field, Another oops',
        b_child_field: 'Oops from a_field.b_child_field'
      },
      b_field: 'Oops from b_field',
      c_field: {
        a_child_field: 'Oops from c_field.a_child_field'
      }
    })
  })

  it('should return valid simplified error map', () => {
    const { simplifiedErrors } = apiErrors(validApiError)

    expect(simplifiedErrors).toEqual({
      'a_field.a_child_field': 'Oops from a_field.a_child_field, Another oops',
      'a_field.b_child_field': 'Oops from a_field.b_child_field',
      b_field: 'Oops from b_field',
      'c_field.a_child_field': 'Oops from c_field.a_child_field'
    })
  })
})
