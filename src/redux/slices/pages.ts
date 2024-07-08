import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PagesState {
    pages: Page[];
}

export interface SubMedia {
    mediaFilename: string;
    mediaType: 'Image' | 'Video' | 'GIF';
    mediaOrientation?: 'Square' | 'Vertical' | 'Horizontal';
    mediaDescription?: string;
    subMediaUid: string;
}

export interface Page {
    uid: string;
    relativeLink: string;
    imageFilename: string;
    shortTitle: string;
    position: string;
    company: string;
    dates: string;
    location: string;
    description: string;
    projects: Project[];
}

export interface Project {
    uid: string;
    thumbnailImageFilename: string;
    projectTitle: string;
    projectSubtitle: string;
    imageName: string;
    projectParagraphs: {
        paragraphTitle: string;
        paragraphText: string;
        paragraphUid: string;
    }[];
    subMedia: {
        mediaFilename: string;
        mediaType: 'Image' | 'Video' | 'GIF';
        mediaOrientation?: 'Square' | 'Vertical' | 'Horizontal';
        mediaDescription?: string;
        subMediaUid: string;
    }[];
}

// const getUuid = () => Math.random().toString(36).substring(7);

const initialState: PagesState = {
    pages: [],
};

const pagesSlice = createSlice({
    name: 'pages',
    initialState,
    reducers: {
        addPage(state, action: PayloadAction<Page>) {
            state.pages.push(action.payload);
        },
        updatePage(state, action: PayloadAction<Page>) {
            const index = state.pages.findIndex(page => page.uid === action.payload.uid);
            if (index !== -1) {
                state.pages[index] = action.payload;
            }
        },
        deletePage(state, action: PayloadAction<string>) {
            state.pages = state.pages.filter(page => page.uid !== action.payload);
        },
        setPages(state, action: PayloadAction<Page[]>) {
            state.pages = action.payload;
        },
    }
});

export const { addPage,
    updatePage,
    deletePage,
    setPages
} = pagesSlice.actions;

export default pagesSlice.reducer;
