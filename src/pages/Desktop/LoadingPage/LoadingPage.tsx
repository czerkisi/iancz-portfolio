import './LoadingPage.css';
import {getIconImage} from "../../App/fileFunctions.ts";

export default function LoadingPage() {
    return (
        <div className="loading-container">
            <img src={getIconImage('loading.png')} alt="loading" className="loading-icon"/>
        </div>
    );
}
