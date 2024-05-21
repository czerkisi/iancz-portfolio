import {Skill} from "../../../../redux/slices/skills.ts";
import {getIconImage} from "../../../App/fileFunctions.ts";

interface SkillDisplayProps {
    skill: Skill;
}

export default function SkillDisplay(props: SkillDisplayProps){
    return (
        <div className={'skill-display'}>
            <img src={getIconImage(props.skill.image)} alt={props.skill.title} className={'skill-icon'}/>
            <span className={'skill-name'}>{props.skill.title}</span>
        </div>
    );

}