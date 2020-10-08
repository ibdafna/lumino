import { DataModel } from "./datamodel";
import { SectionList } from './sectionlist';

export interface CellGroup {
  startRow: number;
  endRow: number;
  startColumn: number;
  endColumn: number;
}

export namespace CellGroup {
  export function areCellsMerged(
    dataModel: DataModel,
    rgn: DataModel.CellRegion,
    cell1: number[],
    cell2: number[]
  ): boolean {
    const numGroups = dataModel.groupCount(rgn);
    const [row1, column1] = cell1;
    const [row2, column2] = cell2;

    for (let i = 0; i < numGroups; i++) {
      const group = dataModel.group(rgn, i)!;
      if (
        row1 >= group.startRow &&
        row1 <= group.endRow &&
        column1 >= group.startColumn &&
        column1 <= group.endColumn &&
        row2 >= group.startRow &&
        row2 <= group.endRow &&
        column2 >= group.startColumn &&
        column2 <= group.endColumn
      ) {
        return true;
      }
    }
    return false;
  }

  export function calculateMergeOffsets(
    dataModel: DataModel,
    regions: DataModel.CellRegion[],
    axis: "row" | "column",
    sectionList: SectionList,
    index: number
  ): [number, number, CellGroup] {

    let mergeStartOffset = 0;
    let mergeEndOffset = 0;
    let mergedCellGroups: CellGroup[] = [];

    for (const region of regions) {
      mergedCellGroups = mergedCellGroups.concat(
        getCellGroupsAtRegion(dataModel, region)
      );
    }

    let groupsAtAxis: CellGroup[] = [];

    if (axis === "row") {
      for (const region of regions) {
        groupsAtAxis = groupsAtAxis.concat(
          getCellGroupsAtRow(dataModel, region, index)
        );
      }
    } else {
      for (const region of regions) {
        groupsAtAxis = groupsAtAxis.concat(
          getCellGroupsAtColumn(dataModel, region, index)
        );
      }
    }

    if (groupsAtAxis.length === 0) {
      return [
        0,
        0,
        { startRow: -1, endRow: -1, startColumn: -1, endColumn: -1 },
      ];
    }

    let joinedGroup = groupsAtAxis[0];

    for (let g = 0; g < mergedCellGroups.length; g++) {
      const group = mergedCellGroups[g];
      if (areCellGroupsIntersectingAtAxis(joinedGroup, group, axis)) {
        joinedGroup = joinCellGroups([group, joinedGroup]);
        mergedCellGroups.splice(g, 1);
        g = 0;
      }
    }

    let minRow = joinedGroup.startRow;
    let maxRow = joinedGroup.endRow;

    for (let r = index - 1; r >= minRow; r--) {
      mergeStartOffset += sectionList.sizeOf(r);
    }

    for (let r = index + 1; r <= maxRow; r++) {
      mergeEndOffset += sectionList.sizeOf(r);
    }

    return [mergeStartOffset, mergeEndOffset, joinedGroup];
  }

  export function areCellGroupsIntersectingAtAxis(
    group1: CellGroup,
    group2: CellGroup,
    axis: "row" | "column"
  ): boolean {
    if (axis === "row") {
      return (
        (group1.startRow >= group2.startRow &&
          group1.startRow <= group2.endRow) ||
        (group1.endRow >= group2.startRow && group1.endRow <= group2.endRow) ||
        (group2.startRow >= group1.startRow &&
          group2.startRow <= group1.endRow) ||
        (group2.endRow >= group1.startRow && group2.endRow <= group1.endRow)
      );
    }
    return (
      (group1.startColumn >= group2.startColumn &&
        group1.startColumn <= group2.endColumn) ||
      (group1.endColumn >= group2.startColumn &&
        group1.endColumn <= group2.endColumn) ||
      (group2.startColumn >= group1.startColumn &&
        group2.startColumn <= group1.endColumn) ||
      (group2.endColumn >= group1.startColumn &&
        group2.endColumn <= group1.endColumn)
    );
  }

  export function areCellGroupsIntersecting(
    group1: CellGroup,
    group2: CellGroup
  ): boolean {
    return (
      ((group1.startRow >= group2.startRow &&
        group1.startRow <= group2.endRow) ||
        (group1.endRow >= group2.startRow && group1.endRow <= group2.endRow) ||
        (group2.startRow >= group1.startRow &&
          group2.startRow <= group1.endRow) ||
        (group2.endRow >= group1.startRow && group2.endRow <= group1.endRow)) &&
      ((group1.startColumn >= group2.startColumn &&
        group1.startColumn <= group2.endColumn) ||
        (group1.endColumn >= group2.startColumn &&
          group1.endColumn <= group2.endColumn) ||
        (group2.startColumn >= group1.startColumn &&
          group2.startColumn <= group1.endColumn) ||
        (group2.endColumn >= group1.startColumn &&
          group2.endColumn <= group1.endColumn))
    );
  }

  export function getCellGroupsAtRegion(
    dataModel: DataModel,
    rgn: DataModel.CellRegion
  ): CellGroup[] {
    let groupsAtRegion: CellGroup[] = [];
    const numGroups = dataModel.groupCount(rgn);

    for (let i = 0; i < numGroups; i++) {
      const group = dataModel.group(rgn, i)!;
      groupsAtRegion.push(group);
    }
    return groupsAtRegion;
  }

  export function joinCellGroups(groups: CellGroup[]): CellGroup {
    let startRow = Number.MAX_VALUE;
    let endRow = Number.MIN_VALUE;
    let startColumn = Number.MAX_VALUE;
    let endColumn = Number.MIN_VALUE;

    for (const group of groups) {
      startRow = Math.min(startRow, group.startRow);
      endRow = Math.max(endRow, group.endRow);
      startColumn = Math.min(startColumn, group.startColumn);
      endColumn = Math.max(endColumn, group.endColumn);
    }

    return { startRow, endRow, startColumn, endColumn };
  }

  export function joinCellGroupsWithMergedCellGroups(
    dataModel: DataModel,
    group: CellGroup,
    region: DataModel.CellRegion
  ): CellGroup {
    let joinedGroup: CellGroup = { ...group };

    const mergedCellGroups: CellGroup[] = getCellGroupsAtRegion(dataModel, region);

    for (let g = 0; g < mergedCellGroups.length; g++) {
      const mergedGroup = mergedCellGroups[g];
      if (areCellGroupsIntersecting(joinedGroup, mergedGroup)) {
        joinedGroup = joinCellGroups([joinedGroup, mergedGroup]);
      }
    }

    return joinedGroup;
  }

  export function getCellGroupsAtRow(
    dataModel: DataModel,
    rgn: DataModel.CellRegion,
    row: number
  ): CellGroup[] {
    let groupsAtRow = [];
    const numGroups = dataModel.groupCount(rgn);

    for (let i = 0; i < numGroups; i++) {
      const group = dataModel.group(rgn, i)!;
      if (row >= group.startRow && row <= group.endRow) {
        groupsAtRow.push(group);
      }
    }
    return groupsAtRow;
  }

  export function getCellGroupsAtColumn(
    dataModel: DataModel,
    rgn: DataModel.CellRegion,
    column: number
  ): CellGroup[] {
    let groupsAtColumn = [];
    const numGroups = dataModel.groupCount(rgn);

    for (let i = 0; i < numGroups; i++) {
      const group = dataModel.group(rgn, i)!;
      if (column >= group.startColumn && column <= group.endColumn) {
        groupsAtColumn.push(group);
      }
    }
    return groupsAtColumn;
  }
}
