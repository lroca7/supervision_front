/* eslint-disable no-use-before-define */
'use strict'

import React, { useState } from 'react'
import { render } from 'react-dom'
import { AgGridReact, AgGridColumn } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

const GridExample = () => {
  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)

  const onGridReady = (params) => {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }

  const onBtStopEditing = () => {
    gridApi.stopEditing()
  }

  const onBtStartEditing = (key, char, pinned) => {
    gridApi.setFocusedCell(0, 'lastName', pinned)
    gridApi.startEditingCell({
      rowIndex: 0,
      colKey: 'lastName',
      rowPinned: pinned,
      keyPress: key,
      charPress: char
    })
  }

  const onBtNextCell = () => {
    gridApi.tabToNextCell()
  }

  const onBtPreviousCell = () => {
    gridApi.tabToPreviousCell()
  }

  const onBtWhich = () => {
    const cellDefs = gridApi.getEditingCells()
    if (cellDefs.length > 0) {
      const cellDef = cellDefs[0]
      console.log(
        `editing cell is: row = ${ 
          cellDef.rowIndex 
          }, col = ${ 
          cellDef.column.getId() 
          }, floating = ${ 
          cellDef.rowPinned}`
      )
    } else {
      console.log('no cells are editing')
    }
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="example-wrapper">
        <div
          style={{
            marginBottom: '5px',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <button onClick={() => onBtStartEditing()}>edit (0)</button>
            <button onClick={() => onBtStartEditing(46)}>
              edit (0, Delete)
            </button>
            <button onClick={() => onBtStartEditing(null, 'T')}>
              edit (0, 'T')
            </button>
            <button onClick={() => onBtStartEditing(null, null, 'top')}>
              edit (0, Top)
            </button>
            <button onClick={() => onBtStartEditing(null, null, 'bottom')}>
              edit (0, Bottom)
            </button>
          </div>
          <div>
            <button onClick={() => onBtStopEditing()}>stop ()</button>
            <button onClick={() => onBtNextCell()}>next ()</button>
            <button onClick={() => onBtPreviousCell()}>previous ()</button>
          </div>
          <div>
            <button onClick={() => onBtWhich()}>which ()</button>
          </div>
        </div>
        <div className="grid-wrapper">
          <div
            id="myGrid"
            style={{
              height: '100%',
              width: '100%'
            }}
            className="ag-theme-alpine"
          >
            <AgGridReact
              rowData={[
                {
                  firstName: 'Bob',
                  lastName: 'Harrison',
                  gender: 'Male',
                  address:
                    '1197 Thunder Wagon Common, Cataract, RI, 02987-1016, US, (401) 747-0763',
                  mood: 'Happy',
                  country: 'Ireland'
                },
                {
                  firstName: 'Mary',
                  lastName: 'Wilson',
                  gender: 'Female',
                  age: 11,
                  address:
                    '3685 Rocky Glade, Showtucket, NU, X1E-9I0, CA, (867) 371-4215',
                  mood: 'Sad',
                  country: 'Ireland'
                },
                {
                  firstName: 'Sadiq',
                  lastName: 'Khan',
                  gender: 'Male',
                  age: 12,
                  address:
                    '3235 High Forest, Glen Campbell, MS, 39035-6845, US, (601) 638-8186',
                  mood: 'Happy',
                  country: 'Ireland'
                },
                {
                  firstName: 'Jerry',
                  lastName: 'Mane',
                  gender: 'Male',
                  age: 12,
                  address:
                    '2234 Sleepy Pony Mall , Drain, DC, 20078-4243, US, (202) 948-3634',
                  mood: 'Happy',
                  country: 'Ireland'
                },
                {
                  firstName: 'Bob',
                  lastName: 'Harrison',
                  gender: 'Male',
                  address:
                    '1197 Thunder Wagon Common, Cataract, RI, 02987-1016, US, (401) 747-0763',
                  mood: 'Happy',
                  country: 'Ireland'
                },
                {
                  firstName: 'Mary',
                  lastName: 'Wilson',
                  gender: 'Female',
                  age: 11,
                  address:
                    '3685 Rocky Glade, Showtucket, NU, X1E-9I0, CA, (867) 371-4215',
                  mood: 'Sad',
                  country: 'Ireland'
                },
                {
                  firstName: 'Sadiq',
                  lastName: 'Khan',
                  gender: 'Male',
                  age: 12,
                  address:
                    '3235 High Forest, Glen Campbell, MS, 39035-6845, US, (601) 638-8186',
                  mood: 'Happy',
                  country: 'Ireland'
                },
                {
                  firstName: 'Jerry',
                  lastName: 'Mane',
                  gender: 'Male',
                  age: 12,
                  address:
                    '2234 Sleepy Pony Mall , Drain, DC, 20078-4243, US, (202) 948-3634',
                  mood: 'Happy',
                  country: 'Ireland'
                },
                {
                  firstName: 'Bob',
                  lastName: 'Harrison',
                  gender: 'Male',
                  address:
                    '1197 Thunder Wagon Common, Cataract, RI, 02987-1016, US, (401) 747-0763',
                  mood: 'Happy',
                  country: 'Ireland'
                },
                {
                  firstName: 'Mary',
                  lastName: 'Wilson',
                  gender: 'Female',
                  age: 11,
                  address:
                    '3685 Rocky Glade, Showtucket, NU, X1E-9I0, CA, (867) 371-4215',
                  mood: 'Sad',
                  country: 'Ireland'
                },
                {
                  firstName: 'Sadiq',
                  lastName: 'Khan',
                  gender: 'Male',
                  age: 12,
                  address:
                    '3235 High Forest, Glen Campbell, MS, 39035-6845, US, (601) 638-8186',
                  mood: 'Happy',
                  country: 'Ireland'
                },
                {
                  firstName: 'Jerry',
                  lastName: 'Mane',
                  gender: 'Male',
                  age: 12,
                  address:
                    '2234 Sleepy Pony Mall , Drain, DC, 20078-4243, US, (202) 948-3634',
                  mood: 'Happy',
                  country: 'Ireland'
                },
                {
                  firstName: 'Bob',
                  lastName: 'Harrison',
                  gender: 'Male',
                  address:
                    '1197 Thunder Wagon Common, Cataract, RI, 02987-1016, US, (401) 747-0763',
                  mood: 'Happy',
                  country: 'Ireland'
                },
                {
                  firstName: 'Mary',
                  lastName: 'Wilson',
                  gender: 'Female',
                  age: 11,
                  address:
                    '3685 Rocky Glade, Showtucket, NU, X1E-9I0, CA, (867) 371-4215',
                  mood: 'Sad',
                  country: 'Ireland'
                },
                {
                  firstName: 'Sadiq',
                  lastName: 'Khan',
                  gender: 'Male',
                  age: 12,
                  address:
                    '3235 High Forest, Glen Campbell, MS, 39035-6845, US, (601) 638-8186',
                  mood: 'Happy',
                  country: 'Ireland'
                },
                {
                  firstName: 'Jerry',
                  lastName: 'Mane',
                  gender: 'Male',
                  age: 12,
                  address:
                    '2234 Sleepy Pony Mall , Drain, DC, 20078-4243, US, (202) 948-3634',
                  mood: 'Happy',
                  country: 'Ireland'
                },
                {
                  firstName: 'Bob',
                  lastName: 'Harrison',
                  gender: 'Male',
                  address:
                    '1197 Thunder Wagon Common, Cataract, RI, 02987-1016, US, (401) 747-0763',
                  mood: 'Happy',
                  country: 'Ireland'
                },
                {
                  firstName: 'Mary',
                  lastName: 'Wilson',
                  gender: 'Female',
                  age: 11,
                  address:
                    '3685 Rocky Glade, Showtucket, NU, X1E-9I0, CA, (867) 371-4215',
                  mood: 'Sad',
                  country: 'Ireland'
                },
                {
                  firstName: 'Sadiq',
                  lastName: 'Khan',
                  gender: 'Male',
                  age: 12,
                  address:
                    '3235 High Forest, Glen Campbell, MS, 39035-6845, US, (601) 638-8186',
                  mood: 'Happy',
                  country: 'Ireland'
                },
                {
                  firstName: 'Jerry',
                  lastName: 'Mane',
                  gender: 'Male',
                  age: 12,
                  address:
                    '2234 Sleepy Pony Mall , Drain, DC, 20078-4243, US, (202) 948-3634',
                  mood: 'Happy',
                  country: 'Ireland'
                },
                {
                  firstName: 'Bob',
                  lastName: 'Harrison',
                  gender: 'Male',
                  address:
                    '1197 Thunder Wagon Common, Cataract, RI, 02987-1016, US, (401) 747-0763',
                  mood: 'Happy',
                  country: 'Ireland'
                },
                {
                  firstName: 'Mary',
                  lastName: 'Wilson',
                  gender: 'Female',
                  age: 11,
                  address:
                    '3685 Rocky Glade, Showtucket, NU, X1E-9I0, CA, (867) 371-4215',
                  mood: 'Sad',
                  country: 'Ireland'
                },
                {
                  firstName: 'Sadiq',
                  lastName: 'Khan',
                  gender: 'Male',
                  age: 12,
                  address:
                    '3235 High Forest, Glen Campbell, MS, 39035-6845, US, (601) 638-8186',
                  mood: 'Happy',
                  country: 'Ireland'
                },
                {
                  firstName: 'Jerry',
                  lastName: 'Mane',
                  gender: 'Male',
                  age: 12,
                  address:
                    '2234 Sleepy Pony Mall , Drain, DC, 20078-4243, US, (202) 948-3634',
                  mood: 'Happy',
                  country: 'Ireland'
                }
              ]}
              defaultColDef={{
                flex: 1,
                minWidth: 110,
                editable: true,
                resizable: true
              }}
              pinnedTopRowData={getPinnedTopData()}
              pinnedBottomRowData={getPinnedBottomData()}
              onGridReady={onGridReady}
            >
              <AgGridColumn field="firstName" />
              <AgGridColumn field="lastName" />
              <AgGridColumn field="gender" />
              <AgGridColumn field="age" />
              <AgGridColumn field="mood" />
              <AgGridColumn field="country" />
              <AgGridColumn field="address" minWidth={550} />
            </AgGridReact>
          </div>
        </div>
      </div>
    </div>
  )
}

function getPinnedTopData() {
  return [
    {
      firstName: '##',
      lastName: '##',
      gender: '##',
      address: '##',
      mood: '##',
      country: '##'
    }
  ]
}
function getPinnedBottomData() {
  return [
    {
      firstName: '##',
      lastName: '##',
      gender: '##',
      address: '##',
      mood: '##',
      country: '##'
    }
  ]
}
function getCharCodeFromEvent(event) {
  event = event || window.event
  return typeof event.which === 'undefined' ? event.keyCode : event.which
}
function isCharNumeric(charStr) {
  return !!/\d/.test(charStr)
}
function isKeyPressedNumeric(event) {
  const charCode = getCharCodeFromEvent(event)
  const charStr = String.fromCharCode(charCode)
  return isCharNumeric(charStr)
}

render(<GridExample></GridExample>, document.querySelector('#root'))
