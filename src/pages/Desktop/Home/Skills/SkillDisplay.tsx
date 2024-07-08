import {Skill} from "../../../../redux/slices/skills.ts";
import {getIconImage} from "../../../App/fileFunctions.ts";
import {useState} from "react";

interface SkillDisplayProps {
    skill: Skill;
}

export default function SkillDisplay(props: SkillDisplayProps){
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className={'skill-display'}>
            <img
                src={getIconImage(props.skill.image)}
                alt={props.skill.title}
                className={'skill-icon'}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />
            {isHovered &&
                <div className={'skill-overlay'}>
                    <span className={'skill-display-title'}>{props.skill.title}</span>
                    <span className={'skill-display-description'}>{props.skill.description}</span>
                </div>
            }
        </div>
    );

}