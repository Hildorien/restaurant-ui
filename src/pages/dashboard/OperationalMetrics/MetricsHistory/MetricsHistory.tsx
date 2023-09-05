import { DarwinSectionTitle } from 'components/DarwinComponents/DarwinSectionTitle'
import { t } from 'i18next'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { MetricsHistoryTable } from './MetricsHistoryTable'
import { ExportToCsv } from 'export-to-csv-fix-source-map';
import useOperationalMetricsHistory from '../hooks/useOperationalMetricsHistory'
import { BrandRecord } from 'redux/operationalMetrics/types'
import ErrorCard from 'components/DarwinComponents/ErrorCard'
import { Spinner } from 'components';
import useBrands from 'pages/products/hooks/useBrands'
import { Brand } from 'redux/brands/types'
import { BranchContext, BranchContextType } from 'context/BranchProvider'

export const MetricsHistory = () => {

  //Import hooks to gather data
  const { loading, operationalMetricsHistory, onRequest: onRequestMetricsHistoryData , error } = useOperationalMetricsHistory();
  const { branches } = useContext(BranchContext) as BranchContextType;
  const { activeBranchId: currentBranchId } = useContext(BranchContext) as BranchContextType;
  const { brandInfo, onRequest: onRequestBrands } = useBrands();


  //Initialize state variables from this section
  const [activeBranch, setActiveBranch] = useState<number | undefined>(undefined);
  const [tableData, setTableData] = useState<BrandRecord[]>([]);

  const handleExport = () => { 
    const activeBranchName = branches?.find(b => b.id === currentBranchId)?.name || "";
    const options = { 
      filename: "historial_metricas" + (activeBranchName !== "" ? ("_" + activeBranchName) : ""),
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title: t('Metrics History'),
      useTextFile: false,
      useBom: true,
      //useKeysAsHeaders: true,
      headers: [t('Brand'), t('Year'), t('Month'), t('Scoring'), t('Delay'), t('Cancellation'), t('Availability'), t('Product availability')]
    };

    const csvExporter = new ExportToCsv(options);

    let csv = [];
    for(const record of tableData) {
      csv.push({
        brand: record.brandName,
        year: record.year,
        month: record.month.toLocaleString(),
        scoring: record.score,
        delay: record.delay,
        cancellation: record.cancellation,
        availability: record.availability,
        productAvailability: record?.productAvailability || 0
      });

    }
    csvExporter.generateCsv(csv);
  }


  useEffect(() => {
    if (operationalMetricsHistory) {
      let tableData: BrandRecord[] = [];
      for(const record of operationalMetricsHistory) {
        tableData.push({
          ...record,
          brandLogoSrc: (brandInfo as Brand[] || [])
          .find((br: Brand) => br.name === record.brandName)?.logoSmall || ''
        })
      }
      tableData.sort(function (r1: BrandRecord, r2: BrandRecord): number {
        return (r1.brandName < r2.brandName && r1.year >= r2.year && r1.month >= r2.month) ? -1: 1; 
      });
      setTableData(tableData);
    }
  }, [operationalMetricsHistory, brandInfo]); //This only happens when branch is changed

  //Fetch new data based on activeBranch
  useEffect(() => {
    if (activeBranch !== currentBranchId) {
        onRequestMetricsHistoryData(currentBranchId);
        onRequestBrands(currentBranchId)
        setActiveBranch(currentBranchId);
    }
  }, [activeBranch, currentBranchId, onRequestMetricsHistoryData, onRequestBrands ]);

  return (
    <>
      <Row>
        <DarwinSectionTitle 
          title={t("Record")}
          subtitle={t('In this section you can consult the operational metrics history')} />
      </Row>

      <Card>
        <Card.Body>
          <Row className="mb-2">
            <div className="text-sm-end">
              <Button variant="light" className="mb-2 text-sm-end" onClick={handleExport}>
                  {t('Export')}
              </Button>
            </div>
          </Row>
          {      
            !error &&
            <MetricsHistoryTable recordsProps={tableData} />
          }
          { error && 
            (<Row>
              <Col lg={4} sm={6}></Col> 
              <Col lg={4} sm={6}>
                <ErrorCard 
                  errorMessage={
                    error === 'USER_NOT_ALLOWED' ? 
                    t("You don't have permission to view this information"):
                    t('Operational metrics is not available right now, try refreshing the webpage')}
                  />
              </Col>
              <Col lg={4} sm={6}></Col> 
            </Row>)
          }
          {
            loading && 
            <div className='text-center'>
            <Spinner className="m-2" color='secondary' />
            </div> 
          }
        </Card.Body>
      </Card>

    </>
  )
}

