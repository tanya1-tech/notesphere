import React from 'react';

const StatCard = ({ title, value, color }) => {
    const colors = {
        blue: 'bg-blue-100 text-blue-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600'
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">{title}</p>
            <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
        </div>
    );
};

export default StatCard;