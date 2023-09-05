import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap';
import ConnectivityCardRow from './ConnectivityCardRow';
import { ConnectivityCardTableProps } from './types';

const ConnectivityCardTable = ({ integrations: apps, maxRows, finishLoading } : ConnectivityCardTableProps) => {

    const [appsInfo, setAppsInfo] = useState(apps);
    const [finishLoadingTable, setFinishLoadingTable] = useState(finishLoading);
    const invisibleRowCount = maxRows - apps.length;
    let invisibleRows = [];
    for(let i = 0; i < invisibleRowCount; i++) {
        invisibleRows.push( //Creates an equivalent ConnectivityCardRow but with invisible html to offset the brands with less apps
            (<tr key={apps.length + i}>
                <td style={{color: 'transparent'}}>Placeholder</td>
                <td style={{color: 'transparent'}}><Button variant='link'><b style={{color: 'transparent'}}>Placeholder</b></Button></td>
                <td></td>
            </tr>)
        );
    }

    useEffect(() => {
        setAppsInfo(apps);
    }, [apps]);

    useEffect(() => {
        setFinishLoadingTable(finishLoading);
    }, [finishLoading]);

    return (
        <Table className="mb-0">
                    <tbody>
                        {appsInfo.sort((app1, app2) => app1.name < app2.name ? -1 : 1).map((app, index) => {
                            return (
                                <ConnectivityCardRow 
                                    key={index} 
                                    index={index} 
                                    appName={app.name}
                                    appState={app.state}
                                    finishLoading={finishLoadingTable}
                                 />
                            );
                        })}
                        {invisibleRows}
                    </tbody>
        </Table>
  )
}

export default ConnectivityCardTable;
