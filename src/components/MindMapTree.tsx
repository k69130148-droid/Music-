import React from 'react';
import { BranchNode } from '../types/note';
import { GitFork, Plus, Trash2, ChevronDown, ChevronLeft, CornerDownLeft } from 'lucide-react';

interface MindMapTreeProps {
  branchRoots: BranchNode[];
  onChangeBranches: (roots: BranchNode[]) => void;
  textColor: 'light' | 'dark';
}

export const MindMapTree: React.FC<MindMapTreeProps> = ({
  branchRoots,
  onChangeBranches,
  textColor,
}) => {
  // Add new root node
  const handleAddRoot = () => {
    const newRoot: BranchNode = {
      id: `branch_${Date.now()}`,
      text: 'الفكرة أو المحور الرئيسي',
      children: [
        {
          id: `branch_${Date.now()}_1`,
          text: 'فرع ١',
          children: [],
        },
        {
          id: `branch_${Date.now()}_2`,
          text: 'فرع ٢',
          children: [],
        },
      ],
    };
    onChangeBranches([...branchRoots, newRoot]);
  };

  // Helper to recursively update a node text
  const updateNodeText = (nodes: BranchNode[], targetId: string, newText: string): BranchNode[] => {
    return nodes.map((node) => {
      if (node.id === targetId) {
        return { ...node, text: newText };
      }
      return {
        ...node,
        children: updateNodeText(node.children, targetId, newText),
      };
    });
  };

  // Helper to recursively add a child to a node
  const addChildNode = (nodes: BranchNode[], parentId: string): BranchNode[] => {
    return nodes.map((node) => {
      if (node.id === parentId) {
        const newChild: BranchNode = {
          id: `branch_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          text: `فرع فرعي جديد`,
          children: [],
        };
        return { ...node, children: [...node.children, newChild] };
      }
      return {
        ...node,
        children: addChildNode(node.children, parentId),
      };
    });
  };

  // Helper to recursively delete a node
  const deleteNode = (nodes: BranchNode[], targetId: string): BranchNode[] => {
    return nodes
      .filter((node) => node.id !== targetId)
      .map((node) => ({
        ...node,
        children: deleteNode(node.children, targetId),
      }));
  };

  // Recursive Branch Node Component
  const TreeNodeItem: React.FC<{
    node: BranchNode;
    depth: number;
  }> = ({ node, depth }) => {
    return (
      <div className="flex flex-col gap-1.5 relative my-1">
        <div className="flex items-center gap-1.5 group">
          {depth > 0 && (
            <span className="text-emerald-500/60 font-mono text-xs select-none">
              └─
            </span>
          )}

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all shadow-sm ${
              depth === 0
                ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400'
                : depth === 1
                ? 'bg-emerald-500/15 text-emerald-300 font-bold border-emerald-500/30'
                : textColor === 'light'
                ? 'bg-black/40 text-slate-200 border-white/10'
                : 'bg-white text-slate-800 border-slate-300'
            }`}
          >
            <input
              type="text"
              value={node.text}
              onChange={(e) =>
                onChangeBranches(updateNodeText(branchRoots, node.id, e.target.value))
              }
              placeholder="اكتب التفرع..."
              className="bg-transparent border-none focus:outline-none text-xs flex-1 min-w-[120px]"
            />

            {/* Add Sub-branch button */}
            <button
              type="button"
              onClick={() =>
                onChangeBranches(addChildNode(branchRoots, node.id))
              }
              className={`p-1 rounded-lg text-[10px] font-bold transition flex items-center gap-0.5 ${
                depth === 0
                  ? 'bg-slate-950/20 hover:bg-slate-950/40 text-slate-950'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
              title="إضافة تفرع فرعي"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
              <span className="text-[9px]">فرع</span>
            </button>

            {/* Delete button */}
            <button
              type="button"
              onClick={() =>
                onChangeBranches(deleteNode(branchRoots, node.id))
              }
              className={`p-1 rounded-lg transition opacity-60 hover:opacity-100 ${
                depth === 0
                  ? 'hover:text-rose-900 text-slate-900'
                  : 'hover:text-rose-400 text-slate-400'
              }`}
              title="حذف هذا التفرع"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Children indented */}
        {node.children && node.children.length > 0 && (
          <div className="mr-5 pr-2 border-r-2 border-emerald-500/20 flex flex-col">
            {node.children.map((child) => (
              <TreeNodeItem key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!branchRoots || branchRoots.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 pt-3 border-t border-black/10 dark:border-white/10">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold flex items-center gap-1.5 opacity-90">
          <GitFork className="w-4 h-4 text-emerald-500 rotate-90" />
          <span>الشبكة التفرعية وخريطة الأفكار:</span>
        </h4>
        <button
          type="button"
          onClick={handleAddRoot}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] shadow-sm transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>إضافة شبكة تفرعية</span>
        </button>
      </div>

      {branchRoots.map((root) => (
        <div
          key={root.id}
          className={`p-3.5 rounded-2xl border backdrop-blur-sm overflow-x-auto shadow-sm ${
            textColor === 'light'
              ? 'bg-black/30 border-white/10 text-white'
              : 'bg-white/80 border-slate-300 text-slate-900'
          }`}
        >
          <TreeNodeItem node={root} depth={0} />
        </div>
      ))}
    </div>
  );
};
