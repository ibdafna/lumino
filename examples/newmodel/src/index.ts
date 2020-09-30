// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2017, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import 'es6-promise/auto';  // polyfill Promise on IE

import {
  BasicKeyHandler, BasicMouseHandler, BasicSelectionModel,
  DataGrid, DataModel, JSONModel, CellGroup
} from '../../../packages/datagrid/src/index';

import {
  DockPanel, Widget
} from '../../../packages/widgets';


import '../style/index.css';

class LargeDataModel extends DataModel {

  rowCount(region: DataModel.RowRegion): number {
    return region === 'body' ? 20 : 3;
  }

  columnCount(region: DataModel.ColumnRegion): number {
    return region === 'body' ? 6 : 3;
  }

  data(region: DataModel.CellRegion, row: number, column: number): any {
    if (region === 'row-header') {
      return `R: ${row}, ${column}`;
    }
    if (region === 'column-header') {
      return `C: ${row}, ${column}`;
    }
    if (region === 'corner-header') {
      return `N: ${row}, ${column}`;
    }
    return `(${row}, ${column})`;
  }

  groupCount(region: DataModel.RowRegion): number {
    if (region === 'body') {
      return 3;
    } else if (region === 'column-header') {
      return 1;
    } else if (region === 'row-header') {
      return 1;
    } else if (region === 'corner-header') {
      return 1;
    }
    return 0;
  }

  group(region: DataModel.CellRegion, groupIndex: number): CellGroup | null {
    if (region === 'body') {
      return [{startRow: 1, startColumn: 1, endRow: 2, endColumn: 2},
              {startRow: 5, startColumn: 1, endRow: 5, endColumn: 2},
              {startRow: 3, startColumn: 5, endRow: 4, endColumn: 5}][groupIndex];
    }

    if (region === 'column-header') {
      return [{startRow: 0, startColumn: 4, endRow: 1, endColumn: 4}][groupIndex];
    }

    if (region === 'row-header') {
      return [{startRow: 0, startColumn: 0, endRow: 1, endColumn: 1}][groupIndex];
    }

    if (region === 'corner-header') {
      return [{startRow: 0, startColumn: 0, endRow: 1, endColumn: 1}][groupIndex];
    }

    return null;
  }
}


function main(): void {

  let model1 = new LargeDataModel();
  let greenStripeStyle: DataGrid.Style = {
    ...DataGrid.defaultStyle,
    rowBackgroundColor: i => i % 2 === 0 ? 'rgba(64, 115, 53, 0.2)' : ''
  };

  let grid1 = new DataGrid();
  // let grid1 = new DataGrid({ style: greenStripeStyle });
  grid1.dataModel = model1;
  grid1.keyHandler = new BasicKeyHandler();
  grid1.mouseHandler = new BasicMouseHandler();
  grid1.selectionModel = new BasicSelectionModel({ dataModel: model1 });

  let model5 = new JSONModel(Data.nestedData);

  let grid5 = new DataGrid({
    style: greenStripeStyle,
    defaultSizes: {
      rowHeight: 32,
      columnWidth: 128,
      rowHeaderWidth: 64,
      columnHeaderHeight: 32
    }
  });

  grid5.dataModel = model5;
  grid5.keyHandler = new BasicKeyHandler();
  grid5.mouseHandler = new BasicMouseHandler();
  grid5.selectionModel = new BasicSelectionModel({
    dataModel: model5,
    selectionMode: 'row'
  });

  let dock = new DockPanel();
  dock.id = 'dock';

  dock.addWidget(grid1);
  window.onresize = () => { dock.update(); };
  Widget.attach(dock, document.body);
}

window.onload = main;

