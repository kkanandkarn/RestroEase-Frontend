import React from "react";

const TableStructure = () => {
  return (
    <div className="w-full">
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="p-4 border-b bg-slate-400"></td>
          <td className="p-4 border-b bg-slate-400"></td>
          <td className="p-4 border-b bg-slate-400"></td>
          <td className="p-4 border-b bg-slate-400"></td>
          <td className="p-4 border-b bg-slate-400"></td>
          <td className="p-4 border-b bg-slate-400"></td>
          <td className="p-4 border-b bg-slate-400"></td>
        </tr>
      ))}
    </div>
  );
};

export default TableStructure;
