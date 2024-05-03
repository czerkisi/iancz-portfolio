import {useEffect, useState} from "react";
import './Portfolio.css';
import {getIconImage, getRootFileText} from "../../App/fileFunctions.ts";

export default function Portfolio(){
    const [aboutMeText, setAboutMeText] = useState('');

    useEffect(() => {
        const populateBio = async () => {
            const bio = await getRootFileText('Bio.txt');
            setAboutMeText(bio);
        }
        populateBio();
    }, []);

    return (
        <div className={'about-page page'}>
            <img src={getIconImage('aboutPic.jpeg')} alt={'Profile'} className={'about-pic'}/>
            <div className={'about-text-container'}>
                <span className={'about-me-title'}>Get to know me!</span>
                <span className={'about-me-body'}>{aboutMeText}</span>
            </div>
        </div>
    );
}