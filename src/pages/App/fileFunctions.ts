export function getIconImage(filename: string){
    return 'media/files/icons/' + filename;
}

export function getProjectFile(sectionName: string, filename: string, projectName: string){
    return `media/files/${sectionName || 'Portfolio'}/${projectName}/${filename}`;
}

export function getProjectThumbnailImage(sectionName: string, filename: string, projectName: string){
    return `media/thumbnails/${sectionName || 'Portfolio'}/${projectName}/${filename}`;
}

export async function getRootFileText(filename: string) {
    try {
        const response = await fetch('media/' + filename);
        if (!response.ok) {
            return '';
        }
        return await response.text();
    } catch (error) {
        return '';
    }
}

export function getCustomProjectFile(projectName: string, fileName: string){
    return `customProjects/${projectName}/${fileName}`;
}