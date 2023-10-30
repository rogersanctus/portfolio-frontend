import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'

import { Callout } from './Callout.tsx'
import { unmaskedPhone } from '@src/lib/helper.ts'

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

export function ContactForm() {
  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormData>({ defaultValues: initialContactForm() })

  const emailValidatingByTrigger = useRef(false)
  const cellphoneValidatingByTrigger = useRef(false)

  const [callout, setCallout] = useState<{
    type: string
    message: string
  } | null>(null)

  async function onSubmit(data: ContactFormData) {
    try {
      const maskedPhone = data.contact.cellphone
      const cellphone = unmaskedPhone(data.contact.cellphone)

      console.log('maskedPhone', maskedPhone)
      console.log('cellphone', cellphone)

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
      }
    } catch (error) {
      console.error(error)
    }
  }

  function validateEmail(
    email: string,
    formValues: ContactFormData
  ): boolean | string {
    // This check is to avoid infinite recursion by triggering the validation
    if (!cellphoneValidatingByTrigger.current) {
      cellphoneValidatingByTrigger.current = true
      trigger('contact.cellphone')
    }

    emailValidatingByTrigger.current = false

    // When is the e-mail valid?
    if (!!email || !!formValues.contact.cellphone) {
      return true
    }

    return 'Por favor, informe seu e-mail caso não deseje informar seu celular'
  }

  function validateCellphone(
    cellphone: string,
    formValues: ContactFormData
  ): boolean | string {
    if (!emailValidatingByTrigger.current) {
      emailValidatingByTrigger.current = true
      trigger('contact.email')
    }

    cellphoneValidatingByTrigger.current = false

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
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
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
            <input
              type='email'
              placeholder='Seu e-mail'
              className={`text-sm sm:text-base border px-3 py-1 sm:px-4 sm:py-2 text-gray-500 outline-none focus:ring ${
                errors.contact?.email
                  ? 'border-rose-300 focus:ring-rose-300'
                  : 'border-stone-400 focus:ring-sky-400 focus:border-sky-500'
              }`}
              {...register('contact.email', {
                validate: validateEmail
              })}
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
                validate: validateCellphone
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
                  onChange={onChange}
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
            <Callout type='info' message={callout.message} />
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
