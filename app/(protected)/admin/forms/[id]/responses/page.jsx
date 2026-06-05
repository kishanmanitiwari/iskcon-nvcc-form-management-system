
import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import ExportButton from '../../../../../../components/ExportButton'

const Icons = {
  ArrowLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  ),
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  )
}

const ResponsesPage = async (props) => {
  const params = await props.params;
  const { id } = params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Fetch form details
  const { data: form, error: formError } = await supabase
    .from('forms')
    .select('*')
    .eq('id', id)
    .single()

  if (formError || !form) {
    notFound()
  }

  // Fetch responses
  const { data: responses, error: responsesError } = await supabase
    .from('responses')
    .select('*')
    .eq('form_id', id)
    .order('created_at', { ascending: false })

  const questions = form.questions || []
  const totalResponses = responses?.length || 0

  return (
    <div className="min-h-screen bg-[#FFF7EF] p-4 md:p-8 font-sans text-stone-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-4">
            <Link href="/admin/allforms" className="text-sm text-stone-500 hover:text-[#EE7D22] flex items-center gap-1 transition-colors">
                <Icons.ArrowLeft />
                Back to Forms
            </Link>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <h1 className="text-3xl font-serif font-bold text-[#3F2E23]">{form.title}</h1>
                   <p className="text-[#8C6B55] mt-1">{totalResponses} responses</p>
                </div>
                <ExportButton 
                    responses={responses} 
                    questions={questions} 
                    fileName={form.title} 
                />
            </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl border border-[#F2E6D8] p-6 max-w-sm">
            <p className="text-sm text-[#7A5A4A] font-serif">Total Responses</p>
            <h2 className="text-4xl font-bold text-[#2C211A] mt-2">{totalResponses}</h2>
        </div>

        {/* Responses Table */}
        <div className="bg-white rounded-xl shadow-sm border border-[#F2E6D8] overflow-hidden">
            <div className="p-6 border-b border-[#F2E6D8]">
                <h2 className="text-xl font-serif font-bold text-[#3F2E23]">All Responses</h2>
                <p className="text-[#8C6B55] text-sm">View individual submissions</p>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#FFF8F3] text-[#4A2E1F] font-serif font-medium border-b border-[#F2E6D8]">
                        <tr>
                            <th className="px-6 py-4 whitespace-nowrap">Submitted At</th>
                            {questions.map((q) => (
                                <th key={q.id} className="px-6 py-4 whitespace-nowrap min-w-[150px]">{q.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2E6D8]">
                        {responses?.map((response) => (
                            <tr key={response.id} className="hover:bg-[#FFF7EF]/50 transition-colors">
                                <td className="px-6 py-4 text-stone-500 whitespace-nowrap">
                                    {new Date(response.created_at).toLocaleString()}
                                </td>
                                {questions.map((q) => (
                                    <td key={q.id} className="px-6 py-4 text-stone-800">
                                        {response.answers[q.id]?.toString() || '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        
                        {totalResponses === 0 && (
                            <tr>
                                <td colSpan={questions.length + 1} className="px-6 py-12 text-center text-stone-400">
                                    No responses yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  )
}

export default ResponsesPage
