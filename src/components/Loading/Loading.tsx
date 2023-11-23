import React from 'react';

export const LoadingIcon = () => {
    return (
        <div className="flex justify-top h-12 items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white-900"></div>
            <span className="ml-2 text-white">Loading...</span>
        </div>
    );
};

export default LoadingIcon;
