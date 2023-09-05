import React, { useState } from "react";

interface DraggableTableRow {
  id: number;
  content: React.ReactNode;
}

interface DraggableTableProps {
  rows: DraggableTableRow[];
}

const DraggableTable: React.FC<DraggableTableProps> = ({ rows }) => {
  const [tableRows, setTableRows] = useState(rows);

  const handleDragStart = (event: React.DragEvent<HTMLTableRowElement>, index: number) => {
    event.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (event: React.DragEvent<HTMLTableRowElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLTableRowElement>, dropIndex: number) => {
    const dragIndex = Number(event.dataTransfer.getData("text/plain"));
    const draggedRow = tableRows[dragIndex];
    const updatedRows = tableRows.filter((_, index) => index !== dragIndex);

    updatedRows.splice(dropIndex, 0, draggedRow);

    setTableRows(updatedRows);
  };

  return (
    <table>
      <tbody>
        {tableRows.map((row, index) => (
          <tr
            key={row.id}
            draggable
            onDragStart={(event) => handleDragStart(event, index)}
            onDragOver={handleDragOver}
            onDrop={(event) => handleDrop(event, index)}
          >
            <td>{row.content}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DraggableTable;