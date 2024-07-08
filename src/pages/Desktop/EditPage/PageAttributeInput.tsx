import {Page, updatePage} from "../../../redux/slices/pages.ts";
import {useAppDispatch} from "../../../redux/hooks.ts";
interface ImportComponentProps {
    attribute: keyof Page;
    value: string;
    selectedPage: Page;
}
export default function PageAttributeInput(props: ImportComponentProps){
    const dispatch = useAppDispatch();
    let value = props.selectedPage[props.attribute];
    if (typeof value !== 'string') {
        value = "";
    }
    const updatePageAttribute = (attribute: keyof Page, value: string, selectedPage: Page) => {
        let newValue = value;
        if (attribute === 'relativeLink' && !value.startsWith('/')) {
            newValue = '/' + value;
        }
        if (selectedPage) {
            const updatedPage = {
                ...selectedPage,
                [attribute]: newValue
            };
            dispatch(updatePage(updatedPage));
        }
    }
    return (
        <div className={'import-component-container'}>
            <span>{props.attribute}</span>
            <input type={'text'} onChange={e => updatePageAttribute(props.attribute, e.target.value, props.selectedPage)} value={value}/>
        </div>
    )
}