import React, {ReactElement, useState} from "react";
import {useHistory, useParams} from "react-router";
import {useSelector} from "react-redux";
import {RouteComponentProps} from "react-router-dom";

import {Background} from "../../components/Background/Background";
import {BackButton} from "../../components/Button/ButtonAction";
import {TabNavigation} from "../../components/TabNavigation/TabNavigation";
import {IRootState} from "../../reducers";
import {BeaconNode} from "./BeaconNode/BeaconNode";
import {ValidatorLogs} from "./ValidatorLogs";
import {ValidatorStats} from "./ValidatorStats/ValidatorStats";

export const ValidatorDetailsContainer = (props: RouteComponentProps): ReactElement => {
    const [currentTab, setCurrentTab] = useState(props.location?.state?.tab! === "BN" ? 2 : 0);
    const history = useHistory();
    const {publicKey} = useParams();
    const validatorsIndex = useSelector((state: IRootState) => state.validators.allPublicKeys.indexOf(publicKey));
    const validator = useSelector((state: IRootState) => state.validators.byPublicKey[publicKey]);
    const validatorId = validatorsIndex > 0 ? validatorsIndex : 0;
    const beaconNodes = useSelector((state: IRootState) => state.network.validatorBeaconNodes);
    const validatorBeaconNodes = beaconNodes[publicKey] || [];

    const tabs = [
        {tabId: 0, tabName: "Validator stats", index: validatorId},
        {tabId: 1, tabName: "Validator logs", index: validatorId},
    ];
    // Load dynamically all validator's beacon node in tabs
    validatorBeaconNodes.forEach((node, index) => tabs.push({
        tabId: tabs.length + index,
        tabName: "Beacon node",
        index,
    }));

    return (
        <Background scrollable={true}>
            <div className="flex-column stretch validator-container">
                <div className="validator-details-container row">
                    <BackButton onClick={(): void => history.goBack()} />
                    <TabNavigation onTab={setCurrentTab} tabs={tabs} current={currentTab} />
                </div>

                {currentTab === tabs[0].tabId ?
                    <ValidatorStats validator={validator} validatorId={validatorId} />
                    : null}

                {currentTab === tabs[1].tabId ?
                    <ValidatorLogs logger={validator.logger}/>
                    : null}

                {tabs.map(tab => (tab.tabName === "Beacon node" && currentTab === tab.tabId ?
                    <BeaconNode key={tab.tabId} node={validatorBeaconNodes[tab.index]} />
                    : null
                ))}
            </div>
        </Background>
    );
};
