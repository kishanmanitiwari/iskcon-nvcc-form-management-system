
"use client"
import React from 'react'

const Icons = {
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  )
}

const ExportButton = ({ responses, questions, fileName = 'responses' }) => {
  
  const handleExport = () => {
    if (!responses || responses.length === 0) return

    // Helper to escape CSV fields
    const escapeCsvCell = (cell) => {
      if (cell === null || cell === undefined) return ''
      const stringValue = String(cell)
      // If value contains comma, double-quote, or newline, wrap in quotes and escape internal quotes
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }

    // 1. Create Headers
    const headers = ['Submitted At', ...questions.map(q => q.label)].map(escapeCsvCell)
    
    // 2. Create Rows
    const rows = responses.map(response => {
      const submittedAt = new Date(response.created_at).toLocaleString()
      
      const answerCells = questions.map(q => {
         return response.answers[q.id]
      })

      return [submittedAt, ...answerCells].map(escapeCsvCell).join(',')
    })

    // 3. Combine to CSV string
    const csvContent = [headers.join(','), ...rows].join('\n')

    // 4. Create Blob and Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${fileName}_responses.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button 
        onClick={handleExport}
        disabled={!responses || responses.length === 0}
        className="flex items-center justify-center gap-2 bg-[#EE7D22] hover:bg-[#d66e1d] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
    >
        <Icons.Download />
        Export CSV
    </button>
  )
}

export default ExportButton
