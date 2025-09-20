import React from 'react';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CollaboratorsSectionProps {
  contributors: any[];
}

export const CollaboratorsSection: React.FC<CollaboratorsSectionProps> = ({ contributors }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Collaborators</span>
          <Badge variant="secondary" className="ml-2">
            {contributors?.length || 0}
          </Badge>
        </h3>
      </div>
      <div className="p-6">
        {contributors && contributors.length > 0 ? (
          <div className="space-y-4">
            {contributors.map((contributor, index) => (
              <div
                key={contributor.id || index}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {contributor.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {contributor.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {contributor.email}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="text-xs">
                    {contributor.role || 'Member'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No collaborators yet</p>
            <p className="text-sm text-gray-400">Collaborators will appear here once added</p>
          </div>
        )}
      </div>
    </div>
  );
};
