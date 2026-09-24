import React from 'react';
import { NoteTable, TableRow } from '../types/note';
import { Table, Plus, Trash2, Columns, Rows, X } from 'lucide-react';

interface NoteTableEditorProps {
  tables: NoteTable[];
  onChangeTables: (tables: NoteTable[]) => void;
  textColor: 'light' | 'dark';
}

export const NoteTableEditor: React.FC<NoteTableEditorProps> = ({
  tables,
  onChangeTables,
  textColor,
}) => {
  // Add new table
  const handleAddNewTable = () => {
    const newTable: NoteTable = {
      id: `tbl_${Date.now()}`,
      title: 'جدول جديد',
      headers: ['البيان / العنصر', 'التفاصيل', 'ملاحظات'],
      rows: [
        { id: `row_1`, cells: ['', '', ''] },
        { id: `row_2`, cells: ['', '', ''] },
      ],
    };
    onChangeTables([...tables, newTable]);
  };

  // Delete table
  const handleDeleteTable = (tableId: string) => {
    onChangeTables(tables.filter((t) => t.id !== tableId));
  };

  // Update table title
  const handleUpdateTitle = (tableId: string, title: string) => {
    onChangeTables(
      tables.map((t) => (t.id === tableId ? { ...t, title } : t))
    );
  };

  // Update header cell
  const handleUpdateHeader = (tableId: string, colIndex: number, value: string) => {
    onChangeTables(
      tables.map((t) => {
        if (t.id === tableId) {
          const newHeaders = [...t.headers];
          newHeaders[colIndex] = value;
          return { ...t, headers: newHeaders };
        }
        return t;
      })
    );
  };

  // Update body cell
  const handleUpdateCell = (
    tableId: string,
    rowId: string,
    colIndex: number,
    value: string
  ) => {
    onChangeTables(
      tables.map((t) => {
        if (t.id === tableId) {
          const newRows = t.rows.map((r) => {
            if (r.id === rowId) {
              const newCells = [...r.cells];
              newCells[colIndex] = value;
              return { ...r, cells: newCells };
            }
            return r;
          });
          return { ...t, rows: newRows };
        }
        return t;
      })
    );
  };

  // Add Row
  const handleAddRow = (tableId: string) => {
    onChangeTables(
      tables.map((t) => {
        if (t.id === tableId) {
          const newRow: TableRow = {
            id: `row_${Date.now()}`,
            cells: new Array(t.headers.length).fill(''),
          };
          return { ...t, rows: [...t.rows, newRow] };
        }
        return t;
      })
    );
  };

  // Delete Row
  const handleDeleteRow = (tableId: string, rowId: string) => {
    onChangeTables(
      tables.map((t) => {
        if (t.id === tableId) {
          if (t.rows.length <= 1) return t; // keep at least 1 row
          return { ...t, rows: t.rows.filter((r) => r.id !== rowId) };
        }
        return t;
      })
    );
  };

  // Add Column
  const handleAddColumn = (tableId: string) => {
    onChangeTables(
      tables.map((t) => {
        if (t.id === tableId) {
          const newHeaders = [...t.headers, `عمود ${t.headers.length + 1}`];
          const newRows = t.rows.map((r) => ({
            ...r,
            cells: [...r.cells, ''],
          }));
          return { ...t, headers: newHeaders, rows: newRows };
        }
        return t;
      })
    );
  };

  // Delete Column
  const handleDeleteColumn = (tableId: string, colIndex: number) => {
    onChangeTables(
      tables.map((t) => {
        if (t.id === tableId) {
          if (t.headers.length <= 1) return t; // keep at least 1 col
          const newHeaders = t.headers.filter((_, idx) => idx !== colIndex);
          const newRows = t.rows.map((r) => ({
            ...r,
            cells: r.cells.filter((_, idx) => idx !== colIndex),
          }));
          return { ...t, headers: newHeaders, rows: newRows };
        }
        return t;
      })
    );
  };

  if (!tables || tables.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 pt-3 border-t border-black/10 dark:border-white/10">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold flex items-center gap-1.5 opacity-90">
          <Table className="w-4 h-4 text-emerald-500" />
          <span>الجداول المنظمة ({tables.length}):</span>
        </h4>
      </div>

      {tables.map((tbl) => (
        <div
          key={tbl.id}
          className={`p-3 rounded-2xl border backdrop-blur-sm space-y-2.5 shadow-sm ${
            textColor === 'light'
              ? 'bg-black/40 border-white/15 text-white'
              : 'bg-white/80 border-slate-300 text-slate-900'
          }`}
        >
          {/* Table Header Controls */}
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              value={tbl.title || ''}
              onChange={(e) => handleUpdateTitle(tbl.id, e.target.value)}
              placeholder="عنوان الجدول..."
              className="font-bold text-xs bg-transparent border-none focus:outline-none flex-1"
            />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleAddRow(tbl.id)}
                className="p-1 px-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[10px] font-bold flex items-center gap-0.5"
                title="إضافة صف"
              >
                <Rows className="w-3 h-3" />
                <span>+ صف</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddColumn(tbl.id)}
                className="p-1 px-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[10px] font-bold flex items-center gap-0.5"
                title="إضافة عمود"
              >
                <Columns className="w-3 h-3" />
                <span>+ عمود</span>
              </button>
              <button
                type="button"
                onClick={() => handleDeleteTable(tbl.id)}
                className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition"
                title="حذف الجدول"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table HTML Grid */}
          <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10 scrollbar-thin">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-500/20 border-b border-black/10 dark:border-white/10">
                  {tbl.headers.map((hdr, colIdx) => (
                    <th key={colIdx} className="p-2 font-bold min-w-[100px] relative group/th">
                      <div className="flex items-center justify-between gap-1">
                        <input
                          type="text"
                          value={hdr}
                          onChange={(e) => handleUpdateHeader(tbl.id, colIdx, e.target.value)}
                          className="w-full bg-transparent border-none focus:outline-none font-bold"
                          placeholder="الرأس..."
                        />
                        {tbl.headers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteColumn(tbl.id, colIdx)}
                            className="opacity-0 group-hover/th:opacity-100 p-0.5 text-rose-400 hover:text-rose-600 transition"
                            title="حذف هذا العمود"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="w-8 p-1"></th>
                </tr>
              </thead>
              <tbody>
                {tbl.rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition"
                  >
                    {row.cells.map((cellVal, colIdx) => (
                      <td key={colIdx} className="p-2 min-w-[100px]">
                        <input
                          type="text"
                          value={cellVal}
                          onChange={(e) =>
                            handleUpdateCell(tbl.id, row.id, colIdx, e.target.value)
                          }
                          className="w-full bg-transparent border-none focus:outline-none"
                          placeholder="..."
                        />
                      </td>
                    ))}
                    <td className="p-1 text-center">
                      {tbl.rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(tbl.id, row.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition opacity-60 hover:opacity-100"
                          title="حذف هذا الصف"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};
