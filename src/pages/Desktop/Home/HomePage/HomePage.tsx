import './HomePage.css';
import Skills from "../Skills/Skills.tsx";

export default function HomePage(){
    return (
        <div className={'homepage page'}>
            {/*<img src={getIconImage('intro.png')} alt={'Intro'} className={'intro-pic'}/>*/}
            <div className={'projects-highlight-section'}>
                <span className={'homepage-title'}>Skills</span>
            </div>
            <Skills/>
            <div className={'projects-highlight-section'}>
                <span className={'homepage-title'}>Project Highlights</span>
            </div>
            <div className={'experience-highlight-section'}>
                <span className={'homepage-title'}>Experience Highlights</span>
            </div>
        </div>

    );
}