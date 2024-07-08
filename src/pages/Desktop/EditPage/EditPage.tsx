import React, {useEffect, useState} from 'react';
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import {
    deletePage,
    Page,
    updatePage,
    setPages, addPage,
} from "../../../redux/slices/pages";
import './EditPage.css';
import {InitialSkillsState} from "../../../redux/slices/skills.ts";
import PageAttributeInput from "./PageAttributeInput.tsx";

const EditPage: React.FC = () => {
    const dispatch = useAppDispatch();

    const [selectedPageUid, setSelectedPageUid] = useState<string>('');
    const [selectedProjectUid, setSelectedProjectUid] = useState<string>('');

    const skills = useAppSelector((state) => state.skills);

    const pages = useAppSelector((state) => state.pages.pages);
    const selectedPage = useAppSelector((state) => state.pages.pages.find(page => page.uid === selectedPageUid));

    const projects = useAppSelector((state) => state.pages.pages.find(page => page.uid === selectedPageUid)?.projects);
    const selectedProject = useAppSelector((state) => state.pages.pages.find(page => page.uid === selectedPageUid)?.projects.find(project => project.uid === selectedProjectUid));

    const [pageTitle, setPageTitle] = useState<string>('');
    const [version, setVersion] = useState<number>(0);
    const [initialState, setInitialState] = useState<Page[]>([]);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    function temp(){
        setSelectedPageUid('')
        setSelectedProjectUid('')
        projects!.find(project => project.uid === selectedProjectUid);
        selectedPage!.projects.find(project => project.uid === selectedProjectUid);
        selectedProject!.uid;
        deletePage('');
        updatePage({} as Page);
    }


    useEffect(() => {
        if (JSON.stringify(pages) !== JSON.stringify(initialState)) {
            setUnsavedChanges(true);
        } else {
            setUnsavedChanges(false);
        }
        if (selectedPageUid == "testing"){
            temp();
        }
    }, [pages, initialState]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (unsavedChanges) {
                event.preventDefault();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [unsavedChanges]);

    function exportPages() {
        const dataObj: {pages: Page[], skills: InitialSkillsState} = {
            pages: [],
            skills: {programmingLanguages: [], web: [], cloud: []}
        };
        dataObj.pages = pages;
        dataObj.skills = skills;
        const data = new Blob([JSON.stringify(dataObj, null, 2)], {type: 'application/json'});
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pages version ${version + 1}.icz`;
        a.click();
        setInitialState(pages);
    }

    function importPages(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const contents = e.target?.result;
                if (contents) {
                    const data = JSON.parse(contents as string);
                    const filename = file.name;
                    const tempVersion = filename.match(/version (\d+)/)?.[1];
                    if (tempVersion) {
                        setVersion(parseInt(tempVersion));
                    }
                    setInitialState(data);
                    const pages = data.pages;
                    // const skills = data.skills;
                    dispatch(setPages(pages));
                }
            }
            reader.readAsText(file);
        }
    }
    const handleAddPageTitle = () => {
        if (pageTitle.trim() !== '') {
            dispatch(addPage({
                imageFilename: "",
                uid: Math.random().toString(36).substring(7),
                relativeLink: pageTitle.replace(/\s+/g, '-').toLowerCase(),
                position: '',
                shortTitle: pageTitle,
                company: '',
                dates: '',
                location: '',
                description: '',
                projects: []
            }));
            setPageTitle('');
        }
    };

    const handlePageDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRelativeLink = event.target.value;
        const selectedPage = pages.find((page) => page.relativeLink === selectedRelativeLink) || null;
        if (selectedPage){
            setSelectedPageUid(selectedPage.uid);
        }
    };

    return (
        <div className={'edit-container'}>
            {version === 0 &&
                <div>
                    <p>Import an Existing .icz File</p>
                    <input type={'file'} onChange={importPages}/>
                </div>
            }
            <div className={'title-input-container'}>
                <label htmlFor="pageTitle">Enter Page Title:</label>
                <input type="text" id="pageTitle" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)}/>
                <button onClick={handleAddPageTitle}>Add Page</button>
            </div>
            <label htmlFor="pageDropdown">Select a Page:</label>
            <select id="pageDropdown" value={selectedPage?.relativeLink || ''} onChange={handlePageDropdownChange}>
                <option value="">Select a Page</option>
                {pages.map((page) => (
                    <option key={page.uid} value={page.relativeLink}>
                        {page.relativeLink}
                    </option>
                ))}
            </select>
            {selectedPage &&
                <div>
                    <h3>{`Selected Page: ${selectedPage.position} at ${selectedPage.company} (${selectedPage.dates})`}</h3>
                    <PageAttributeInput attribute={'relativeLink'} value={selectedPage.relativeLink} selectedPage={selectedPage}/>
                    <PageAttributeInput attribute={'position'} value={selectedPage.position} selectedPage={selectedPage}/>
                    <PageAttributeInput attribute={'company'} value={selectedPage.company} selectedPage={selectedPage}/>
                    <PageAttributeInput attribute={'dates'} value={selectedPage.dates} selectedPage={selectedPage}/>
                    <PageAttributeInput attribute={'location'} value={selectedPage.location} selectedPage={selectedPage}/>
                    <PageAttributeInput attribute={'description'} value={selectedPage.description} selectedPage={selectedPage}/>
                    <PageAttributeInput attribute={'shortTitle'} value={selectedPage.shortTitle} selectedPage={selectedPage}/>
                    <PageAttributeInput attribute={'imageFilename'} value={selectedPage.imageFilename} selectedPage={selectedPage}/>
                </div>
            }
            <button onClick={exportPages}>Export</button>
        </div>
    );
};

export default EditPage;
