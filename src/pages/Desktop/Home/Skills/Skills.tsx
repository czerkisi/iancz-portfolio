import './Skills.css';
import {useAppSelector} from "../../../../redux/hooks.ts";
import SkillDisplay from "./SkillDisplay.tsx";

export default function Skills(){
    const languages = useAppSelector(state => state.skills.programmingLanguages);
    const webFrameworks = useAppSelector(state => state.skills.web);
    const cloud = useAppSelector(state => state.skills.cloud);
    return (
        <div className={'skills-section'}>
            <div className={'skills-container'}>
                <div className={'skill-container'}>
                    <span className={'skill-title'}>Programming Languages</span>
                    <div className={'skill-display-container'}>
                        {languages.map(skill => <SkillDisplay skill={skill} key={skill.title}/>)}
                    </div>
                </div>
                <div className={'skill-container'}>
                    <span className={'skill-title'}>Web Frameworks</span>
                    <div className={'skill-display-container'}>
                        {webFrameworks.map(skill => <SkillDisplay skill={skill} key={skill.title}/>)}
                    </div>
                    </div>
                <div className={'skill-container'}>
                    <span className={'skill-title'}>Cloud</span>
                    <div className={'skill-display-container'}>
                        {cloud.map(skill => <SkillDisplay skill={skill} key={skill.title}/>)}
                    </div>
                </div>
            </div>
        </div>
    );
}