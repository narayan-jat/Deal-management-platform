import React from 'react';
import { Contributor } from '@/types/deal/Deal.members';
import { cn } from '@/lib/utils';

interface MentionDropdownProps {
  isOpen: boolean;
  members: Contributor[];
  selectedIndex: number;
  onSelectMember: (member: Contributor) => void;
  onClose: () => void;
}

export const MentionDropdown: React.FC<MentionDropdownProps> = ({
  isOpen,
  members,
  selectedIndex,
  onSelectMember,
  onClose,
}) => {
  if (!isOpen || members.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 mb-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
      <div className="p-3">
        <div className="text-xs text-gray-500 mb-3 px-2 font-medium">Mention a team member:</div>
        {members.map((member, index) => (
          <button
            key={member.id}
            className={cn(
              "w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors duration-150",
              selectedIndex === index && "bg-blue-50 hover:bg-blue-100 border border-blue-200"
            )}
            onClick={() => onSelectMember(member)}
          >
            <div className="flex items-center space-x-3">
              {/* <div className="flex-shrink-0">
                {member.profilePath ? (
                  <img
                    src={member.profilePath}
                    alt={member.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-gray-100"
                  />
                ) : (
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-sm">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div> */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900 truncate text-sm">{member.name}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">{member.role}</span>
                </div>
                <div className="text-sm text-gray-600 truncate">{member.email}</div>
              </div>
            </div>
          </button>
        ))}
        {members.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No members found matching "{members.length > 0 ? members[0]?.name : ''}"
          </div>
        )}
      </div>
    </div>
  );
};
