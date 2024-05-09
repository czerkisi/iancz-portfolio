import './Footer.css';
import {getIconImage} from "../../pages/App/fileFunctions.ts";

export default function Footer(){
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    return (
        <div className={'footer-container'}>
            <span className={'footer-name'}>Ian Czerkis</span>
            <a href='mailto:ian.czerkis@icloud.com' className={'email'}>ian.czerkis@icloud.com</a>
            <div className={'footer-socials'}>
                <a href={'https://www.linkedin.com/in/ian-czerkis'} target="_blank" rel="noopener noreferrer">
                    <img src={getIconImage('LinkedInWhite.png')} alt={'LinkedIn'} className={'social-icon'}/>
                </a>
                <a href={'https://github.com/czerkisi'} target="_blank" rel="noopener noreferrer">
                    <img src={getIconImage('githubWhite.png')} alt={'Github'} className={'social-icon'}/>
                </a>
            </div>
            <span className={'copyright'}>{`©${currentYear} by Ian Czerkis`}</span>
        </div>
    );
}