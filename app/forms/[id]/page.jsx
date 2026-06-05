
import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import FormView from '../../../components/FormView'

const FormPage = async (props) => {
  const params = await props.params;
  const { id } = params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: form, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !form) {
    notFound()
  }

  return <FormView form={form} />
}

export default FormPage
