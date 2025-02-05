import {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import './variables.css';
import {useAppDispatch, useAppSelector} from "../../redux/hooks.ts";
import {Page, setPages} from "../../redux/slices/pages.ts";
import MobileNavBar from "../../components/MobileNavBar/MobileNavBar.tsx";
import MobileAbout from "../Mobile/MobileAbout/MobileAbout.tsx";
import NavBar from "../../components/NavBar/NavBar.tsx";
import LoadingPage from "../Desktop/LoadingPage/LoadingPage.tsx";
import NotFound from "../Desktop/NotFound/NotFound.tsx";
import EditPage from "../Desktop/EditPage/EditPage.tsx";
import MobileFooter from "../../components/MobileFooter/MobileFooter.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import {InitialSkillsState, setSkills} from "../../redux/slices/skills.ts";
import HomePage from "../Desktop/Home/HomePage/HomePage.tsx";
import ProjectPage from "../Desktop/ProjectPage/ProjectPage.tsx";
import NbaPredictionsPage from "../Desktop/CustomProjectPages/NbaPredictions/NbaPredictionsPage.tsx";

function App() {
    const dispatch = useAppDispatch();
    const pages = useAppSelector(state => state.pages.pages);
    const [pagesLoading, setPagesLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [showProjectOverlay, setShowProjectOverlay] = useState(false);

    useEffect(() => {
        const fetchPages = async () => {
            const response = await fetch('media/pages.icz');
            const data = await response.json();
            const pages: Page[] = data.pages;
            const skills: InitialSkillsState = data.skills;
            dispatch(setPages(pages));
            dispatch(setSkills(skills));
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
                    <Route path={'/'} Component={isMobile ? MobileAbout : HomePage}/>
                    {pagesLoading ?
                        <Route path={'*'} Component={LoadingPage}/>
                        :
                        <Route path={'*'} Component={NotFound}/>
                    }
                    <Route path={'/nbapreds'} Component={NbaPredictionsPage}/>
                    <Route path={'/edit'} element={<EditPage/>}/>
                </Routes>
                {isMobile ? <MobileFooter/> : <Footer/>}
            </Router>
        </div>
    );
}

export default App;
