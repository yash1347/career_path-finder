
import React from 'react';
import { RoadmapNode } from '../types';
import { BookIcon, LinkIcon, SalaryIcon, ProgressionIcon } from './IconComponents';

interface RoadmapNodeProps {
  node: RoadmapNode;
  isRoot?: boolean;
}

const RoadmapNodeComponent: React.FC<RoadmapNodeProps> = ({ node, isRoot = false }) => {
  return (
    <li className={isRoot ? '' : 'relative pl-8 before:content-[\'\'] before:absolute before:left-2 before:top-4 before:bottom-0 before:w-0.5 before:bg-gray-700'}>
      <div className="relative">
        {/* Dot and horizontal line */}
        <div className="absolute left-[-1.625rem] top-[0.6rem] h-3 w-3 rounded-full bg-sky-500"></div>
        {!isRoot && <div className="absolute left-[-1.5rem] top-4 h-0.5 w-4 bg-gray-700"></div>}

        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-100">{node.name}</h3>
          <p className="text-gray-400 mt-1">{node.description}</p>
        </div>
        
        {node.salaryExpectations && (
            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="font-semibold text-gray-200 flex items-center space-x-2"><SalaryIcon className="h-5 w-5 text-green-400"/> <span>Salary Expectations</span></h4>
                <p className="text-gray-400 mt-1 pl-7">{node.salaryExpectations}</p>
            </div>
        )}

        {node.careerProgression && (
            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="font-semibold text-gray-200 flex items-center space-x-2"><ProgressionIcon className="h-5 w-5 text-purple-400"/> <span>Career Progression</span></h4>
                <p className="text-gray-400 mt-1 pl-7">{node.careerProgression}</p>
            </div>
        )}

        {node.resources && node.resources.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-200 flex items-center space-x-2"><BookIcon className="h-5 w-5"/> <span>Resources</span></h4>
            <ul className="mt-2 space-y-1 pl-7">
              {node.resources.map((resource, index) => (
                <li key={index} className="flex items-start">
                  <LinkIcon className="h-4 w-4 text-gray-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-400 hover:text-sky-400 break-all">{resource}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {node.children && node.children.length > 0 && (
        <ul className="mt-4">
          {node.children.map((child, index) => (
            <RoadmapNodeComponent key={index} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};


interface RoadmapProps {
    node: RoadmapNode;
}

const Roadmap: React.FC<RoadmapProps> = ({ node }) => {
  return (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
        <ul className="space-y-4">
            <RoadmapNodeComponent node={node} isRoot={true} />
        </ul>
    </div>
  );
};


export default Roadmap;