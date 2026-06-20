import React from 'react';
import { FileText, User, Calendar } from 'lucide-react';

const NoteCard = ({ note, onApprove, onReject }) => {
    return (
        <div className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div className="flex-1">
                        <h3 className="font-semibold">{note.title}</h3>
                        <p className="text-sm text-gray-600">{note.description}</p>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                {note.uploadedBy?.name || 'Unknown'}
                            </span>
                            <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                            <span className="bg-gray-100 px-2 py-1 rounded">
                                {note.subject}
                            </span>
                            <span className="bg-gray-100 px-2 py-1 rounded">
                                {note.branch}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                    <button
                        onClick={() => onApprove(note._id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => onReject(note._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;