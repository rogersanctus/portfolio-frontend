import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent
} from 'react'
import { Controller, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'

import { Callout, type CalloutType } from './Callout.tsx'
import {
  apiErrors,
  unmaskedPhone,
  type SimplifieldErrors
} from '@src/lib/helper.ts'

interface ContactFormData {
  contact: {
    first_name: string
    last_name: string
    email: string
    cellphone: string
  }
  message: string
}

function initialContactForm(): ContactFormData {
  return {
    contact: {
      first_name: '',
      last_name: '',
      email: '',
      cellphone: ''
    },
    message: ''
  }
}

type OnChangeCallback = (event: ChangeEvent) => void

export function ContactForm() {
  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormData>({ defaultValues: initialContactForm() })

  const validationByTrigger = useRef(false)
  const apiErrorsMap = useRef<SimplifieldErrors>({})
  const isFormSubmitting = useRef(false)

  const [callout, setCallout] = useState<{
    type: CalloutType
    message: string
  } | null>(null)

  function onChangeInput(fieldName: string, onChange?: OnChangeCallback) {
    function preOnChange() {
      const copy = { ...apiErrorsMap.current }

      // Clear callout error if it was an api error
      if (fieldName in copy) {
        setCallout(null)
      }

      // Deletes the error and reassign the error map
      delete copy[fieldName]

      apiErrorsMap.current = copy
      trigger(fieldName as keyof ContactFormData)
    }

    if (onChange && typeof onChange === 'function') {
      return (event: ChangeEvent<HTMLInputElement>) => {
        preOnChange()
        return onChange(event)
      }
    }

    return () => {
      preOnChange()
    }
  }

  async function myHandleSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      isFormSubmitting.current = true
      const handler = handleSubmit(onSubmit)
      return await handler(e)
    } finally {
      isFormSubmitting.current = false
    }
  }

  async function onSubmit(data: ContactFormData) {
    try {
      const maskedPhone = data.contact.cellphone
      const cellphone = unmaskedPhone(data.contact.cellphone)

      setCallout(null)

      if (cellphone) {
        data.contact.cellphone = cellphone
      }

      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: {},
        body: JSON.stringify(data),
        credentials: 'include'
      })

      if (resp.ok) {
        const queryData: Record<string, string> = {}

        queryData.full_name = `${data.contact.first_name} ${data.contact.last_name}`
        const email = data.contact.email?.trim()

        if (email) {
          queryData.email = email
        }

        if (maskedPhone) {
          queryData.cellphone = maskedPhone
        }

        const query = new URLSearchParams(queryData)

        window.location.assign('/contact/success?' + query.toString())
      } else if (resp.status === 401) {
        const error = await resp.json()

        if ('is_csrf_error' in error && error.is_csrf_error) {
          localStorage.setItem('form-data', JSON.stringify(data))
          window.location.reload()
        }
      } else if (resp.status === 422) {
        const error = await resp.json()

        const { simplifiedErrors, paths } = apiErrors(error)
        apiErrorsMap.current = simplifiedErrors

        for (const path of paths) {
          trigger(path as keyof ContactFormData)
        }

        setCallout({
          message: 'Servidor: erro de validação de um ou mais campos',
          type: 'error'
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  function validateField(fieldName: string): string | false {
    const error = apiErrorsMap.current[fieldName]

    if (error && typeof error === 'string') {
      return error
    }

    return false
  }

  function validateEmail(
    fieldName: string,
    email: string,
    formValues: ContactFormData
  ): boolean | string {
    // This check is to avoid infinite recursion by triggering the validation
    if (!isFormSubmitting.current && !validationByTrigger.current) {
      validationByTrigger.current = true
      trigger('contact.cellphone')
      validationByTrigger.current = false
    }

    const apiError = validateField(fieldName)

    if (apiError) {
      return apiError
    }

    // When is the e-mail valid?
    if (!!email || !!formValues.contact.cellphone) {
      return true
    }

    return 'Por favor, informe seu e-mail caso não deseje informar seu celular'
  }

  function validateCellphone(
    fieldName: string,
    cellphone: string,
    formValues: ContactFormData
  ): boolean | string {
    if (!isFormSubmitting.current && !validationByTrigger.current) {
      validationByTrigger.current = true
      trigger('contact.email')
      validationByTrigger.current = false
    }

    const apiError = validateField(fieldName)

    if (apiError) {
      return apiError
    }

    if (!!cellphone || !!formValues.contact.email) {
      return true
    }

    return 'Por favor, informe seu celular caso não deseje informar seu e-mail'
  }

  useEffect(() => {
    const storageFormData = localStorage.getItem('form-data')

    if (storageFormData) {
      const formData = JSON.parse(storageFormData)

      // Loads the formData from the localStorage
      reset(formData)

      localStorage.removeItem('form-data')

      setCallout({
        type: 'info',
        message:
          'Para sua segurança, seu formulário foi recarregado. Por favor, tente reenviá-lo agora.'
      })

      return () => {}
    }
  }, [reset])

  useEffect(() => {
    if (callout !== null) {
      requestAnimationFrame(() => {
        // Scroll to the page end
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'instant'
        })
      })
    }
  }, [callout])

  return (
    <>
      <form onSubmit={myHandleSubmit} className='flex flex-col'>
        <div className='flex flex-col gap-10'>
          <div className='flex flex-col md:flex-row gap-6'>
            <div className='flex flex-col w-full relative'>
              <label
                htmlFor='first_name'
                className='text-sm sm:text-base mb-2 text-gray-800'
              >
                Nome <span className='text-rose-500'>*</span>
              </label>
              <input
                type='text'
                placeholder='Seu primeiro nome'
                className={`text-sm sm:text-base border px-3 py-1 sm:px-4 sm:py-2 text-gray-500 outline-none focus:ring ${
                  errors.contact?.first_name
                    ? 'border-rose-300 focus:ring-rose-300'
                    : 'border-stone-400 focus:ring-sky-400 focus:border-sky-500'
                }`}
                {...register('contact.first_name', { required: true })}
              />
              {errors.contact?.first_name && (
                <div className='absolute top-full mt-1'>
                  <span className='text-rose-500'>Campo obrigatório</span>
                </div>
              )}
            </div>
            <div className='flex flex-col w-full relative'>
              <label
                htmlFor='last_name'
                className='text-sm sm:text-base mb-2 text-gray-800'
              >
                Sobrenome <span className='text-rose-500'>*</span>
              </label>
              <input
                type='text'
                placeholder='Seu sobrenome'
                className={`text-sm sm:text-base border px-3 py-1 sm:px-4 sm:py-2 text-gray-500 outline-none focus:ring ${
                  errors.contact?.last_name
                    ? 'border-rose-300 focus:ring-rose-300'
                    : 'border-stone-400 focus:ring-sky-400 focus:border-sky-500'
                }`}
                {...register('contact.last_name', { required: true })}
              />
              {errors.contact?.last_name && (
                <div className='absolute top-full mt-1'>
                  <span className='text-rose-500'>Campo obrigatório</span>
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-col relative'>
            <label
              htmlFor='email'
              className='text-sm sm:text-base mb-2 text-gray-800'
            >
              E-mail
            </label>
            <Controller
              control={control}
              name='contact.email'
              rules={{
                validate: (value, formValues) =>
                  validateEmail('contact.email', value, formValues)
              }}
              render={({ field: { onChange, ...rest } }) => (
                <input
                  type='text'
                  placeholder='Seu e-mail'
                  className={`text-sm sm:text-base border px-3 py-1 sm:px-4 sm:py-2 text-gray-500 outline-none focus:ring ${
                    errors.contact?.email
                      ? 'border-rose-300 focus:ring-rose-300'
                      : 'border-stone-400 focus:ring-sky-400 focus:border-sky-500'
                  }`}
                  {...rest}
                  onChange={onChangeInput('contact.email', onChange)}
                />
              )}
            />
            {errors.contact?.email && (
              <div className='absolute top-full mt-1'>
                <span className='text-rose-500'>
                  {errors.contact.email.message}
                </span>
              </div>
            )}
          </div>
          <div className='flex flex-col relative'>
            <label
              htmlFor='cellphone'
              className='text-sm sm:text-base mb-2 text-gray-800'
            >
              Celular/Whatsapp
            </label>
            <Controller
              control={control}
              name='contact.cellphone'
              rules={{
                validate: (value, formValues) =>
                  validateCellphone('contact.cellphone', value, formValues)
              }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <InputMask
                  mask='+55 (99) 99999-9999'
                  placeholder='Seu celular'
                  className={`text-sm sm:text-base border px-3 py-1 sm:px-4 sm:py-2 text-gray-500 outline-none focus:ring ${
                    errors.contact?.cellphone
                      ? 'border-rose-300 focus:ring-rose-300'
                      : 'border-stone-400 focus:ring-sky-400 focus:border-sky-500'
                  }`}
                  onBlur={onBlur}
                  onChange={onChangeInput('contact.cellphone', onChange)}
                  value={value}
                  ref={ref}
                />
              )}
            />
            {errors.contact?.cellphone && (
              <div className='absolute top-full mt-1'>
                <span className='text-rose-500'>
                  {errors.contact.cellphone.message}
                </span>
              </div>
            )}
          </div>
          <div className='flex flex-col relative'>
            <label
              htmlFor='message'
              className='text-sm sm:text-base mb-2 text-gray-800'
            >
              Mensagem <span className='text-rose-500'>*</span>
            </label>
            <textarea
              placeholder='Sua mensagem'
              rows={5}
              className={`text-sm sm:text-base border px-3 py-1 sm:px-4 sm:py-2 text-gray-500 outline-none focus:ring ${
                errors.message
                  ? 'border-rose-300 focus:ring-rose-300'
                  : 'border-stone-400 focus:ring-sky-400 focus:border-sky-500'
              }`}
              {...register('message', { required: true })}
            ></textarea>
            {errors.message && (
              <div className='absolute top-full mt-1'>
                <span className='text-rose-500'>Campo obrigatório</span>
              </div>
            )}
          </div>
          {callout !== null && (
            <Callout type={callout.type} message={callout.message} />
          )}
        </div>
        <button
          type='submit'
          className='rounded bg-lime-600 text-white mt-12 px-6 py-4 font-bold'
          disabled={isSubmitting}
        >
          Enviar
        </button>
      </form>
    </>
  )
}
