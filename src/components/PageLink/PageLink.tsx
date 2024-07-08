import { useState } from "react";
import "./PageLink.css";
import {useLocation, useNavigate} from "react-router-dom";

export interface PageLinkChild {
    title: string;
    relativeLink: string;
}

interface LinkItemProps {
    relativeUrl?: string;
    title: string;
    children: PageLinkChild[];
    setShowProjectOverlay: (show: boolean) => void;
}

export default function PageLink(props: LinkItemProps) {
    const [isHovered, setIsHovered] = useState(false);
    const classes: string[] = ['nav-link-text'];
    const navigate = useNavigate();
    const children = props.children;

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleParentClick = () => {
        if (children.length === 0 && props.relativeUrl) {
            navigateToLink(props.relativeUrl);
        }
    };

    const navigateToLink = (toNavigate: string) => {
        navigate(toNavigate);
        setIsHovered(false);
        props.setShowProjectOverlay(false);
    }

    const location = useLocation();
    const pathname = location.pathname;
    const pathnameContainsChild = children.some(child => pathname === child.relativeLink);

    if (pathname === props.relativeUrl || isHovered || pathnameContainsChild) {
        classes.push('selected-nav-link');
    }
    if (children.length === 0){
        classes.push('clickable-text');
    } else {
        classes.push('not-clickable-text');
    }

    return (
        <div
            className="nav-link-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <span className={`page-link-text ${classes.join(' ')}`} onClick={handleParentClick}>{props.title}</span>
            {isHovered && children && (
                <ul className="child-list">
                    {children.map((child, index) => (
                        <li key={index} onClick={() => navigateToLink(child.relativeLink)}>
                            {child.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
