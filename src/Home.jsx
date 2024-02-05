import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToken } from './Context/Tokencontext';
import Logoutbutton from './Login/Logoutbutton';

const Home = () => {

    const nav = useNavigate();

    const { decoded, setDecoded, getalldata, getverified } = useToken()


    useEffect(() => {
        getverified()
        getalldata()
    }, [])



    function goToActivity() {
        nav('/edit/activity');
    }

    function goToBlogSection() {
        nav('/edit/blogsection');
    }


    function goToBiography() {
        nav('/edit/biography');
    }

    
    function goToHeroSection() {
        nav('/edit/herosection');
    }

    function goToAboutSection() {
        nav('/edit/aboutsection');
    }

    return (
        <div className="container mx-auto mt-10">
            <Logoutbutton />
            <h1 className="text-3xl font-bold mb-10 md:mb-20 lg:mb-32 xl:mb-40 text-center">EDIT PANEL</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Card 1: Activity */}
                <div className="bg-gradient-to-b from-blue-500 via-blue-900 to-blue-950 rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer" onClick={goToActivity}>
                    <div className="w-full h-56 flex items-center justify-center">
                        <h1 className="text-white text-2xl font-bold">Activity</h1>
                    </div>
                </div>

                {/* Card 2: Blog Section */}
                <div className="bg-gradient-to-b from-purple-500 via-purple-700 to-purple-950 rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer" onClick={goToBlogSection}>
                    <div className="w-full h-56 flex items-center justify-center">
                        <h1 className="text-white text-2xl font-bold">Blog Section</h1>
                    </div>
                </div>

                {/* Card 3: Biography */}
                <div className="bg-gradient-to-b from-green-500 via-green-700 to-green-950 rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer" onClick={goToBiography}>
                    <div className="w-full h-56 flex items-center justify-center">
                        <h1 className="text-white text-2xl font-bold">Biography</h1>
                    </div>
                </div>

                {/* Card 4: Hero Section */}
                <div className="bg-gradient-to-b from-red-500 via-red-700 to-red-950 rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer" onClick={goToHeroSection}>
                    <div className="w-full h-56 flex items-center justify-center">
                        <h1 className="text-white text-2xl font-bold">Hero Section</h1>
                    </div>
                </div>

                {/* Card 5: About Section */}
                <div className="bg-gradient-to-b from-yellow-500 via-yellow-700 to-yellow-950 rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer" onClick={goToAboutSection}>
                    <div className="w-full h-56 flex items-center justify-center">
                        <h1 className="text-white text-2xl font-bold">About Section</h1>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Home;
