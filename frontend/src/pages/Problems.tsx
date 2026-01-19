import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import api from '../services/api';
import { ArrowRight, Code2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface Problem {
  _id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

const Problems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await api.get('/problems');
        setProblems(data);
      } catch (error) {
        console.error('Failed to fetch problems', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Problem Set</h1>
          <p className="text-slate-400">Master AI algorithms through code.</p>
        </div>
        {/* We will add a 'Create Problem' button for admins later */}
      </div>

      {loading ? (
        <div className="text-slate-400">Loading library...</div>
      ) : (
        <div className="grid gap-4">
          {problems.map((problem) => (
            <div 
              key={problem._id}
              className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between hover:border-violet-500/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                  problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{problem.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">{problem.category}</span>
                    <span>•</span>
                    <span>{problem.difficulty}</span>
                  </div>
                </div>
              </div>

              <Button 
                variant="secondary" 
                className="!w-auto"
                onClick={() => navigate(`/problems/${problem._id}`)}
              >
                Solve Challenge <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ))}

          {problems.length === 0 && (
            <div className="text-center p-10 text-slate-500">
              No problems found. (Did you add the Matrix Transpose question via Postman?)
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default Problems;