import Loader from './Loader'
import Plotmodal from './Plotmodal'
import {useContext, useEffect, useMemo, useState} from 'react'
import { TableContext } from '../context/TableContext'
import MaterialReactTable from 'material-react-table';
import { Button, Box} from '@mui/material';
import { ExportToCsv } from 'export-to-csv';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';



const Dumptable = () => {

    const [loading, setLoading] = useContext(TableContext)    
    
    const tissListFull = ['Cornea', 'Heart', 'Liver', 'Umbilical vein', 'Lymph node', 'Sciatic nerve', 'Colon', 'Vessel', 'Peripheral blood', 'Lung', 'Skin', 'Kidney', 'Intestine', 'Tonsil']
    const tissListSelect = ['Colon', 'Heart', 'Intestine', 'Kidney', 'Liver', 'Lung', 'Vessel']


    const [geneDict, ] = useState({
        deseq2_all : [],
        deseq2_select : [],
        wilcox_all : [],
        wilcox_select : []
    })

    const [active, setActive] = useState(false)
    const [curID, setCurID] = useState(null)
    const [curName, setCurName] = useState(null)

    const fetchGenes = async () => {

        for (const key of Object.keys(geneDict)){


            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
    
            const response = await fetch("/api/omics/dumps/" + key, requestOptions);
            
    
            if (!response.ok) {
                console.log("Bad Request")
            }
            else {
                const data = await response.json()
                geneDict[key] = (Object.values(JSON.parse(data)))
            }

        }

        setLoading(true)
    }


    // Column operations for DESeq2 tables
    const cols_deseq2 = useMemo(
        () => [
          {
            accessorKey: 'Gene_ID',
            header: "Gene ID", 
            Header: <strong className="text-secondary">Gene ID</strong>,
            enableClickToCopy: true,
            enableSorting: false,

          },
          {
            accessorKey: 'hgncSymbol',
            header: "Gene Name", 
            Header: <strong className="text-secondary">Gene Name</strong>,
            enableSorting: false,
            enableClickToCopy: true,
            Cell: ({ cell }) => <a href={`https://www.proteinatlas.org/search/${cell.row.original.hgncSymbol}`} target="_blank" rel="noreferrer">{cell.row.original.hgncSymbol}</a> ,
            
          },
          {
            accessorKey: 'sigAdj',
            header: "Mean Significance", 
            Header: <strong className="text-secondary">Mean Significance</strong>,
            enableColumnFilter : false,
            Cell: ({ cell }) => (<strong onClick={ () => {handlePlot(cell.row.original.Gene_ID, cell.row.original.hgncSymbol)} } style={{cursor:'pointer'}}>{cell.row.original.sigAdj}</strong>),

          },
          {
            accessorKey: 'log2FoldChange',
            header: "Mean Fold Change", 
            Header: <strong className="text-secondary">Mean Fold Change</strong>,
            enableColumnFilter : false,
            Cell: ({ cell }) => (<strong onClick={ () => {handlePlot(cell.row.original.Gene_ID, cell.row.original.hgncSymbol)} } style={{cursor:'pointer'}}>{cell.row.original.sigAdj}</strong>),
          },
          {
            accessorKey: 'appCount',
            header: "Appearance Count", 
            Header: <strong className="text-secondary">Appearance Count</strong>,
            enableColumnFilter : false,
            Cell: ({ cell }) => (<strong onClick={ () => {handlePlot(cell.row.original.Gene_ID, cell.row.original.hgncSymbol)} } style={{cursor:'pointer'}}>{cell.row.original.appCount}</strong>),

          },
          {
            accessorKey: 'tissList',
            header: "Significant in Comparison", 
            Header: <strong className="text-secondary">Significant in Comparison</strong>,
            size: 150,
            enableSorting: false,
            enableHiding: false
          },
        ],[],);


     // Column operations for wcx-rst tables
     const cols_wcx = useMemo(
        () => [
          {
            accessorKey: 'Gene_ID',
            header: "Gene ID", 
            Header: <strong className="text-secondary">Gene ID</strong>,
            enableClickToCopy: true,
            enableSorting: false,

          },
          {
            accessorKey: 'hgncSymbol',
            header: "Gene Name", 
            Header: <strong className="text-secondary">Gene Name</strong>,
            enableSorting: false,
            enableClickToCopy: true,
            Cell: ({ cell }) => <a href={`https://www.proteinatlas.org/search/${cell.row.original.hgncSymbol}`} target="_blank" rel="noreferrer">{cell.row.original.hgncSymbol}</a> ,
            
          },
          {
            accessorKey: 'sigAdj',
            header: "Mean Significance", 
            Header: <strong className="text-secondary">Mean Significance</strong>,
            enableColumnFilter : false,
            Cell: ({ cell }) => (<strong onClick={ () => {handlePlot(cell.row.original.Gene_ID, cell.row.original.hgncSymbol)} } style={{cursor:'pointer'}}>{cell.row.original.sigAdj}</strong>),

          },
          {
            accessorKey: 'appCount',
            header: "Appearance Count", 
            Header: <strong className="text-secondary">Appearance Count</strong>,
            enableColumnFilter : false,
            Cell: ({ cell }) => (<strong onClick={ () => {handlePlot(cell.row.original.Gene_ID, cell.row.original.hgncSymbol)} } style={{cursor:'pointer'}}>{cell.row.original.appCount}</strong>),

          },
          {
            accessorKey: 'tissList',
            header: "Significant in Comparison", 
            Header: <strong className="text-secondary">Significant in Comparison</strong>,
            size: 150,
            enableSorting: false,
            enableHiding: false
          },
        ],[],);
    
    //CSV export for deseq2
    const csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: cols_deseq2.map((c) => c.header),
        filename: "export_list_deseq2"
    };

    //CSV export for wcx
    const csvOptionsWcx = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: cols_wcx.map((c) => c.header),
        filename: "export_list_wcx"
    };
    
    const csvExporter = new ExportToCsv(csvOptions);
    const csvExporterWcx = new ExportToCsv(csvOptionsWcx);

    const handleExportRows = (rows) => {
        csvExporter.generateCsv(rows.map((row) => row.original));
    };
    
    const handleExportData = (key) => {
      csvExporter.generateCsv(geneDict[key]);
    };

    const handleExportRowsWcx = (rows) => {
        csvExporterWcx.generateCsv(rows.map((row) => row.original));
    };
    
    const handleExportDataWcx = (key) => {
      csvExporterWcx.generateCsv(geneDict[key]);
    };

    const handleModal = () => {
        setActive(!active);
        setTimeout(() => setCurID(null), 200);
    }

    const handlePlot = (geneID, geneName) => {
        setCurID(geneID)
        setCurName(geneName)
        setActive(true)
    }
    

    // For mount purposes
   
    useEffect(() => {
      fetchGenes()
    // eslint-disable-next-line
    }, [])

    return(
        
        <>


        {loading ? (
            <>

        <Tabs
            id="gene-list-tabs"
            className="mb-3"
          >
            <Tab eventKey="deseq2_all" title="DESeq2">
                

                <div>
                <MaterialReactTable 
                columns={cols_deseq2} 
                data={geneDict["deseq2_all"]}
                initialState={{ columnVisibility: { tissList : false } }}
                globalFilterFn="contains" 
                enableRowSelection

                muiTableHeadCellProps={{

                    sx: {
                      '& .Mui-TableHeadCell-Content': {
                    
                        justifyContent: 'space-between',
                      },
                    },
                }}

                renderTopToolbarCustomActions={({ table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
                      <Button
                        color="primary"
                        //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                        onClick={() => handleExportData("deseq2_all")}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export All genes
                      </Button>
                
                      <Button
                        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                        //only export selected rows
                        onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export Selection
                      </Button>
                    </Box>
                )}
                
                renderDetailPanel={({ row }) => (

                    <Box
                      sx={{
                        display: 'grid',
                        //margin: 'auto',
                        gridTemplateColumns: '1fr 1fr',
                        width: '100%',
                      }}
                    >
                   
                         <div className="row"> 
                        {
                            tissListFull.map((tiss) => <div class="col-md-2">{row.original.tissList_array.includes(tiss) ? (<><span className='text-success'>{tiss}: </span><span>&#x2714;</span></>) : ((<><span className='text-danger'>{tiss}: </span><span>&#x2718;</span></>))}</div>)
                        }
                        </div>
                    
                    
                    </Box>            
                  )}

                />
                </div>


            </Tab>


            <Tab eventKey="deseq2_select" title="DESeq2 - Tissue Subset">

            <div>
                <MaterialReactTable 
                columns={cols_deseq2} 
                data={geneDict["deseq2_select"]}
                initialState={{ columnVisibility: { tissList : false } }}
                globalFilterFn="contains" 
                enableRowSelection

                muiTableHeadCellProps={{

                    sx: {
                      '& .Mui-TableHeadCell-Content': {
                    
                        justifyContent: 'space-between',
                      },
                    },
                }}

                renderTopToolbarCustomActions={({ table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
                      <Button
                        color="primary"
                        //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                        onClick={() => handleExportData("deseq2_select")}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export All genes
                      </Button>
                
                      <Button
                        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                        //only export selected rows
                        onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export Selection
                      </Button>
                    </Box>
                )}
                
                renderDetailPanel={({ row }) => (

                    <Box
                      sx={{
                        display: 'grid',
                        //margin: 'auto',
                        gridTemplateColumns: '1fr 1fr',
                        width: '100%',
                      }}
                    >
                   
                         <div className="row"> 
                        {
                            tissListSelect.map((tiss) => <div class="col-md-3">{row.original.tissList_array.includes(tiss) ? (<><span className='text-success'>{tiss}: </span><span>&#x2714;</span></>) : ((<><span className='text-danger'>{tiss}: </span><span>&#x2718;</span></>))}</div>)
                        }
                        </div>
                    
                    
                    </Box>            
                  )}

                />
                </div>

            </Tab>


            <Tab eventKey="wilcox_all" title="Wilcoxon rank-sum test" >

            <div>
                <MaterialReactTable 
                columns={cols_wcx} 
                data={geneDict["wilcox_all"]}
                initialState={{ columnVisibility: { tissList : false } }}
                globalFilterFn="contains" 
                enableRowSelection

                muiTableHeadCellProps={{

                    sx: {
                      '& .Mui-TableHeadCell-Content': {
                    
                        justifyContent: 'space-between',
                      },
                    },
                }}

                renderTopToolbarCustomActions={({ table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
                      <Button
                        color="primary"
                        //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                        onClick={() => handleExportDataWcx("wilcox_all")}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export All genes
                      </Button>
                
                      <Button
                        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                        //only export selected rows
                        onClick={() => handleExportRowsWcx(table.getSelectedRowModel().rows)}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export Selection
                      </Button>
                    </Box>
                )}
                
                renderDetailPanel={({ row }) => (

                    <Box
                      sx={{
                        display: 'grid',
                        //margin: 'auto',
                        gridTemplateColumns: '1fr 1fr',
                        width: '100%',
                      }}
                    >
                   
                         <div className="row"> 
                        {
                            tissListFull.map((tiss) => <div class="col-md-3">{row.original.tissList_array.includes(tiss) ? (<><span className='text-success'>{tiss}: </span><span>&#x2714;</span></>) : ((<><span className='text-danger'>{tiss}: </span><span>&#x2718;</span></>))}</div>)
                        }
                        </div>
                    
                    
                    </Box>            
                  )}

                />
                </div>

            </Tab>

            <Tab eventKey="wilcox_select" title="Wilcoxon rank-sum test - Tissue Subset">
            <div>
                <MaterialReactTable 
                columns={cols_wcx} 
                data={geneDict["wilcox_select"]}
                initialState={{ columnVisibility: { tissList : false } }}
                globalFilterFn="contains" 
                enableRowSelection

                muiTableHeadCellProps={{

                    sx: {
                      '& .Mui-TableHeadCell-Content': {
                    
                        justifyContent: 'space-between',
                      },
                    },
                }}

                renderTopToolbarCustomActions={({ table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
                      <Button
                        color="primary"
                        //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                        onClick={() => handleExportDataWcx("wilcox_select")}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export All genes
                      </Button>
                
                      <Button
                        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                        //only export selected rows
                        onClick={() => handleExportRowsWcx(table.getSelectedRowModel().rows)}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export Selection
                      </Button>
                    </Box>
                )}
                
                renderDetailPanel={({ row }) => (

                    <Box
                      sx={{
                        display: 'grid',
                        //margin: 'auto',
                        gridTemplateColumns: '1fr 1fr',
                        width: '100%',
                      }}
                    >
                   
                         <div className="row"> 
                        {
                            tissListSelect.map((tiss) => <div class="col-md-3">{row.original.tissList_array.includes(tiss) ? (<><span className='text-success'>{tiss}: </span><span>&#x2714;</span></>) : ((<><span className='text-danger'>{tiss}: </span><span>&#x2718;</span></>))}</div>)
                        }
                        </div>
                    
                    
                    </Box>            
                  )}

                />
                </div>

            </Tab>
        </Tabs>

            <Plotmodal active={active} geneID={curID} geneName={curName} handleModal={handleModal}/>


            </>

        ) : (<><br/><div className="container-fluid d-flex justify-content-center"><Loader /></div></>)}
      </>

    )
}

export default Dumptable;