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

    const [geneDict, ] = useState({
        deseq2_all : [],
        deseq2_select : [],
        wilcox_all : [],
        wilcox_select : [],
        deseq2_all_d : [],
        deseq2_select_d : [],
        wilcox_all_d : [],
        wilcox_select_d : []
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

    // ##################################
    // ##################################
    //              COLUMNS
    // ##################################
    // ##################################

    // Columns for DESeq2_All
    const colsDeseq2All = useMemo(
        () => [
          {
            accessorKey: 'Gene_ID',
            header: "Gene ID", 
            Header: () => (
              <div
                style={{
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Gene ID</strong>
              </div>
            ),
            enableClickToCopy: true,
            enableSorting: false,
            enableColumnActions: false,

          },
          {
            accessorKey: 'hgncSymbol',
            header: "Gene Name", 
            Header: () => (
              <div
                style={{
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Gene Name</strong>
              </div>
            ),
            enableSorting: false,
            enableClickToCopy: true,
            enableColumnActions: false,
            Cell: ({ cell }) => <a href={`https://www.proteinatlas.org/search/${cell.row.original.hgncSymbol}`} target="_blank" rel="noreferrer">{cell.row.original.hgncSymbol}</a> ,
            
          },
          {
            accessorKey: 'sigAdj',
            header: "Mean Significance", 
            Header: () => (
              <div
                style={{
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Mean Significance</strong>
              </div>
            ),
            enableColumnFilter : false,
            enableColumnActions: false,
            Cell: ({ cell }) => (<strong onClick={ () => {handlePlot(cell.row.original.Gene_ID, cell.row.original.hgncSymbol)} } style={{cursor:'pointer'}}>{cell.row.original.sigAdj}</strong>),

          },
          {
            accessorKey: 'log2FoldChange',
            header: "Mean Fold Change", 
            Header: () => (
              <div
                style={{
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Mean Fold Change</strong>
              </div>
            ),
            enableColumnFilter : false,
            enableColumnActions: false,
            Cell: ({ cell }) => (<strong onClick={ () => {handlePlot(cell.row.original.Gene_ID, cell.row.original.hgncSymbol)} } style={{cursor:'pointer'}}>{cell.row.original.log2FoldChange}</strong>),
          },
          {
            accessorKey: 'appCount',
            header: "Appearance Count", 
            Header: () => (
              <div
                style={{
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Appearance Count</strong>
              </div>
            ),
            enableColumnFilter : false,
            enableColumnActions: false,
            Cell: ({ cell }) => (<strong onClick={ () => {handlePlot(cell.row.original.Gene_ID, cell.row.original.hgncSymbol)} } style={{cursor:'pointer'}}>{cell.row.original.appCount}</strong>),
            
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },

          //#############################################
          // ONE HOT COLUMNS HERE
          // ############################################
          {
            accessorKey: 'Cornea',
            header: "vs_Cornea", 
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Cornea
              </div>
            ),

            Cell: ({ cell }) => (<>{cell.row.original.Cornea ?  <span>&#x2714;</span> : <span>&#x2718;</span>}</>),

            filterVariant: 'checkbox',
            enableSorting: false,
            enableColumnActions: false,
            size: 25,

            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
          {
            accessorKey: 'Heart',
            header: "vs_Heart", 
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Heart
              </div>
            ),
        
            Cell: ({ cell }) => (<>{cell.row.original.Heart ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
        
            filterVariant: 'checkbox',
            enableSorting: false,
            enableColumnActions: false,
            size: 50,
        
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
          {
            accessorKey: 'Liver',
            header: "vs_Liver", 
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Liver
              </div>
            ),
        
            Cell: ({ cell }) => (<>{cell.row.original.Liver ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
        
            filterVariant: 'checkbox',
            enableSorting: false,
            enableColumnActions: false,
            size: 50,
        
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
          {
            accessorKey: 'Umbilical vein',
            header: "vs_Umbilical_vein", 
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                U.vein
              </div>
            ),
        
            Cell: ({ cell }) => (<>{cell.row.original['Umbilical vein'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
        
            filterVariant: 'checkbox',
            enableSorting: false,
            enableColumnActions: false,
            size: 25,
        
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
          {
            accessorKey: 'Lymph node',
            header: "vs_Lymph_node", 
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                L.node
              </div>
            ),
        
            Cell: ({ cell }) => (<>{cell.row.original['Lymph node'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
        
            filterVariant: 'checkbox',
            enableSorting: false,
            enableColumnActions: false,
            size: 50,
        
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
          {
            accessorKey: 'Sciatic nerve',
            header: "vs_Sciatic_nerve", 
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                S.nerve
              </div>
            ),
        
            Cell: ({ cell }) => (<>{cell.row.original['Sciatic nerve'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
        
            filterVariant: 'checkbox',
            enableSorting: false,
            enableColumnActions: false,
            size: 50,
        
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
          {
            accessorKey: 'Colon',
            header: "vs_Colon", 
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Colon
              </div>
            ),
        
            Cell: ({ cell }) => (<>{cell.row.original['Colon'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
        
            filterVariant: 'checkbox',
            enableSorting: false,
            enableColumnActions: false,
            size: 50,
        
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
          {
            accessorKey: 'Vessel',
            header: "vs_Vessel", 
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Vessel
              </div>
            ),
        
            Cell: ({ cell }) => (<>{cell.row.original['Vessel'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
        
            filterVariant: 'checkbox',
            enableSorting: false,
            enableColumnActions: false,
            size: 50,
        
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
          {
            accessorKey: 'Peripheral blood',
            header: "Peripheral blood", 
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                P.blood
              </div>
            ),
        
            Cell: ({ cell }) => (<>{cell.row.original['Peripheral blood'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
        
            filterVariant: 'checkbox',
            enableSorting: false,
            enableColumnActions: false,
            size: 50,
        
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
          {
            accessorKey: 'Lung',
            header: "vs_Lung", 
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Lung
              </div>
            ),
        
            Cell: ({ cell }) => (<>{cell.row.original['Lung'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
        
            filterVariant: 'checkbox',
            enableSorting: false,
            enableColumnActions: false,
            size: 50,
        
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
          {
            accessorKey: 'Skin',
            header: "vs_Skin", 
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Skin
              </div>
            ),
        
            Cell: ({ cell }) => (<>{cell.row.original['Skin'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
        
            filterVariant: 'checkbox',
            enableSorting: false,
            enableColumnActions: false,
            size: 50,
        
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
          {
            accessorKey: 'Kidney',
            header: "vs_Kidney", 
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Kidney
              </div>
            ),
        
            Cell: ({ cell }) => (<>{cell.row.original['Kidney'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
        
            filterVariant: 'checkbox',
            enableSorting: false,
            enableColumnActions: false,
            size: 50,
        
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
          {
            accessorKey: 'Intestine',
            header: "vs_Intestine", 
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Intestine
              </div>
            ),
        
            Cell: ({ cell }) => (<>{cell.row.original['Intestine'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
        
            filterVariant: 'checkbox',
            enableSorting: false,
            enableColumnActions: false,
            size: 50,
        
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
          {
            accessorKey: 'Tonsil',
            header: "vs_Tonsil", 
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "60px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Tonsil
              </div>
            ),
        
            Cell: ({ cell }) => (<>{cell.row.original['Tonsil'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
        
            filterVariant: 'checkbox',
            enableSorting: false,
            enableColumnActions: false,
            size: 50,
        
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
        ],[],);
    
    // Columns for DESeq2_Select
    const colsDeseq2Select = useMemo(
      () => [
        {
          accessorKey: 'Gene_ID',
          header: "Gene ID", 
          Header: () => (
            <div
              style={{
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Gene ID</strong>
            </div>
          ),
          enableClickToCopy: true,
          enableSorting: false,
          enableColumnActions: false,

        },
        {
          accessorKey: 'hgncSymbol',
          header: "Gene Name", 
          Header: () => (
            <div
              style={{
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Gene Name</strong>
            </div>
          ),
          enableSorting: false,
          enableClickToCopy: true,
          enableColumnActions: false,
          Cell: ({ cell }) => <a href={`https://www.proteinatlas.org/search/${cell.row.original.hgncSymbol}`} target="_blank" rel="noreferrer">{cell.row.original.hgncSymbol}</a> ,
          
        },
        {
          accessorKey: 'sigAdj',
          header: "Mean Significance", 
          Header: () => (
            <div
              style={{
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Mean Significance</strong>
            </div>
          ),
          enableColumnFilter : false,
          enableColumnActions: false,
          Cell: ({ cell }) => (<strong onClick={ () => {handlePlot(cell.row.original.Gene_ID, cell.row.original.hgncSymbol)} } style={{cursor:'pointer'}}>{cell.row.original.sigAdj}</strong>),

        },
        {
          accessorKey: 'log2FoldChange',
          header: "Mean Fold Change", 
          Header: () => (
            <div
              style={{
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Mean Fold Change</strong>
            </div>
          ),
          enableColumnFilter : false,
          enableColumnActions: false,
          Cell: ({ cell }) => (<strong onClick={ () => {handlePlot(cell.row.original.Gene_ID, cell.row.original.hgncSymbol)} } style={{cursor:'pointer'}}>{cell.row.original.log2FoldChange}</strong>),
        },
        {
          accessorKey: 'appCount',
          header: "Appearance Count", 
          Header: () => (
            <div
              style={{
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Appearance Count</strong>
            </div>
          ),
          enableColumnFilter : false,
          enableColumnActions: false,
          Cell: ({ cell }) => (<strong onClick={ () => {handlePlot(cell.row.original.Gene_ID, cell.row.original.hgncSymbol)} } style={{cursor:'pointer'}}>{cell.row.original.appCount}</strong>),
          
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },

        //#############################################
        // ONE HOT COLUMNS HERE
        // ############################################
        {
          accessorKey: 'Colon',
          header: "vs_Colon", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Colon
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Colon'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Heart',
          header: "vs_Heart", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Heart
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original.Heart ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Intestine',
          header: "vs_Intestine", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Intestine
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Intestine'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Kidney',
          header: "vs_Kidney", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Kidney
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Kidney'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Liver',
          header: "vs_Liver", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Liver
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original.Liver ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Lung',
          header: "vs_Lung", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Lung
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Lung'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Vessel',
          header: "vs_Vessel", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Vessel
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Vessel'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
      ],[],);
    
    // Columns for Wilcox_All
    const colsWilcoxAll = useMemo(
      () => [
        {
          accessorKey: 'Gene_ID',
          header: "Gene ID", 
          Header: () => (
            <div
              style={{
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Gene ID</strong>
            </div>
          ),
          enableClickToCopy: true,
          enableSorting: false,
          enableColumnActions: false,

        },
        {
          accessorKey: 'hgncSymbol',
          header: "Gene Name", 
          Header: () => (
            <div
              style={{
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Gene Name</strong>
            </div>
          ),
          enableSorting: false,
          enableClickToCopy: true,
          enableColumnActions: false,
          Cell: ({ cell }) => <a href={`https://www.proteinatlas.org/search/${cell.row.original.hgncSymbol}`} target="_blank" rel="noreferrer">{cell.row.original.hgncSymbol}</a> ,
          
        },
        {
          accessorKey: 'sigAdj',
          header: "Mean Significance", 
          Header: () => (
            <div
              style={{
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Mean Significance</strong>
            </div>
          ),
          enableColumnFilter : false,
          enableColumnActions: false,
          Cell: ({ cell }) => (<strong onClick={ () => {handlePlot(cell.row.original.Gene_ID, cell.row.original.hgncSymbol)} } style={{cursor:'pointer'}}>{cell.row.original.sigAdj}</strong>),

        },
        {
          accessorKey: 'appCount',
          header: "Appearance Count", 
          Header: () => (
            <div
              style={{
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Appearance Count</strong>
            </div>
          ),
          enableColumnFilter : false,
          enableColumnActions: false,
          Cell: ({ cell }) => (<strong onClick={ () => {handlePlot(cell.row.original.Gene_ID, cell.row.original.hgncSymbol)} } style={{cursor:'pointer'}}>{cell.row.original.appCount}</strong>),
          
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },

        //#############################################
        // ONE HOT COLUMNS HERE
        // ############################################
        {
          accessorKey: 'Cornea',
          header: "vs_Cornea", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Cornea
            </div>
          ),

          Cell: ({ cell }) => (<>{cell.row.original.Cornea ?  <span>&#x2714;</span> : <span>&#x2718;</span>}</>),

          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 25,

          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Heart',
          header: "vs_Heart", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Heart
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original.Heart ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Liver',
          header: "vs_Liver", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Liver
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original.Liver ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Umbilical vein',
          header: "vs_Umbilical_vein", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              U.vein
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Umbilical vein'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 25,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Lymph node',
          header: "vs_Lymph_node", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              L.node
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Lymph node'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Sciatic nerve',
          header: "vs_Sciatic_nerve", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              S.nerve
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Sciatic nerve'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Colon',
          header: "vs_Colon", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Colon
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Colon'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Vessel',
          header: "vs_Vessel", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Vessel
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Vessel'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Peripheral blood',
          header: "Peripheral blood", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              P.blood
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Peripheral blood'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Lung',
          header: "vs_Lung", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Lung
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Lung'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Skin',
          header: "vs_Skin", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Skin
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Skin'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Kidney',
          header: "vs_Kidney", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Kidney
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Kidney'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Intestine',
          header: "vs_Intestine", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Intestine
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Intestine'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Tonsil',
          header: "vs_Tonsil", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Tonsil
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Tonsil'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
      ],[],);

    
    // Columns for Wilcox_Select
    const colsWilcoxSelect = useMemo(
      () => [
        {
          accessorKey: 'Gene_ID',
          header: "Gene ID", 
          Header: () => (
            <div
              style={{
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Gene ID</strong>
            </div>
          ),
          enableClickToCopy: true,
          enableSorting: false,
          enableColumnActions: false,

        },
        {
          accessorKey: 'hgncSymbol',
          header: "Gene Name", 
          Header: () => (
            <div
              style={{
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Gene Name</strong>
            </div>
          ),
          enableSorting: false,
          enableClickToCopy: true,
          enableColumnActions: false,
          Cell: ({ cell }) => <a href={`https://www.proteinatlas.org/search/${cell.row.original.hgncSymbol}`} target="_blank" rel="noreferrer">{cell.row.original.hgncSymbol}</a> ,
          
        },
        {
          accessorKey: 'sigAdj',
          header: "Mean Significance", 
          Header: () => (
            <div
              style={{
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Mean Significance</strong>
            </div>
          ),
          enableColumnFilter : false,
          enableColumnActions: false,
          Cell: ({ cell }) => (<strong onClick={ () => {handlePlot(cell.row.original.Gene_ID, cell.row.original.hgncSymbol)} } style={{cursor:'pointer'}}>{cell.row.original.sigAdj}</strong>),

        },
        {
          accessorKey: 'appCount',
          header: "Appearance Count", 
          Header: () => (
            <div
              style={{
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Appearance Count</strong>
            </div>
          ),
          enableColumnFilter : false,
          enableColumnActions: false,
          Cell: ({ cell }) => (<strong onClick={ () => {handlePlot(cell.row.original.Gene_ID, cell.row.original.hgncSymbol)} } style={{cursor:'pointer'}}>{cell.row.original.appCount}</strong>),
          
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },

        //#############################################
        // ONE HOT COLUMNS HERE
        // ############################################
        {
          accessorKey: 'Colon',
          header: "vs_Colon", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Colon
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Colon'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Heart',
          header: "vs_Heart", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Heart
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original.Heart ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Intestine',
          header: "vs_Intestine", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Intestine
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Intestine'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Kidney',
          header: "vs_Kidney", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Kidney
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Kidney'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Liver',
          header: "vs_Liver", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Liver
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original.Liver ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Lung',
          header: "vs_Lung", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Lung
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Lung'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
        {
          accessorKey: 'Vessel',
          header: "vs_Vessel", 
          Header: () => (
            <div
              style={{
                transform: "rotate(270deg)",
                whiteSpace: "nowrap",
                height: "60px", // Set the desired height for the header container
                display: "flex",
                alignItems: "center",
              }}
            >
              Vessel
            </div>
          ),
      
          Cell: ({ cell }) => (<>{cell.row.original['Vessel'] ?  <span >&#x2714;</span> : <span >&#x2718;</span>}</>),
      
          filterVariant: 'checkbox',
          enableSorting: false,
          enableColumnActions: false,
          size: 50,
      
          muiTableHeadCellProps: {
            align: 'center',
          },
          muiTableBodyCellProps: {
            align: 'center',
          },
        },
      ],[],);
  
  // ##################################
  // ##################################
  //             EXPORTERS
  // ##################################
  // ##################################

    //CSV export for Deseq2All
    const csvOptions_Deseq2All = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: colsDeseq2All.map((c) => c.header),
        filename: "export_list_deseq2"
    };

    //CSV export for Deseq2Select
    const csvOptions_Deseq2Select = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: colsDeseq2Select.map((c) => c.header),
        filename: "export_list_deseq2_select"
      };

    //CSV export for WilcoxAll
    const csvOptions_WilcoxAll = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useBom: true,
      useKeysAsHeaders: false,
      headers: colsWilcoxAll.map((c) => c.header),
      filename: "export_list_wilcox_all"
    };

    //CSV export for WilcoxSelect
    const csvOptions_WilcoxSelect = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useBom: true,
      useKeysAsHeaders: false,
      headers: colsWilcoxSelect.map((c) => c.header),
      filename: "export_list_wilcox_select"
    };

    const exporters = {
      'deseq2_all' : new ExportToCsv(csvOptions_Deseq2All),
      'deseq2_all_d' : new ExportToCsv(csvOptions_Deseq2All), 
      'deseq2_select' : new ExportToCsv(csvOptions_Deseq2Select),
      'deseq2_select_d' : new ExportToCsv(csvOptions_Deseq2Select), 
      'wilcox_all' : new ExportToCsv(csvOptions_WilcoxAll),
      'wilcox_all_d' : new ExportToCsv(csvOptions_WilcoxAll), 
      'wilcox_select' : new ExportToCsv(csvOptions_WilcoxSelect),
      'wilcox_select_d' : new ExportToCsv(csvOptions_WilcoxSelect)
    }

    const handleExportRows = (key, rows) => {
      exporters[key].generateCsv(rows.map((row) => row.original));
    };
    
    const handleExportData = (key) => {
      exporters[key].generateCsv(geneDict[key]);
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
            fill
            justify
            id="gene-list-tabs"
            className="mb-3"
          >
            <Tab eventKey="deseq2_all" title="DESeq2 - UP">
                

                <div>
                <MaterialReactTable 
                columns={colsDeseq2All} 
                data={geneDict["deseq2_all"]}
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
                        onClick={() => handleExportRows("deseq2_all", table.getSelectedRowModel().rows)}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export Selection
                      </Button>
                    </Box>
                )}

                />
                </div>


            </Tab>


            <Tab eventKey="deseq2_select" title="DESeq2 - UP - Subset">

            <div>
                <MaterialReactTable 
                columns={colsDeseq2Select} 
                data={geneDict["deseq2_select"]}
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
                        onClick={() => handleExportRows("deseq2_select", table.getSelectedRowModel().rows)}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export Selection
                      </Button>
                    </Box>
                )}
                />
                </div>

            </Tab>


            <Tab eventKey="wilcox_all" title="WRST - UP" >

            <div>
                <MaterialReactTable 
                columns={colsWilcoxAll} 
                data={geneDict["wilcox_all"]}
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
                        onClick={() => handleExportData("wilcox_all")}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export All genes
                      </Button>
                
                      <Button
                        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                        //only export selected rows
                        onClick={() => handleExportRows("wilcox_all", table.getSelectedRowModel().rows)}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export Selection
                      </Button>
                    </Box>
                )}

                />
                </div>

            </Tab>

            <Tab eventKey="wilcox_select" title="WRST - UP - Subset">
            <div>
                <MaterialReactTable 
                columns={colsWilcoxSelect} 
                data={geneDict["wilcox_select"]}
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
                        onClick={() => handleExportData("wilcox_select")}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export All genes
                      </Button>
                
                      <Button
                        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                        //only export selected rows
                        onClick={() => handleExportRows("wilcox_select", table.getSelectedRowModel().rows)}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export Selection
                      </Button>
                    </Box>
                )}
                />
                </div>

            </Tab>


            <Tab eventKey="deseq2_all_d" title="DESeq2 - DN">
                

                <div>
                <MaterialReactTable 
                columns={colsDeseq2All} 
                data={geneDict["deseq2_all_d"]}
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
                        onClick={() => handleExportData("deseq2_all_d")}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export All genes
                      </Button>
                
                      <Button
                        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                        //only export selected rows
                        onClick={() => handleExportRows("deseq2_all_d", table.getSelectedRowModel().rows)}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export Selection
                      </Button>
                    </Box>
                )}

                />
                </div>


            </Tab>

            <Tab eventKey="deseq2_select_d" title="DESeq2 - DN - Subset">

            <div>
                <MaterialReactTable 
                columns={colsDeseq2Select} 
                data={geneDict["deseq2_select_d"]}
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
                        onClick={() => handleExportData("deseq2_select_D")}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export All genes
                      </Button>
                
                      <Button
                        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                        //only export selected rows
                        onClick={() => handleExportRows("deseq2_select_D", table.getSelectedRowModel().rows)}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export Selection
                      </Button>
                    </Box>
                )}
                />
                </div>

            </Tab>


            <Tab eventKey="wilcox_all_d" title="WRST - DN" >

            <div>
                <MaterialReactTable 
                columns={colsWilcoxAll} 
                data={geneDict["wilcox_all_d"]}
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
                        onClick={() => handleExportData("wilcox_all_d")}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export All genes
                      </Button>
                
                      <Button
                        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                        //only export selected rows
                        onClick={() => handleExportRows("wilcox_all_d", table.getSelectedRowModel().rows)}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export Selection
                      </Button>
                    </Box>
                )}

                />
                </div>

            </Tab>


            <Tab eventKey="wilcox_select_d" title="WRST - DN - Subset">
            <div>
                <MaterialReactTable 
                columns={colsWilcoxSelect} 
                data={geneDict["wilcox_select_d"]}
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
                        onClick={() => handleExportData("wilcox_select_d")}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export All genes
                      </Button>
                
                      <Button
                        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                        //only export selected rows
                        onClick={() => handleExportRows("wilcox_select_d", table.getSelectedRowModel().rows)}
                        startIcon={<FileDownloadIcon />}
                        variant="contained"
                      >
                        Export Selection
                      </Button>
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