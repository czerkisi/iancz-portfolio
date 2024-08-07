import {useEffect, useState} from "react";
import { useAppSelector } from "../../redux/hooks";
import './MobileNavBar.css';
import { Page } from "../../redux/slices/pages";
import { useNavigate } from "react-router-dom";
import {getIconImage} from "../../pages/App/fileFunctions.ts";

interface NavBarProps {
    setShowProjectOverlay: (show: boolean) => void;
}

export default function MobileNavBar(props: NavBarProps) {
    const pages = useAppSelector(state => state.pages.pages);
    const pagesWithoutPortfolio = pages.filter((page: Page) => page.relativeLink !== '/');
    const [showPages, setShowPages] = useState(false);
    const navigate = useNavigate();
    const [showWork, setShowWork] = useState(false);

    useEffect(() => {
        function clearPageDropdown(){

        }
        clearPageDropdown();
    }, [pages]);

    function navigateTo(relativeLink: string) {
        return () => {
            navigate(relativeLink);
            setShowPages(false);
            setShowWork(false);
            props.setShowProjectOverlay(false);
        }
    }

    function handleHamburgerClick() {
        setShowPages(!showPages);
    }

    // function handlePageClick(page: Page) {
    //     if (page.children.length === 0){
    //         navigate(page.relativeLink);
    //         resetAllPages();
    //         setShowPages(false);
    //     } else {
    //         setAllPages(page.children);
    //     }
    // }

    function closeOverlay(){
        setShowPages(false);
    }

    return (
        <div className={'mobile-nav-bar'}>
            <img className={'mobile-logo-image'} src={getIconImage('LogoFull.png')} alt={'logo'} onClick={navigateTo('/')} />
            <img src={getIconImage('hamburgerIcon.png')} alt={'nav'} className={'mobile-hamburger-icon'} onClick={handleHamburgerClick} />

            {showPages && (
                <div className={'mobile-pages-list'}>
                    <span className={'mobile-close-button'} onClick={closeOverlay}>X</span>
                    {!showWork ?
                        <ul>
                            <li key={'home'} onClick={navigateTo('/')} className={'mobile-name-title'}>Home</li>
                            <li key={'work'} onClick={() => setShowWork(true)} className={'mobile-name-title'}>Work</li>
                            <li key={'about'} onClick={navigateTo('/about')} className={'mobile-name-title'}>About</li>
                        </ul>
                        :
                        <ul>
                            {pagesWithoutPortfolio.map((page: Page) => (
                                <li key={page.relativeLink} onClick={navigateTo(page.relativeLink)} className={'mobile-name-title'}>{page.company}</li>
                            ))}
                        </ul>
                    }
                </div>
            )}
        </div>
    );

}
