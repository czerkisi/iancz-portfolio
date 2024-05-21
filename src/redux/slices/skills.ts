import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Skill {
    title: string;
    description: string;
    image: string; // filename of the image
}

export interface InitialSkillsState {
    programmingLanguages: Skill[];
    web: Skill[];
    cloud: Skill[];
}

const initialState: InitialSkillsState = {
    programmingLanguages: [],
    web: [],
    cloud: []
}

const skillsSlice = createSlice({
    name: 'skills',
    initialState,
    reducers: {
        setSkills: (_state: InitialSkillsState, action: PayloadAction<InitialSkillsState>) => {
            return action.payload;
        }
    }
});

export const {setSkills} = skillsSlice.actions;

export default skillsSlice.reducer;