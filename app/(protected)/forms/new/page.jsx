"use client"
import React, { useState } from 'react'
import QuestionCard from '../../../../components/QuestionCard'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { generateQuestions } from '@/app/actions/generateQuestions'

const Icons = {
  Save: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" />
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4"/>
      <path d="M12 8h.01"/>
    </svg>
  )
}

const CreateFormPage = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isQuiz, setIsQuiz] = useState(false)
  const [aiTopic, setAiTopic] = useState('')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a form title')
      return
    }

    setLoading(true)
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        throw new Error('You must be logged in to create a form')
      }

      const { error } = await supabase
        .from('forms')
        .insert({
          title,
          description,
          is_quiz: isQuiz,
          questions: questions,
          user_id: user.id
        })

      if (error) throw error

      toast.success('Form saved successfully!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving form:', error)
      toast.error('Failed to save form: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now().toString(),
      type,
      label: '',
      required: false,
      // Initialize options only if it's multiple choice
      options: type === 'multiple_choice' ? ['Option 1', 'Option 2', 'Option 3'] : []
    }
    setQuestions([...questions, newQuestion])
  }

  const deleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestion = (id, updates) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const handleGenerate = async () => {
    if (!aiTopic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    setIsGenerating(true)
    setGeneratedQuestions([])
    try {
      const result = await generateQuestions(aiTopic)
      setGeneratedQuestions(result)
      toast.success('Questions generated!')
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Failed to generate questions')
    } finally {
      setIsGenerating(false)
    }
  }

  const addGeneratedQuestion = (q) => {
    const newQuestion = {
      id: Date.now().toString(),
      type: 'multiple_choice',
      label: q.label,
      required: false,
      options: q.options,
      correctAnswer: q.correctAnswer // Optional: store correct answer if your schema supports it
    }
    setQuestions(prev => [...prev, newQuestion])
    // Optional: Remove from generated list after adding
    setGeneratedQuestions(prev => prev.filter(item => item !== q))
    toast.success('Question added!')
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9] p-4 md:p-8 font-sans text-stone-800">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">Create Form</h1>
            <p className="text-stone-500 mt-1 text-sm md:text-base">Build your form with custom questions</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-[#EE7D22] hover:bg-[#d66e1d] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm w-full md:w-auto"
          >
            <Icons.Save />
            {loading ? 'Saving...' : 'Save Form'}
          </button>
        </div>

        {/* Form Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4 md:p-6 space-y-6">
          <h2 className="text-xl font-serif font-bold text-stone-800">Form Details</h2>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="title" className="block text-sm font-medium text-stone-700">Title</label>
              <input 
                type="text" 
                id="title"
                placeholder="Enter form title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE7D22]/20 focus:border-[#EE7D22] transition-all placeholder:text-stone-400"
              />
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="description" className="block text-sm font-medium text-stone-700">Description</label>
              <textarea 
                id="description"
                placeholder="Describe what this form is for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE7D22]/20 focus:border-[#EE7D22] transition-all placeholder:text-stone-400 resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => setIsQuiz(!isQuiz)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#EE7D22] focus:ring-offset-2 ${isQuiz ? 'bg-[#EE7D22]' : 'bg-stone-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${isQuiz ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className="text-sm text-stone-700 font-medium cursor-pointer" onClick={() => setIsQuiz(!isQuiz)}>
                This is a quiz (enable auto-scoring)
              </span>
            </div>
          </div>
        </div>

        {/* AI Suggestions Card */}
        <div className="bg-[#FFF8F3] rounded-xl border border-[#FCDCC3] p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-[#EE7D22]">
              <Icons.Sparkles />
            </div>
            <h2 className="text-xl font-serif font-bold text-[#3F2E23]">AI Question Suggestions</h2>
          </div>
          <p className="text-[#8C6B55] text-sm mb-4">Enter a topic to get AI-generated question ideas</p>
          
          <div className="flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              placeholder="e.g., Bhagavad Gita basics, Volunteer rules..."
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              className="w-full md:flex-1 px-4 py-3 bg-white border border-[#FCDCC3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE7D22]/20 focus:border-[#EE7D22] placeholder:text-[#BCAAA0]"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-[#EE7D22] hover:bg-[#d66e1d] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 md:py-2 rounded-lg font-medium transition-colors shadow-sm w-full md:w-auto min-w-[120px]"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {generatedQuestions.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-medium text-[#3F2E23]">Generated Suggestions:</h3>
              <div className="grid gap-3">
                {generatedQuestions.map((q, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-[#FCDCC3] flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-stone-800 mb-2">{q.label}</p>
                      <div className="pl-4 border-l-2 border-stone-200">
                        {q.options.map((opt, i) => (
                          <div key={i} className={`text-sm ${opt === q.correctAnswer ? 'text-green-600 font-medium' : 'text-stone-500'}`}>
                            • {opt} {opt === q.correctAnswer && '(Correct)'}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => addGeneratedQuestion(q)}
                      className="text-[#EE7D22] hover:text-[#d66e1d] font-medium text-sm whitespace-nowrap"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Questions Card */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4 md:p-8 min-h-[300px]">
          <div className="space-y-1 mb-6 md:mb-8">
             <h2 className="text-xl font-serif font-bold text-stone-800">Questions</h2>
             <p className="text-stone-500 text-sm">Add and configure your form questions</p>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <button 
              onClick={() => addQuestion('text')}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-stone-200 rounded-lg hover:bg-stone-50 text-stone-700 text-sm font-medium transition-colors bg-white shadow-sm flex-1 md:flex-none"
            >
              <Icons.Plus /> Text
            </button>
            <button 
              onClick={() => addQuestion('number')}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-stone-200 rounded-lg hover:bg-stone-50 text-stone-700 text-sm font-medium transition-colors bg-white shadow-sm flex-1 md:flex-none"
            >
              <Icons.Plus /> Number
            </button>
            <button 
              onClick={() => addQuestion('multiple_choice')}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-stone-200 rounded-lg hover:bg-stone-50 text-stone-700 text-sm font-medium transition-colors bg-white shadow-sm w-full md:w-auto"
            >
              <Icons.Plus /> Multiple Choice
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 text-stone-400">
               <p>No questions yet. Add your first question above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <QuestionCard 
                  key={question.id}
                  question={question}
                  index={index}
                  onUpdate={updateQuestion}
                  onDelete={deleteQuestion}
                  isQuiz={isQuiz}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default CreateFormPage