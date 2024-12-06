import React, { useState } from 'react';
import { BarChart3, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export const CreatePoll: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const { addPoll } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || options.some(opt => !opt.trim())) return;

    await addPoll({
      question: question.trim(),
      options: options.filter(opt => opt.trim()).map(opt => ({
        text: opt.trim(),
        votes: 0
      })),
      createdAt: new Date(),
    });

    setQuestion('');
    setOptions(['', '']);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        Criar Nova Enquete
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">
            Pergunta
          </label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Digite sua pergunta..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Opções (mínimo 2, máximo 5)
          </label>
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Opção ${index + 1}`}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {options.length < 5 && (
          <button
            type="button"
            onClick={addOption}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50"
          >
            <Plus className="w-4 h-4" />
            Adicionar Opção
          </button>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Criar Enquete
        </button>
      </form>
    </div>
  );
};