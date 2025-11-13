
import React, { useState, useCallback } from 'react';
import { generateRoadmap, getGroundedInfo } from '../services/geminiService';
import { RoadmapNode, GroundedInfo } from '../types';
import Roadmap from './Roadmap';
import LoadingSpinner from './LoadingSpinner';
import { BrainIcon, SearchIcon, ErrorIcon } from './IconComponents';

const Dashboard: React.FC = () => {
  const [interests, setInterests] = useState('');
  const [query, setQuery] = useState('');
  
  const [roadmapData, setRoadmapData] = useState<RoadmapNode | null>(null);
  const [groundedData, setGroundedData] = useState<GroundedInfo | null>(null);

  const [isRoadmapLoading, setIsRoadmapLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  
  const [roadmapError, setRoadmapError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleGenerateRoadmap = useCallback(async () => {
    if (!interests.trim()) {
      setRoadmapError('Please enter your interests and hobbies.');
      return;
    }
    setIsRoadmapLoading(true);
    setRoadmapError(null);
    setRoadmapData(null);
    try {
      const data = await generateRoadmap(interests);
      setRoadmapData(data);
    } catch (error: any) {
      setRoadmapError(error.message || 'An unknown error occurred.');
    } finally {
      setIsRoadmapLoading(false);
    }
  }, [interests]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
        setSearchError('Please enter a search query.');
        return;
    }
    setIsSearchLoading(true);
    setSearchError(null);
    setGroundedData(null);
    try {
        const data = await getGroundedInfo(query);
        setGroundedData(data);
    } catch (error: any) {
        setSearchError(error.message || 'An unknown error occurred.');
    } finally {
        setIsSearchLoading(false);
    }
  }, [query]);

  return (
    <div className="space-y-12">
      {/* Roadmap Generator */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <div className="flex items-center space-x-4 mb-4">
          <BrainIcon className="h-10 w-10 text-sky-400" />
          <div>
            <h2 className="text-3xl font-bold text-gray-100">Generate Your Career Roadmap</h2>
            <p className="text-gray-400">Leverage advanced AI to build a detailed plan based on your passions. (Uses gemini-2.5-pro)</p>
          </div>
        </div>
        <div className="space-y-4">
          <textarea
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g., video games, graphic design, and building computers..."
            className="w-full p-3 bg-gray-700 border border-gray-600 placeholder-gray-400 text-gray-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            rows={4}
          />
          <button
            onClick={handleGenerateRoadmap}
            disabled={isRoadmapLoading}
            className="w-full bg-sky-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-sky-700 disabled:bg-sky-400/50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
          >
            {isRoadmapLoading ? <LoadingSpinner /> : 'Generate Roadmap'}
          </button>
        </div>
        {roadmapError && (
            <div className="mt-4 flex items-start space-x-3 bg-red-900/40 border-l-4 border-red-500 text-red-200 p-4 rounded-md" role="alert">
                <ErrorIcon className="h-6 w-6 flex-shrink-0" />
                <div>
                    <p className="font-bold">Roadmap Generation Failed</p>
                    <p className="text-sm">{roadmapError}</p>
                </div>
            </div>
        )}
        {roadmapData && <div className="mt-8"><Roadmap node={roadmapData} /></div>}
      </div>

      {/* Grounded Search */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <div className="flex items-center space-x-4 mb-4">
          <SearchIcon className="h-10 w-10 text-amber-400" />
          <div>
            <h2 className="text-3xl font-bold text-gray-100">Quick Search</h2>
            <p className="text-gray-400">Get up-to-date answers to your career questions using Google Search. (Uses gemini-2.5-flash)</p>
          </div>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'What are the highest paying tech jobs in 2024?'"
            className="w-full p-3 bg-gray-700 border border-gray-600 placeholder-gray-400 text-gray-100 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
          />
          <button
            onClick={handleSearch}
            disabled={isSearchLoading}
            className="w-full bg-amber-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-amber-600 disabled:bg-amber-400/50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
          >
            {isSearchLoading ? <LoadingSpinner /> : 'Search'}
          </button>
        </div>
        {searchError && (
          <div className="mt-4 flex items-start space-x-3 bg-amber-900/40 border-l-4 border-amber-500 text-amber-200 p-4 rounded-md" role="alert">
            <ErrorIcon className="h-6 w-6 flex-shrink-0" />
            <div>
              <p className="font-bold">Search Failed</p>
              <p className="text-sm">{searchError}</p>
            </div>
          </div>
        )}
        {groundedData && (
          <div className="mt-8 prose max-w-none prose-p:text-gray-300 prose-ul:text-gray-300 prose-h4:text-gray-200">
            <p>{groundedData.text}</p>
            {groundedData.sources.length > 0 && (
              <>
                <h4 className="font-semibold mt-6">Sources:</h4>
                <ul className="list-disc pl-5">
                  {groundedData.sources.map((source, index) => (
                    <li key={index}>
                      <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">
                        {source.web.title || source.web.uri}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;