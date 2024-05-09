import {useAppSelector} from "../../redux/hooks";
import './NavBar.css';
import PageLink from "../PageLink/PageLink";
import {Page} from "../../redux/slices/pages";
import {useNavigate} from "react-router-dom";
import {getIconImage} from "../../pages/App/fileFunctions.ts";

interface NavBarProps {
    setShowProjectOverlay: (show: boolean) => void;
}

export default function NavBar(props: NavBarProps){
    const pages = useAppSelector(state => state.pages.pages);
    const navigate = useNavigate();
    const pagesWithoutPortfolio = pages.filter((page: Page) => page.relativeLink !== '/');

    function redirectHome(){
        navigate('/');
        props.setShowProjectOverlay(false);
    }
    return (
        <div className={'nav-bar-container'}>
            <div className={'nav-bar'}>
                <div className={'nav-logo'} onClick={redirectHome}>
                    <img className={'logo-image'} src={getIconImage('Logofull.png')} alt={'logo'}/>
                </div>
                <div className={'nav-links'}>
                    <PageLink title={'Overview'} relativeUrl={'/'} key={'portfolio-link'} children={[]}
                              setShowProjectOverlay={props.setShowProjectOverlay}/>
                    <PageLink title={'Experience'} relativeUrl={'/experience'} key={'portfolio-link'} children={[]}
                              setShowProjectOverlay={props.setShowProjectOverlay}/>
                    <PageLink title={'Projects'} key={'work'} children={pagesWithoutPortfolio}
                              setShowProjectOverlay={props.setShowProjectOverlay}/>
                    <a href={'https://www.linkedin.com/in/ian-czerkis'} target="_blank" rel="noopener noreferrer">
                        <img src={getIconImage('LinkedInWhite.png')} alt={'LinkedIn'} className={'social-icon'}/>
                    </a>
                    <a href={'https://github.com/czerkisi'} target="_blank" rel="noopener noreferrer">
                        <img src={getIconImage('githubWhite.png')} alt={'Github'} className={'social-icon'}/>
                    </a>
                </div>
            </div>
            <div className={'nav-bar-space-placeholder'}></div>
        </div>
    )
}