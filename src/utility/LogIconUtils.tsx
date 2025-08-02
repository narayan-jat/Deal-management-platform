// =====================================================
// LOG ICON UTILITIES
// =====================================================

import React from 'react';
import { 
  Activity, 
  UserPlus, 
  UserMinus, 
  FileUp, 
  Trash2, 
  MessageCircle, 
  Settings, 
  Move, 
  Plus, 
  Edit, 
  Tag 
} from 'lucide-react';
import { LogType } from '@/types/deal/Deal.enums';
import { parseLogData } from './LogDataParser';

/**
 * Gets the appropriate icon component based on log type and data
 * @param logType - The type of log entry
 * @param logData - The log data object
 * @returns React component for the appropriate icon
 */
export function getLogIcon(logType: LogType, logData: any): React.ReactElement {
  const action = parseLogData(logData).toLowerCase();
  
  if (action.includes('document uploaded') || action.includes('file uploaded')) {
    return <FileUp className="w-4 h-4 text-green-600" />;
  }
  if (action.includes('document deleted') || action.includes('file deleted')) {
    return <Trash2 className="w-4 h-4 text-red-600" />;
  }
  if (action.includes('member added') || action.includes('user added')) {
    return <UserPlus className="w-4 h-4 text-blue-600" />;
  }
  if (action.includes('member removed') || action.includes('user removed')) {
    return <UserMinus className="w-4 h-4 text-red-600" />;
  }
  if (action.includes('comment')) {
    return <MessageCircle className="w-4 h-4 text-purple-600" />;
  }
  if (action.includes('card moved') || action.includes('moved')) {
    return <Move className="w-4 h-4 text-orange-600" />;
  }
  if (action.includes('permissions')) {
    return <Settings className="w-4 h-4 text-gray-600" />;
  }
  if (action.includes('status changed')) {
    return <Tag className="w-4 h-4 text-indigo-600" />;
  }
  if (action.includes('created')) {
    return <Plus className="w-4 h-4 text-green-600" />;
  }
  if (action.includes('updated')) {
    return <Edit className="w-4 h-4 text-blue-600" />;
  }
  if (action.includes('deleted')) {
    return <Trash2 className="w-4 h-4 text-red-600" />;
  }
  
  // Default icon based on log type
  switch (logType) {
    case LogType.CREATED:
      return <Plus className="w-4 h-4 text-green-600" />;
    case LogType.UPDATED:
      return <Edit className="w-4 h-4 text-blue-600" />;
    case LogType.DELETED:
      return <Trash2 className="w-4 h-4 text-red-600" />;
    case LogType.COMMENTED:
      return <MessageCircle className="w-4 h-4 text-purple-600" />;
    default:
      return <Activity className="w-4 h-4 text-gray-600" />;
  }
} 