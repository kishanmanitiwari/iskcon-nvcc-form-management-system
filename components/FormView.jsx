
"use client"
import React, { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const FormView = ({ form }) => {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [score, setScore] = useState(null)

  const questions = form.questions || []

  const handleInputChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
    // Clear error if exists
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    const newErrors = {}
    let hasErrors = false
    
    questions.forEach(q => {
      if (q.required) {
        const val = answers[q.id]
        if (!val || (typeof val === 'string' && !val.trim())) {
          newErrors[q.id] = 'This field is required'
          hasErrors = true
        }
      }
    })

    if (hasErrors) {
      setErrors(newErrors)
      const firstErrorId = Object.keys(newErrors)[0]
      const element = document.getElementById(`question-${firstErrorId}`)
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    // Submit to Supabase
    setLoading(true)
    try {
      const { error } = await supabase
        .from('responses')
        .insert({
          form_id: form.id,
          answers: answers
        })
        
      if (form.is_quiz) {
        let calculatedScore = 0
        questions.forEach(q => {
            if (q.type === 'multiple_choice' && q.correctAnswer === answers[q.id]) {
                calculatedScore++
            }
        })
        setScore(calculatedScore)
      }

      if (error) throw error

      toast.success('Form submitted successfully!')
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to submit form. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
        <div className="min-h-screen bg-[#FDFBF9] py-8 md:py-12 px-4 font-sans text-stone-800 flex items-center justify-center">
             <div className="max-w-md w-full bg-white rounded-xl shadow-sm border-t-8 border-[#EE7D22] p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#2C211A]">Thank You!</h2>
                <p className="text-stone-600">Your response has been recorded.</p>
                {score !== null && (
                    <div className="bg-orange-50 rounded-lg p-4 mt-4 border border-orange-100">
                        <p className="text-sm text-stone-600 uppercase tracking-wide font-semibold">Your Score</p>
                        <p className="text-3xl font-bold text-[#EE7D22] mt-1">{score} / {questions.filter(q => q.type === 'multiple_choice').length}</p>
                    </div>
                )}
                <button 
                  onClick={() => window.location.reload()}
                  className="text-[#EE7D22] hover:underline text-sm font-medium mt-4 block"
                >
                  Submit another response
                </button>
             </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9] py-8 md:py-12 px-4 font-sans text-stone-800">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Form Header */}
        <div className="bg-white rounded-xl shadow-sm border-t-8 border-[#EE7D22] p-6 md:p-8">
            <h1 className="text-3xl font-serif font-bold text-[#2C211A] mb-3">{form.title}</h1>
            {form.description && (
                <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">{form.description}</p>
            )}
        </div>

        {/* Questions */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {questions.map((question, index) => (
                <div 
                    key={question.id} 
                    id={`question-${question.id}`}
                    className={`bg-white rounded-xl shadow-sm border p-6 md:p-8 transition-colors ${errors[question.id] ? 'border-red-300 ring-1 ring-red-100' : 'border-stone-100'}`}
                >
                    <div className="mb-4">
                        <label className="block text-lg font-medium text-stone-800 mb-1">
                            <span className="text-stone-400 mr-2 text-base">{index + 1}.</span>
                            {question.label}
                            {question.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                    </div>

                    <div className="space-y-2">
                        {question.type === 'text' && (
                            <input 
                                type="text"
                                className={`w-full px-0 py-2 bg-transparent border-b-2 focus:outline-none transition-colors placeholder:text-stone-300 ${errors[question.id] ? 'border-red-300 focus:border-red-500' : 'border-stone-200 focus:border-[#EE7D22]'}`}
                                placeholder="Your answer..."
                                value={answers[question.id] || ''}
                                onChange={(e) => handleInputChange(question.id, e.target.value)}
                            />
                        )}

                        {question.type === 'number' && (
                           <input 
                                type="number"
                                className={`w-full px-0 py-2 bg-transparent border-b-2 focus:outline-none transition-colors placeholder:text-stone-300 ${errors[question.id] ? 'border-red-300 focus:border-red-500' : 'border-stone-200 focus:border-[#EE7D22]'}`}
                                placeholder="Enter a number..."
                                value={answers[question.id] || ''}
                                onChange={(e) => handleInputChange(question.id, e.target.value)}
                            /> 
                        )}

                        {question.type === 'multiple_choice' && (
                            <div className="space-y-3 pt-2">
                                {question.options?.map((option, i) => (
                                    <label key={i} className={`flex items-center p-3 rounded-lg border cursor-pointer hover:bg-stone-50 transition-colors ${answers[question.id] === option ? 'border-[#EE7D22] bg-orange-50/30' : 'border-stone-200'}`}>
                                        <div className={`flex items-center justify-center w-5 h-5 rounded-full border mr-3 ${answers[question.id] === option ? 'border-[#EE7D22] border-4' : 'border-stone-300'}`}></div>
                                        <input 
                                            type="radio" 
                                            name={`q-${question.id}`} 
                                            value={option}
                                            checked={answers[question.id] === option}
                                            onChange={(e) => handleInputChange(question.id, e.target.value)}
                                            className="hidden" 
                                        />
                                        <span className="text-stone-700">{option}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                     
                     {errors[question.id] && (
                        <div className="flex items-center gap-2 mt-3 text-red-500 text-sm animate-in slide-in-from-top-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            {errors[question.id]}
                        </div>
                     )}
                </div>
            ))}

            <div className="flex justify-between items-center pt-4">
                <button 
                    type="submit"
                    disabled={loading}
                    className="bg-[#EE7D22] hover:bg-[#d66e1d] text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading && (
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
                <button 
                    type="button" 
                    onClick={() => setAnswers({})}
                    disabled={loading}
                    className="text-[#EE7D22] hover:underline text-sm font-medium px-4 disabled:opacity-50"
                >
                    Clear Form
                </button>
            </div>
        </form>

        <div className="text-center pb-8">
            <p className="text-xs text-stone-400">Powered by ISKCON NVCC Forms</p>
        </div>
      </div>
    </div>
  )
}

export default FormView
