import React from 'react'

const Icons = {
  GripVertical: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="1"/>
      <circle cx="9" cy="5" r="1"/>
      <circle cx="9" cy="19" r="1"/>
      <circle cx="15" cy="12" r="1"/>
      <circle cx="15" cy="5" r="1"/>
      <circle cx="15" cy="19" r="1"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/>
      <path d="m6 6 12 12"/>
    </svg>
  )
}

const QuestionCard = ({ question, index, onUpdate, onDelete, isQuiz }) => {
  
  const handleOptionChange = (optIndex, value) => {
    const newOptions = [...(question.options || [])];
    newOptions[optIndex] = value;
    onUpdate(question.id, { options: newOptions });
  }

  const addOption = () => {
    const newOptions = [...(question.options || [])];
    newOptions.push(`Option ${newOptions.length + 1}`);
    onUpdate(question.id, { options: newOptions });
  }

  const removeOption = (optIndex) => {
    const newOptions = (question.options || []).filter((_, i) => i !== optIndex);
    onUpdate(question.id, { options: newOptions });
  }

  // Helper to convert index to letter (0 -> A, 1 -> B, etc)
  const getOptionLabel = (i) => String.fromCharCode(65 + i)

  return (
    <div className="border border-stone-100 rounded-lg p-4 md:p-5 bg-[#FCFBF9] hover:border-[#FCDCC3] transition-colors group">
      {/* Header Row */}
      <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4 mb-4">
        
        {/* Drag Handle & Number */}
        <div className="flex items-center gap-3">
            <div className="cursor-grab text-stone-300 hover:text-stone-500">
            <Icons.GripVertical />
            </div>
            <span className="text-stone-400 font-medium font-serif min-w-[30px]"># {index + 1}</span>
        </div>
        
        {/* Type Selector */}
        <div className="relative flex-1 md:flex-none min-w-[140px]">
          <select 
            value={question.type}
            onChange={(e) => onUpdate(question.id, { type: e.target.value })}
            className="w-full appearance-none bg-white border border-stone-200 rounded-md py-1.5 pl-3 pr-8 text-sm font-medium text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#EE7D22] focus:border-[#EE7D22]"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="multiple_choice">Multiple Choice</option>
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
            <Icons.ChevronDown />
          </div>
        </div>

        <div className="hidden md:block flex-1" />

        {/* Actions (Required + Delete) */}
        <div className="flex items-center gap-3 border-l border-stone-200 pl-4 ml-auto md:ml-0">
          <div className="flex items-center gap-2">
             <button 
                onClick={() => onUpdate(question.id, { required: !question.required })}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${question.required ? 'bg-[#EE7D22]' : 'bg-stone-200'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ease-in-out ${question.required ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-xs font-medium text-stone-600 hidden sm:inline">Required</span>
          </div>
          
          <button 
            onClick={() => onDelete(question.id)}
            className="text-stone-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-md transition-colors"
          >
            <Icons.Trash />
          </button>
        </div>
      </div>

      <div className="pl-0 md:pl-12 space-y-4">
        <input 
          type="text" 
          value={question.label}
          onChange={(e) => onUpdate(question.id, { label: e.target.value })}
          placeholder="Enter your question..."
          className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE7D22]/20 focus:border-[#EE7D22] transition-all placeholder:text-stone-400"
        />

        {/* Multiple Choice Options */}
        {question.type === 'multiple_choice' && (
          <div className="space-y-3 pt-2">
            {(question.options || []).map((option, i) => (
              <div key={i} className="flex items-center gap-3">
                {isQuiz && (
                  <input
                    type="radio"
                    name={`correct-answer-${question.id}`}
                    checked={question.correctAnswer === option}
                    onChange={() => onUpdate(question.id, { correctAnswer: option })}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                    title="Mark as correct answer"
                  />
                )}
                <span className="text-stone-500 font-medium min-w-[20px] text-right">{getOptionLabel(i)}.</span>
                <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={option}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE7D22]/20 focus:border-[#EE7D22] transition-all placeholder:text-stone-400 pr-10"
                    />
                     <button
                        onClick={() => removeOption(i)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                        <Icons.X />
                    </button>
                </div>
              </div>
            ))}
            
            <button 
              onClick={addOption}
              className="flex items-center gap-2 text-[#2C211A] font-medium text-sm mt-2 ml-8 hover:text-[#EE7D22] transition-colors"
            >
              <Icons.Plus />
              Add Option
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionCard