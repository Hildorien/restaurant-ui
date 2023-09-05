import React, { useEffect, useState } from 'react'
import { Badge } from 'react-bootstrap';
import StatusParser from './statusParser';
import { ConnectivityAppStateProps } from './types';
import { Spinner } from 'components';
import classNames from 'classnames';
import { Status } from 'redux/branch/types';

const ConnectivityAppState = ({ state, appName, finishLoading }: ConnectivityAppStateProps ) => {    
    const [finishLoadingAppState, setFinishLoadingAppState] = useState(finishLoading);

    useEffect(() => {
        setFinishLoadingAppState(finishLoading);
    }, [finishLoading]);


    return (
        <>
            { finishLoadingAppState ?  
                state === Status.OPENING || state === Status.CLOSING ?
                (<>
                    <Spinner key={appName} className="m-2" type="grow" color={StatusParser.stateColor(state)} />
                    <div>
                    <span> {StatusParser.stateName(state)}... </span>
                    </div>
                </>)
                :
                (
                <h4>
                    <Badge
                            className={classNames(
                                'me-1',
                                'bg-' + StatusParser.stateColor(state),
                                StatusParser.stateColor(state) === 'light' ? 'text-dark' : null,
                                { 'text-light': ['secondary', 'dark'].includes(StatusParser.stateColor(state)) }
                            )}
                            key={appName}
                    >
                    {StatusParser.stateName(state)}
                    </Badge>
                </h4>
                )            
            /*(<Button variant={StatusParser.stateColor(state)} disabled> {StatusParser.stateName(state)} </Button>) */
            :
            (<Spinner className="spinner-border-sm m-2" color={'light'}/>)
            }               
        </>
        );
}

export default ConnectivityAppState;
