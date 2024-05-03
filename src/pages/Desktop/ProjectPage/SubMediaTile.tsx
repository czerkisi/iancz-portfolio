import {useState} from 'react';
import {getProjectFile, getProjectThumbnailImage} from "../../App/fileFunctions.ts";
import {SubMedia} from "../../../redux/slices/pages.ts";

interface SubMediaImageProps {
    subMedia: SubMedia;
    projectTitle: string;
    sectionTitle: string;
    onClick: () => void;
    type: 'Image' | 'Video' | 'GIF';
}

export default function SubMediaTile(props: SubMediaImageProps) {
    const orientation = props.subMedia.mediaOrientation || 'Square';
    const [isHovered, setIsHovered] = useState(false);
    const media = props.subMedia as SubMedia;
    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={props.onClick}
            className={'submedia-image-container submedia-orientation-' + orientation.toLowerCase()}
        >
            {props.type === 'Image' &&
                <img
                    src={getProjectThumbnailImage(props.sectionTitle, media.mediaFilename, props.projectTitle)}
                    alt={media.mediaDescription}
                    className={'submedia-image submedia-orientation-' + orientation.toLowerCase()}
                />
            }
            {props.type === 'Video' &&
                <video
                    src={getProjectFile(props.sectionTitle, media.mediaFilename, props.projectTitle)}
                    className={'submedia-image submedia-orientation-' + orientation.toLowerCase()}
                    controls
                />
            }
            {props.type === 'GIF' &&
                <img
                    src={getProjectFile(props.sectionTitle, media.mediaFilename, props.projectTitle)}
                    alt={media.mediaDescription}
                    className={'submedia-image submedia-orientation-' + orientation.toLowerCase()}
                />
            }
            {isHovered &&
                <div className={'submedia-image-overlay'}>
                    <span>{media.mediaDescription}</span>
                </div>
            }
        </div>
    );
}