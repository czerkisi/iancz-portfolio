import './MobileFooter.css';
import {getIconImage} from "../../pages/App/fileFunctions.ts";

export default function MobileFooter(){
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    return (
        <div className={'mobile-footer-container'}>
            <div className={'mobile-footer-border'}/>
            <span className={'mobile-footer-name'}>Ian Czerkis</span>
            <a href='mailto:ian.czerkis@gmail.com' className={'mobile-email'}>ian.czerkis@gmail.com</a>
            <div className={'mobile-footer-socials'}>
                <a href={'https://www.linkedin.com/in/ian-czerkis'} target="_blank" rel="noopener noreferrer">
                    <img src={getIconImage('LinkedInBlack.png')} alt={'LinkedIn'} className={'mobile-footer-social-icon'}/>
                </a>
                <a href={'https://github.com/czerkisi'} target="_blank" rel="noopener noreferrer">
                    <img src={getIconImage('githubBlack.png')} alt={'Github'} className={'mobile-footer-social-icon'}/>
                </a>
            </div>
            <span className={'mobile-copyright'}>{`©${currentYear} by Ian Czerkis`}</span>
        </div>
    );
}