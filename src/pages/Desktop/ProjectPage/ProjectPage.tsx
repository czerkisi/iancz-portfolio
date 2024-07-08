import {useEffect, useState} from "react";
import {Page, Project} from "../../../redux/slices/pages";
import './ProjectPage.css';
import ProjectTile from "../../../components/ProjectTile/ProjectTile";
import ProjectOverlay from "../ProjectOverlay/ProjectOverlay";
import {getIconImage} from "../../App/fileFunctions.ts";

interface ProjectsPageProps {
    page: Page;
    showProjectOverlay: boolean;
    setShowProjectOverlay: (show: boolean) => void;
}

export default function ProjectPage(props: ProjectsPageProps){
    const page = props.page;
    const projects = page.projects;
    const showProjectOverlay = props.showProjectOverlay;

    const [projectIndex, setProjectIndex] = useState(0);
    const [nextProjectTitle, setNextProjectTitle] = useState('');
    const [previousProjectTitle, setPreviousProjectTitle] = useState('');

    useEffect(() => {
        if (projectIndex < projects.length - 1){
            setNextProjectTitle(projects[projectIndex + 1].projectTitle);
        } else {
            setNextProjectTitle('');
        }
        if (projectIndex > 0){
            setPreviousProjectTitle(projects[projectIndex - 1].projectTitle);
        } else {
            setPreviousProjectTitle('');
        }
    }, [projectIndex, projects]);

    const handleClick = (index: number) => {
        setProjectIndex(index);
        props.setShowProjectOverlay(true)
    }

    const handleClose = () => {
        props.setShowProjectOverlay(false);
    }

    const goForward = () => {
        setProjectIndex(projectIndex + 1);
        // handleScrollToTop(); don't scroll to top
    }

    const goBackward = () => {
        setProjectIndex(projectIndex - 1);
        // handleScrollToTop(); don't scroll to top
    }

    const chunkArray = (arr: Project[], size: number) => {
        return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
            arr.slice(index * size, index * size + size)
        );
    };

    const projectRows = chunkArray(projects, 3);

    return (
        <div>
            {showProjectOverlay ?
                <ProjectOverlay
                    relativeLink={page.relativeLink}
                    project={projects[projectIndex]}
                    onClose={handleClose}
                    goForward={goForward}
                    goBackward={goBackward}
                    nextProjectTitle={nextProjectTitle}
                    previousProjectTitle={previousProjectTitle}
                />
                :
                <div className={'project-page'}>
                    <div className={'project-overview-container'}>
                        <div className={'project-overview-section'}>
                            {JSON.stringify({
                                Position: page.position,
                                Company: page.company,
                                Dates: page.dates,
                                Location: page.location,
                                Description: page.description
                            })}
                        </div>
                        <div className={'project-overview-section-container'}>
                            <img src={getIconImage(page.imageFilename)} alt={`${page.company} Logo`} className={'project-overview-image'}/>
                        </div>
                    </div>
                    <span>

                    </span>
                    {/*{section.title && <span className={'project-page-title'}>{section.title}</span>}*/}
                    {/*{section.subtitle && <span className={'project-page-subtitle'}>{section.subtitle}</span>}*/}
                    {/*{section.description && <span className={'project-page-description'}>{section.description}</span>}*/}
                    <div className={'project-rows-container'}>
                        {projectRows.map((row, rowIndex) => (
                            <div className={'project-section-row'} key={`row-${rowIndex}`}>
                                {row.map((project, index) => (
                                    <ProjectTile
                                        relativeLink={page.relativeLink}
                                        project={project}
                                        onClick={() => handleClick(rowIndex * 3 + index)}
                                        key={`${project.projectTitle}-${project.uid}-${index}`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>

    );
}