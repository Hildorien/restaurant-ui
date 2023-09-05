import { ConnectivityCardRowProps } from './types'
import { Status } from 'redux/branch/types';
import ConnectivityAppState from './ConnectivityAppState';
import { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { t } from 'i18next';

const ConnectivityCardRow = ( { index, appName, appState, finishLoading } : ConnectivityCardRowProps) => {

    const [status, setStatus] = useState(appState);
    const [finishLoadingRow, setFinishLoadingRow] = useState(finishLoading);

    useEffect(() => {
        setStatus(appState);
    }, [appState]);

    useEffect(() => {
        setFinishLoadingRow(finishLoading);
    }, [finishLoading]);

    return (
        <tr key={index.toString()}>
                <td>{appName}</td>
                <td><ConnectivityAppState state={status} appName={appName} finishLoading={finishLoadingRow}/></td>
                <td>
                { finishLoadingRow && status === Status.SUSPENDED &&
                <>
                    <ReactTooltip id={"stat-" + appName} place={'top'}>
                        <span style={{fontSize: '11px'}}>{t('Application suspended by') + ' ' + appName }</span>
                    </ReactTooltip>
                    <i data-tip={"stat-" + appName} data-for={'stat-' + appName} className="uil uil-comment-info" 
                    style={{fontSize: '16px'}}></i>
                </>
            }
                </td>
        </tr>
    );
}

export default ConnectivityCardRow;
