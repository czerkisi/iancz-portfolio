import {useEffect, useState} from 'react';
import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import './variables.css';
import {useAppDispatch, useAppSelector} from "../../redux/hooks.ts";
import {setPages} from "../../redux/slices/pages.ts";
import MobileNavBar from "../../components/MobileNavBar/MobileNavBar.tsx";
import ProjectPage from "../Desktop/Page/ProjectPage.tsx";
import MobileAbout from "../Mobile/MobileAbout/MobileAbout.tsx";
import AboutPage from "../Desktop/About/AboutPage.tsx";
import NavBar from "../../components/NavBar/NavBar.tsx";
import LoadingPage from "../Desktop/LoadingPage/LoadingPage.tsx";
import NotFound from "../Desktop/NotFound/NotFound.tsx";
import EditPage from "../Desktop/EditPage/EditPage.tsx";
import MobileFooter from "../../components/MobileFooter/MobileFooter.tsx";
import Footer from "../../components/Footer/Footer.tsx";

function App() {
    const dispatch = useAppDispatch();
    const pages = useAppSelector(state => state.pages.pages);
    const [pagesLoading, setPagesLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [showProjectOverlay, setShowProjectOverlay] = useState(false);

    useEffect(() => {
        const fetchPages = async () => {
            const response = await fetch('media/pages.rld');
            const data = await response.json();
            dispatch(setPages(data));
        }
        fetchPages().then(() => setPagesLoading(false));
    }, [dispatch]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className={'app'}>
            <Router>
                {isMobile ? <MobileNavBar setShowProjectOverlay={setShowProjectOverlay}/> : <NavBar setShowProjectOverlay={setShowProjectOverlay}/>}
                <Routes>
                    {pages.map((page, index) => <Route path={page.relativeLink} key={index} element={
                        <ProjectPage page={page} setShowProjectOverlay={setShowProjectOverlay} showProjectOverlay={showProjectOverlay}/>
                    }/>)}
                    <Route path={'about'} Component={isMobile ? MobileAbout : AboutPage}/>
                    {pagesLoading ?
                        <Route path={'*'} Component={LoadingPage}/>
                        :
                        <Route path={'*'} Component={NotFound}/>
                    }
                    <Route path={'/edit'} element={<EditPage/>}/>
                </Routes>
                {isMobile ? <MobileFooter/> : <Footer/>}
            </Router>
        </div>
    );
}

export default App;
