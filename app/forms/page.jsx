
import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

const Icons = {
  Document: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  CheckSquare: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"></polyline>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  )
}

const FormsPage = async () => {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Fetch all forms (public access allowed by RLS)
  const { data: forms, error } = await supabase
    .from('forms')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#FDFBF9] p-4 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-serif font-bold text-[#3F2E23]">Available Forms</h1>
          <p className="text-[#8C6B55] max-w-2xl mx-auto">Select a form to fill out or take a quiz</p>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {forms?.map((form) => (
                <div key={form.id} className="bg-white rounded-xl shadow-sm border border-stone-100 p-8 flex flex-col h-full hover:shadow-md transition-shadow group">
                    <div className="mb-6">
                        <div className="mb-4">
                             {form.is_quiz ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF8F3] text-[#EE7D22] border border-[#FCDCC3] uppercase tracking-wider">
                                    <Icons.CheckSquare />
                                    Quiz
                                </span>
                             ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF8F3] text-[#EE7D22] border border-[#FCDCC3] uppercase tracking-wider">
                                    <Icons.Document />
                                    Form
                                </span>
                             )}
                        </div>

                        <h3 className="text-2xl font-serif font-bold text-stone-800 mb-3 group-hover:text-[#EE7D22] transition-colors">{form.title}</h3>
                        <p className="text-stone-500 text-sm leading-relaxed line-clamp-3">
                            {form.description || "No description provided."}
                        </p>
                    </div>

                    <div className="mt-auto pt-6 flex items-center justify-between">
                         <span className="text-xs font-medium text-stone-400">
                            {form.questions?.length || 0} questions
                         </span>
                         
                         <Link href={`/forms/${form.id}`}>
                            <button className="inline-flex items-center gap-2 bg-[#EE7D22] hover:bg-[#d66e1d] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                                {form.is_quiz ? 'Take Quiz' : 'Fill Form'}
                                <Icons.ArrowRight />
                            </button>
                         </Link>
                    </div>
                </div>
            ))}
            
            {(!forms || forms.length === 0) && (
                <div className="col-span-full py-16 text-center">
                    <p className="text-stone-400 text-lg">No forms are currently available.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default FormsPage