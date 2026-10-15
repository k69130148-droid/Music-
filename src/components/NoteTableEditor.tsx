import React from 'react';
import { NoteTable, TableRow } from '../types/note';
import { Table, Plus, X } from 'lucide-react';

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
            id: `row_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            cells: new Array(t.headers.length).fill(''),
          };
          return { ...t, rows: [...t.rows, newRow] };
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

  // Remove table quietly without intrusive delete prompts
  const handleRemoveTable = (tableId: string) => {
    onChangeTables(tables.filter((t) => t.id !== tableId));
  };

  if (!tables || tables.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mb-4">
      {tables.map((tbl) => (
        <div
          key={tbl.id}
          className={`p-3.5 rounded-2xl border transition-all shadow-sm ${
            textColor === 'light'
              ? 'bg-black/35 border-white/20 text-white'
              : 'bg-white/85 border-slate-250 text-slate-900 shadow-slate-200/50'
          }`}
        >
          {/* Clean Table Top Bar without delete tools */}
          <div className="flex items-center justify-between gap-3 mb-2.5 px-0.5">
            <div className="flex items-center gap-2 flex-1">
              <Table className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <input
                type="text"
                value={tbl.title || ''}
                onChange={(e) => handleUpdateTitle(tbl.id, e.target.value)}
                placeholder="عنوان الجدول (اختياري)..."
                className="font-bold text-xs sm:text-sm bg-transparent border-none focus:outline-none flex-1 placeholder:opacity-40"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleAddColumn(tbl.id)}
                className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1 transition active:scale-95 cursor-pointer"
                title="إضافة عمود إضافي"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
                <span>عمود</span>
              </button>

              <button
                type="button"
                onClick={() => handleRemoveTable(tbl.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer"
                title="إغلاق الجدول"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Clean Table Grid - No Delete icons or clutter */}
          <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/15 scrollbar-thin">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-500/15 dark:bg-emerald-500/20 border-b border-black/10 dark:border-white/15">
                  {tbl.headers.map((hdr, colIdx) => (
                    <th key={colIdx} className="p-2.5 font-bold min-w-[110px]">
                      <input
                        type="text"
                        value={hdr}
                        onChange={(e) => handleUpdateHeader(tbl.id, colIdx, e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none font-black text-xs placeholder:opacity-50"
                        placeholder="عنوان العمود..."
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tbl.rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition"
                  >
                    {row.cells.map((cellVal, colIdx) => (
                      <td key={colIdx} className="p-2 min-w-[110px]">
                        <input
                          type="text"
                          value={cellVal}
                          onChange={(e) =>
                            handleUpdateCell(tbl.id, row.id, colIdx, e.target.value)
                          }
                          className="w-full bg-transparent border-none focus:outline-none text-xs"
                          placeholder="..."
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clean Add Row Button at the bottom */}
          <div className="pt-2 flex justify-start">
            <button
              type="button"
              onClick={() => handleAddRow(tbl.id)}
              className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>إضافة صف جديد</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
