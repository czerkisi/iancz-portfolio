import {useAppSelector} from "../../redux/hooks";
import './NavBar.css';
import PageLink, {PageLinkChild} from "../PageLink/PageLink";
import {useNavigate} from "react-router-dom";
import {getIconImage} from "../../pages/App/fileFunctions.ts";

interface NavBarProps {
    setShowProjectOverlay: (show: boolean) => void;
}

export default function NavBar(props: NavBarProps){
    const pages = useAppSelector(state => state.pages.pages);
    const navigate = useNavigate();
    const certificationsPage: PageLinkChild = {title: 'Certifications', relativeLink: '/certifications'};
    const msoePage: PageLinkChild = {title: 'Milwaukee School of Engineering', relativeLink: '/msoe'}
    const allOtherPages: PageLinkChild[] = pages
        .filter(page => page.relativeLink !== '/msoe')
        .map(page => ({
            title: page.shortTitle,
            relativeLink: page.relativeLink,
        }));

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
                    <PageLink title={'Overview'} relativeUrl={'/'} key={'home-link'} children={[]}
                              setShowProjectOverlay={props.setShowProjectOverlay}/>
                    <PageLink title={'Internships'} relativeUrl={'/internships'} key={'internships-link'} children={allOtherPages}
                              setShowProjectOverlay={props.setShowProjectOverlay}/>
                    <PageLink title={'Education'} relativeUrl={'/education'} key={'education-link'} children={[msoePage, certificationsPage]}
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