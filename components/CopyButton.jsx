"use client"

import React from 'react'
import toast from 'react-hot-toast'
import { IoLinkOutline } from 'react-icons/io5'

const CopyButton = ({ formId }) => {
    const handleCopy = () => {
        const link = `${window.location.origin}/forms/${formId}`;
        navigator.clipboard.writeText(link)
            .then(() => {
                toast.success('Form link copied to clipboard!')
            })
            .catch((err) => {
                console.error('Failed to copy: ', err)
                toast.error('Failed to copy link.')
            })
    }

    return (
        <button 
            onClick={handleCopy}
            className="inline-flex justify-center items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 border border-stone-200 transition-colors" 
            title="Copy Link"
        >
            <IoLinkOutline size={16} />
        </button>
    )
}

export default CopyButton
