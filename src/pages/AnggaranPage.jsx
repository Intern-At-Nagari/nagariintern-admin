import React from 'react';
import Sidebar from '../components/Sidebar';
import BreadcrumbsComponent from '../components/BreadcrumbsComponent';

const AnggaranPage = () => {
    return (
        <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
            <Sidebar />
            <div className="flex-1 p-6">
                <BreadcrumbsComponent />
                <h1 className="text-2xl font-bold mb-4">Anggaran Page</h1>
                <p>Content for the Anggaran page goes here.</p>
            </div>
        </div>
    );
};

export default AnggaranPage;