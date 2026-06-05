
import React from 'react'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import CopyButton from '@/components/CopyButton'

const Icons = {
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Preview: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  BarChart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"></line>
      <line x1="18" y1="20" x2="18" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
  ),
  Link: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  ),
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
  )
}

const AllFormsPage = async () => {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()

    let forms = []
    
    if (user) {
        const { data, error } = await supabase
            .from('forms')
            .select('*')
            .order('created_at', { ascending: false })
            
        if (!error && data) {
            forms = data
        }
    }

  return (
    <div className="min-h-screen bg-[#FDFBF9] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#3F2E23]">All Forms</h1>
            <p className="text-[#8C6B55] mt-1">Manage your forms and view responses</p>
          </div>
          <Link href="/forms/new">
            <button className="flex items-center justify-center gap-2 bg-[#EE7D22] hover:bg-[#d66e1d] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm w-full md:w-auto">
                <Icons.Plus />
                Create Form
            </button>
          </Link>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
                <div key={form.id} className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-2">
                             {form.is_quiz ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FFF8F3] text-[#EE7D22] border border-[#FCDCC3]">
                                    <Icons.CheckSquare />
                                    Quiz
                                </span>
                             ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FFF8F3] text-[#EE7D22] border border-[#FCDCC3]">
                                    <Icons.Document />
                                    Form
                                </span>
                             )}
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#EE7D22] text-white">
                                Published
                            </span>
                        </div>
                    </div>

                    <div className="mb-6 grow">
                        <h3 className="text-xl font-serif font-bold text-stone-800 mb-2 line-clamp-1">{form.title}</h3>
                        <p className="text-stone-500 text-sm line-clamp-2 mb-4">
                            {form.description || "No description provided."}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
                            <span>{form.questions?.length || 0} questions</span>
                            <span>0 responses</span> {/* Placeholder for now */}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-stone-100 mt-auto">
                        <Link href={`/forms/${form.id}`} className="flex-1">
                            <button className="w-full inline-flex justify-center items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 border border-stone-200 transition-colors">
                                <Icons.Preview />
                                Preview
                            </button>
                        </Link>
                        <Link href={`/admin/forms/${form.id}/responses`} className="flex-1">
                            <button className="w-full inline-flex justify-center items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 border border-stone-200 transition-colors">
                                <Icons.BarChart />
                                Responses
                            </button>
                        </Link>
                        <CopyButton formId={form.id} />
                    </div>
                </div>
            ))}
            
            {forms.length === 0 && (
                <div className="col-span-full py-12 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300">
                    <p className="text-stone-500 font-medium">You haven't created any forms yet.</p>
                    <Link href="/forms/new" className="text-[#EE7D22] hover:underline mt-2 inline-block">
                        Create your first form
                    </Link>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default AllFormsPage