namespace Data {
  export
  const cars = {
    "data": [
      {
        "Horsepower": 130.0,
        "Origin": "USA",
        "Miles_per_Gallon": 18.0,
        "Name": "chevrolet chevelle malibu",
        "index": 0,
        "Acceleration": 12.0,
        "Year": "1970-01-01",
        "Weight_in_lbs": 3504,
        "Cylinders": 8,
        "Displacement": 307.0
      },
      {
        "Horsepower": 165.0,
        "Origin": "USA",
        "Miles_per_Gallon": 15.0,
        "Name": "buick skylark 320",
        "index": 1,
        "Acceleration": 11.5,
        "Year": "1970-01-01",
        "Weight_in_lbs": 3693,
        "Cylinders": 8,
        "Displacement": 350.0
      },
      {
        "Horsepower": 150.0,
        "Origin": "USA",
        "Miles_per_Gallon": 18.0,
        "Name": "plymouth satellite",
        "index": 2,
        "Acceleration": 11.0,
        "Year": "1970-01-01",
        "Weight_in_lbs": 3436,
        "Cylinders": 8,
        "Displacement": 318.0
      },
      {
        "Horsepower": 150.0,
        "Origin": "USA",
        "Miles_per_Gallon": 16.0,
        "Name": "amc rebel sst",
        "index": 3,
        "Acceleration": 12.0,
        "Year": "1970-01-01",
        "Weight_in_lbs": 3433,
        "Cylinders": 8,
        "Displacement": 304.0
      }
    ],
    "schema": {
      "primaryKey": [
        "index"
      ],
      "fields": [
        {
          "name": "index",
          "type": "integer"
        },
        {
          "name": "Acceleration",
          "type": "number"
        },
        {
          "name": "Cylinders",
          "type": "integer"
        },
        {
          "name": "Displacement",
          "type": "number"
        },
        {
          "name": "Horsepower",
          "type": "number"
        },
        {
          "name": "Miles_per_Gallon",
          "type": "number"
        },
        {
          "name": "Name",
          "type": "string"
        },
        {
          "name": "Origin",
          "type": "string"
        },
        {
          "name": "Weight_in_lbs",
          "type": "integer"
        },
        {
          "name": "Year",
          "type": "string"
        }
      ],
      "pandas_version": "0.20.0"
    }
  }

  export
  const nestedData = {
    "schema": {
      "fields": [
        {
          "name": "('year', '')",
          "type": "number",
          "rows": [
            "year",
            ""
          ]
        },
        {
          "name": "('visit', '')",
          "type": "number",
          "rows": [
            "visit",
            ""
          ]
        },
        {
          "name": "('Bob', 'HR')",
          "type": "number",
          "rows": [
            "Bob",
            "HR"
          ]
        },
        {
          "name": "('Bob', 'Temp')",
          "type": "number",
          "rows": [
            "Bob",
            "Temp"
          ]
        },
        {
          "name": "('Guido', 'HR')",
          "type": "number",
          "rows": [
            "Guido",
            "HR"
          ]
        },
        {
          "name": "('Guido', 'Temp')",
          "type": "number",
          "rows": [
            "Guido",
            "Temp"
          ]
        },
        {
          "name": "('Sue', 'HR')",
          "type": "number",
          "rows": [
            "Sue",
            "HR"
          ]
        },
        {
          "name": "('Sue', 'Temp')",
          "type": "number",
          "rows": [
            "Sue",
            "Temp"
          ]
        },
        {
          "name": "('ipydguuid', '')",
          "type": "number",
          "rows": [
            "ipydguuid",
            ""
          ]
        }
      ],
      "primaryKey": [
        "('year', '')",
        "('visit', '')",
        "('ipydguuid', '')"
      ],
      "primaryKeyUuid": "ipydguuid"
    },
    "data": [
      {
        "('year', '')": 2013,
        "('visit', '')": 1,
        "('Bob', 'HR')": 41,
        "('Bob', 'Temp')": 37.1,
        "('Guido', 'HR')": 50,
        "('Guido', 'Temp')": 37.7,
        "('Sue', 'HR')": 23,
        "('Sue', 'Temp')": 37.5,
        "('ipydguuid', '')": 0,
        "ipydguuid": 0
      },
      {
        "('year', '')": 2013,
        "('visit', '')": 2,
        "('Bob', 'HR')": 28,
        "('Bob', 'Temp')": 35.2,
        "('Guido', 'HR')": 35,
        "('Guido', 'Temp')": 37.1,
        "('Sue', 'HR')": 48,
        "('Sue', 'Temp')": 37.1,
        "('ipydguuid', '')": 1,
        "ipydguuid": 1
      },
      {
        "('year', '')": 2014,
        "('visit', '')": 1,
        "('Bob', 'HR')": 42,
        "('Bob', 'Temp')": 37.3,
        "('Guido', 'HR')": 42,
        "('Guido', 'Temp')": 37.4,
        "('Sue', 'HR')": 44,
        "('Sue', 'Temp')": 37.5,
        "('ipydguuid', '')": 2,
        "ipydguuid": 2
      },
      {
        "('year', '')": 2014,
        "('visit', '')": 2,
        "('Bob', 'HR')": 37,
        "('Bob', 'Temp')": 39.2,
        "('Guido', 'HR')": 31,
        "('Guido', 'Temp')": 35.1,
        "('Sue', 'HR')": 34,
        "('Sue', 'Temp')": 39,
        "('ipydguuid', '')": 3,
        "ipydguuid": 3
      }
    ]
  }
}


