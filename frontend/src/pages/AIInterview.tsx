import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { Bot } from 'lucide-react';

const AIInterview = () => {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-20 h-20 bg-violet-500/10 rounded-full flex items-center justify-center mb-6">
          <Bot className="w-10 h-10 text-violet-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">AI Interviewer</h1>
        <p className="text-slate-400 max-w-md">
          This feature is part of Phase 03. The Python RAG Service will be connected here soon.
        </p>
      </div>
    </AppLayout>
  );
};

export default AIInterview;