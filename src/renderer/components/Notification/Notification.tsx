import * as React from "react";
import {Level, Horizontal, Vertical} from "./NotificationEnums";

export interface INotificationProps{
    isVisible: boolean;
    level: Level;
    horizontalPosition: Horizontal;
    verticalPosition: Vertical;
    title?: string;
    onClose: () => void;
}


export const Notification: React.FunctionComponent<React.PropsWithChildren<INotificationProps>> = (
    props: React.PropsWithChildren<INotificationProps>) => {
    
    function getClasses(props: INotificationProps): string {
        let classes ="";
        if(props.isVisible){
            classes+= "visible ";
        } else {classes+= "none ";}
        classes+= props.horizontalPosition + " " + props.verticalPosition + " " + props.level; 
        return classes;
    }

    return(
        <div className={`notification-container
        ${getClasses(props)} `}>
            <div className="notification-title">
                <div>{props.title}</div>
                <div onClick={(): void => props.onClose()} className="close-icon" />
            </div>
            <div className="notification-content">
                {props.children}
            </div>
        </div>
    );
};