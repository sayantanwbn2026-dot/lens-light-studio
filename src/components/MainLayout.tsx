import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import PageTransition from './PageTransition';

export const MainLayout = () => {
    return (
        <>
            <PageTransition />
            <Navigation />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default MainLayout;
